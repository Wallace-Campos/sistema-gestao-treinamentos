from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from src.models.user import db, User
from src.models.treinamento import Treinamento
from src.models.cliente import Cliente
from datetime import datetime, timedelta
import os

google_calendar_bp = Blueprint('google_calendar', __name__)

# Configuração OAuth do Google (você precisará criar credenciais no Google Cloud Console)
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'YOUR_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', 'YOUR_CLIENT_SECRET')
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']

@google_calendar_bp.route('/google/auth', methods=['GET'])
@jwt_required()
def google_auth():
    """Inicia o fluxo OAuth do Google"""
    user_id = get_jwt_identity()
    
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [f"{request.host_url}api/google/callback"]
            }
        },
        scopes=SCOPES,
        redirect_uri=f"{request.host_url}api/google/callback"
    )
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        state=str(user_id)
    )
    
    return jsonify({'auth_url': authorization_url}), 200

@google_calendar_bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Callback do OAuth do Google"""
    code = request.args.get('code')
    state = request.args.get('state')  # user_id
    
    if not code or not state:
        return jsonify({'error': 'Código ou state inválido'}), 400
    
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [f"{request.host_url}api/google/callback"]
            }
        },
        scopes=SCOPES,
        redirect_uri=f"{request.host_url}api/google/callback"
    )
    
    flow.fetch_token(code=code)
    credentials = flow.credentials
    
    # Salvar tokens no banco de dados
    user = User.query.get(int(state))
    if user:
        user.google_token = credentials.token
        user.google_refresh_token = credentials.refresh_token
        db.session.commit()
    
    return redirect('/')  # Redirecionar para o frontend

@google_calendar_bp.route('/google/sync', methods=['POST'])
@jwt_required()
def sync_google_calendar():
    """Sincroniza eventos do Google Calendar"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.google_token:
        return jsonify({'error': 'Usuário não autenticado com Google'}), 401
    
    # Criar credenciais
    credentials = Credentials(
        token=user.google_token,
        refresh_token=user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=SCOPES
    )
    
    # Construir serviço do Google Calendar
    service = build('calendar', 'v3', credentials=credentials)
    
    # Buscar eventos dos próximos 30 dias
    now = datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=100,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    events = events_result.get('items', [])
    
    # Processar eventos e criar treinamentos
    novos_treinamentos = []
    for event in events:
        # Verificar se o evento já foi importado
        google_event_id = event['id']
        existing = Treinamento.query.filter_by(
            user_id=user_id,
            google_event_id=google_event_id
        ).first()
        
        if existing:
            continue
        
        # Extrair informações do evento
        summary = event.get('summary', 'Treinamento')
        start = event['start'].get('dateTime', event['start'].get('date'))
        description = event.get('description', '')
        
        # Tentar identificar o cliente pelo nome no título
        cliente = None
        for c in Cliente.query.filter_by(user_id=user_id).all():
            if c.nome.lower() in summary.lower():
                cliente = c
                break
        
        if not cliente:
            continue  # Pular se não encontrar cliente
        
        # Criar treinamento
        treinamento = Treinamento(
            user_id=user_id,
            cliente_id=cliente.id,
            data=datetime.fromisoformat(start.replace('Z', '+00:00')),
            tipo='acompanhamento',
            resumo=description,
            status='agendado',
            google_event_id=google_event_id
        )
        
        db.session.add(treinamento)
        novos_treinamentos.append(treinamento.to_dict())
    
    db.session.commit()
    
    return jsonify({
        'message': f'{len(novos_treinamentos)} treinamentos sincronizados',
        'treinamentos': novos_treinamentos
    }), 200

