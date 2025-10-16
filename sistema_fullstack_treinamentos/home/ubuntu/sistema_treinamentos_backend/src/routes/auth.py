from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models.user import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login simples apenas com username (sem senha)"""
    data = request.json
    username = data.get('username')
    
    if not username:
        return jsonify({'error': 'Username é obrigatório'}), 400
    
    # Buscar ou criar usuário
    user = User.query.filter_by(username=username).first()
    
    if not user:
        # Criar novo usuário automaticamente
        user = User(
            username=username,
            email=f"{username}@sistema.local"  # Email padrão
        )
        db.session.add(user)
        db.session.commit()
    
    # Criar token JWT
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Retorna informações do usuário atual"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/update-email', methods=['PUT'])
@jwt_required()
def update_email():
    """Atualizar email do usuário"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    data = request.json
    new_email = data.get('email')
    
    if not new_email:
        return jsonify({'error': 'Email é obrigatório'}), 400
    
    user.email = new_email
    db.session.commit()
    
    return jsonify(user.to_dict()), 200

