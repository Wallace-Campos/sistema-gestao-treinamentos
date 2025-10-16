import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from src.models.user import db
from src.models.cliente import Cliente
from src.models.treinamento import Treinamento
from src.models.lembrete import Lembrete
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.cliente import cliente_bp
from src.routes.treinamento import treinamento_bp
from src.routes.lembrete import lembrete_bp
from src.routes.google_calendar import google_calendar_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT-sistema-treinamentos-2025'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-sistema-treinamentos-2025'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)  # Token válido por 30 dias

# CORS - Permitir requisições do frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# JWT
jwt = JWTManager(app)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(cliente_bp, url_prefix='/api')
app.register_blueprint(treinamento_bp, url_prefix='/api')
app.register_blueprint(lembrete_bp, url_prefix='/api')
app.register_blueprint(google_calendar_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

