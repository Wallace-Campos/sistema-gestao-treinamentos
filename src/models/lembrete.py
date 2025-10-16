from src.models.user import db
from datetime import datetime

class Lembrete(db.Model):
    __tablename__ = 'lembretes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    tipo = db.Column(db.String(50), default='mensal')
    mensagem = db.Column(db.Text, nullable=False)
    data_proxima = db.Column(db.Date)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'clienteId': str(self.cliente_id),
            'tipo': self.tipo,
            'mensagem': self.mensagem,
            'dataProxima': self.data_proxima.isoformat() if self.data_proxima else None
        }

