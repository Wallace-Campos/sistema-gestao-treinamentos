from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import db
from src.models.cliente import Cliente

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/clientes', methods=['GET'])
@jwt_required()
def get_clientes():
    user_id = get_jwt_identity()
    clientes = Cliente.query.filter_by(user_id=user_id).all()
    return jsonify([cliente.to_dict() for cliente in clientes]), 200

@cliente_bp.route('/clientes', methods=['POST'])
@jwt_required()
def create_cliente():
    user_id = get_jwt_identity()
    data = request.json
    
    cliente = Cliente(
        user_id=user_id,
        nome=data.get('nome'),
        email=data.get('email'),
        empresa=data.get('empresa'),
        perfil=data.get('perfil'),
        licencas=data.get('licencas', 1),
        status=data.get('status', 'ativo'),
        login=data.get('login'),
        senha=data.get('senha'),
        link_acesso=data.get('linkAcesso'),
        materiais_personalizados=data.get('materiaisPersonalizados'),
        possui_credito=data.get('possuiCredito', False),
        somente_showroom=data.get('somenteShowroom', False)
    )
    
    db.session.add(cliente)
    db.session.commit()
    
    return jsonify(cliente.to_dict()), 201

@cliente_bp.route('/clientes/<int:cliente_id>', methods=['PUT'])
@jwt_required()
def update_cliente(cliente_id):
    user_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(id=cliente_id, user_id=user_id).first()
    
    if not cliente:
        return jsonify({'error': 'Cliente não encontrado'}), 404
    
    data = request.json
    cliente.nome = data.get('nome', cliente.nome)
    cliente.email = data.get('email', cliente.email)
    cliente.empresa = data.get('empresa', cliente.empresa)
    cliente.perfil = data.get('perfil', cliente.perfil)
    cliente.licencas = data.get('licencas', cliente.licencas)
    cliente.status = data.get('status', cliente.status)
    cliente.login = data.get('login', cliente.login)
    cliente.senha = data.get('senha', cliente.senha)
    cliente.link_acesso = data.get('linkAcesso', cliente.link_acesso)
    cliente.materiais_personalizados = data.get('materiaisPersonalizados', cliente.materiais_personalizados)
    cliente.possui_credito = data.get('possuiCredito', cliente.possui_credito)
    cliente.somente_showroom = data.get('somenteShowroom', cliente.somente_showroom)
    
    db.session.commit()
    
    return jsonify(cliente.to_dict()), 200

@cliente_bp.route('/clientes/<int:cliente_id>', methods=['DELETE'])
@jwt_required()
def delete_cliente(cliente_id):
    user_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(id=cliente_id, user_id=user_id).first()
    
    if not cliente:
        return jsonify({'error': 'Cliente não encontrado'}), 404
    
    db.session.delete(cliente)
    db.session.commit()
    
    return jsonify({'message': 'Cliente excluído com sucesso'}), 200

