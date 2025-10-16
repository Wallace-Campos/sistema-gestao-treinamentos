from src.models.user import db
from datetime import datetime

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    empresa = db.Column(db.String(200))
    perfil = db.Column(db.Text)
    licencas = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='ativo')
    login = db.Column(db.String(100))
    senha = db.Column(db.String(100))
    link_acesso = db.Column(db.String(500))
    materiais_personalizados = db.Column(db.Text)
    possui_credito = db.Column(db.Boolean, default=False)
    somente_showroom = db.Column(db.Boolean, default=False)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    treinamentos = db.relationship('Treinamento', backref='cliente', lazy=True, cascade='all, delete-orphan')
    lembretes = db.relationship('Lembrete', backref='cliente', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nome': self.nome,
            'email': self.email,
            'empresa': self.empresa,
            'perfil': self.perfil,
            'licencas': self.licencas,
            'status': self.status,
            'login': self.login,
            'senha': self.senha,
            'linkAcesso': self.link_acesso,
            'materiaisPersonalizados': self.materiais_personalizados,
            'possuiCredito': self.possui_credito,
            'somenteShowroom': self.somente_showroom,
            'dataCadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }

