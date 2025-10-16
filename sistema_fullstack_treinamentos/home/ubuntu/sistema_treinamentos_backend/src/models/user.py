from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    google_token = db.Column(db.Text)  # Token OAuth do Google
    google_refresh_token = db.Column(db.Text)  # Refresh token do Google
    calendly_token = db.Column(db.Text)  # Token OAuth do Calendly
    calendly_refresh_token = db.Column(db.Text)  # Refresh token do Calendly
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    clientes = db.relationship('Cliente', backref='user', lazy=True)
    treinamentos = db.relationship('Treinamento', backref='user', lazy=True)
    lembretes = db.relationship('Lembrete', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'hasGoogleAuth': bool(self.google_token),
            'hasCalendlyAuth': bool(self.calendly_token)
        }
