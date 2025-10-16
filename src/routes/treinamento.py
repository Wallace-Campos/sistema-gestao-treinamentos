from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import db
from src.models.treinamento import Treinamento
from datetime import datetime

treinamento_bp = Blueprint('treinamento', __name__)

@treinamento_bp.route('/treinamentos', methods=['GET'])
@jwt_required()
def get_treinamentos():
    user_id = get_jwt_identity()
    treinamentos = Treinamento.query.filter_by(user_id=user_id).all()
    return jsonify([t.to_dict() for t in treinamentos]), 200

@treinamento_bp.route('/treinamentos', methods=['POST'])
@jwt_required()
def create_treinamento():
    user_id = get_jwt_identity()
    data = request.json
    
    treinamento = Treinamento(
        user_id=user_id,
        cliente_id=int(data.get('clienteId')),
        data=datetime.fromisoformat(data.get('data').replace('Z', '+00:00')),
        duracao=data.get('duracao'),
        tipo=data.get('tipo', 'onboarding'),
        resumo=data.get('resumo'),
        conteudo_proximo=data.get('conteudoProximo'),
        status=data.get('status', 'agendado'),
        link_google_agenda=data.get('linkGoogleAgenda')
    )
    
    db.session.add(treinamento)
    db.session.commit()
    
    return jsonify(treinamento.to_dict()), 201

@treinamento_bp.route('/treinamentos/<int:treinamento_id>', methods=['PUT'])
@jwt_required()
def update_treinamento(treinamento_id):
    user_id = get_jwt_identity()
    treinamento = Treinamento.query.filter_by(id=treinamento_id, user_id=user_id).first()
    
    if not treinamento:
        return jsonify({'error': 'Treinamento não encontrado'}), 404
    
    data = request.json
    if data.get('data'):
        treinamento.data = datetime.fromisoformat(data.get('data').replace('Z', '+00:00'))
    treinamento.duracao = data.get('duracao', treinamento.duracao)
    treinamento.tipo = data.get('tipo', treinamento.tipo)
    treinamento.resumo = data.get('resumo', treinamento.resumo)
    treinamento.conteudo_proximo = data.get('conteudoProximo', treinamento.conteudo_proximo)
    treinamento.status = data.get('status', treinamento.status)
    
    db.session.commit()
    
    return jsonify(treinamento.to_dict()), 200

@treinamento_bp.route('/treinamentos/<int:treinamento_id>', methods=['DELETE'])
@jwt_required()
def delete_treinamento(treinamento_id):
    user_id = get_jwt_identity()
    treinamento = Treinamento.query.filter_by(id=treinamento_id, user_id=user_id).first()
    
    if not treinamento:
        return jsonify({'error': 'Treinamento não encontrado'}), 404
    
    db.session.delete(treinamento)
    db.session.commit()
    
    return jsonify({'message': 'Treinamento excluído com sucesso'}), 200

