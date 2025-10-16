from src.models.user import db
from datetime import datetime

class Treinamento(db.Model):
    __tablename__ = 'treinamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    duracao = db.Column(db.Integer)  # em minutos
    tipo = db.Column(db.String(50), default='onboarding')
    resumo = db.Column(db.Text)
    conteudo_proximo = db.Column(db.Text)
    status = db.Column(db.String(50), default='agendado')
    link_google_agenda = db.Column(db.String(500))
    google_event_id = db.Column(db.String(200))  # ID do evento no Google Calendar
    calendly_event_id = db.Column(db.String(200))  # ID do evento no Calendly
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'clienteId': str(self.cliente_id),
            'data': self.data.isoformat() if self.data else None,
            'duracao': self.duracao,
            'tipo': self.tipo,
            'resumo': self.resumo,
            'conteudoProximo': self.conteudo_proximo,
            'status': self.status,
            'linkGoogleAgenda': self.link_google_agenda,
            'googleEventId': self.google_event_id,
            'calendlyEventId': self.calendly_event_id
        }

