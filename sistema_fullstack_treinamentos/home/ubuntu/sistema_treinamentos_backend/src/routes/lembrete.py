from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import db
from src.models.lembrete import Lembrete
from datetime import datetime

lembrete_bp = Blueprint('lembrete', __name__)

@lembrete_bp.route('/lembretes', methods=['GET'])
@jwt_required()
def get_lembretes():
    user_id = get_jwt_identity()
    lembretes = Lembrete.query.filter_by(user_id=user_id).all()
    return jsonify([l.to_dict() for l in lembretes]), 200

@lembrete_bp.route('/lembretes', methods=['POST'])
@jwt_required()
def create_lembrete():
    user_id = get_jwt_identity()
    data = request.json
    
    lembrete = Lembrete(
        user_id=user_id,
        cliente_id=int(data.get('clienteId')),
        tipo=data.get('tipo', 'mensal'),
        mensagem=data.get('mensagem'),
        data_proxima=datetime.fromisoformat(data.get('dataProxima')).date() if data.get('dataProxima') else None
    )
    
    db.session.add(lembrete)
    db.session.commit()
    
    return jsonify(lembrete.to_dict()), 201

@lembrete_bp.route('/lembretes/<int:lembrete_id>', methods=['DELETE'])
@jwt_required()
def delete_lembrete(lembrete_id):
    user_id = get_jwt_identity()
    lembrete = Lembrete.query.filter_by(id=lembrete_id, user_id=user_id).first()
    
    if not lembrete:
        return jsonify({'error': 'Lembrete não encontrado'}), 404
    
    db.session.delete(lembrete)
    db.session.commit()
    
    return jsonify({'message': 'Lembrete excluído com sucesso'}), 200

