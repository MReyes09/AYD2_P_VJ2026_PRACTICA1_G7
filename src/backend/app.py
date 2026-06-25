from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db

# Importar modelos para que SQLAlchemy los registre
import models

# Importar blueprints
from controllers.estudiante_controller import estudiante_bp
from controllers.curso_controller import curso_bp
# from controllers.auth_controller import auth_bp
# from controllers.persona_controller import persona_bp


def create_app() -> Flask:
    app = Flask(__name__)

    # Configuración
    app.config.from_object(Config)

    # Extensiones
    db.init_app(app)
    CORS(app)

    # Blueprints
    app.register_blueprint(estudiante_bp)
    app.register_blueprint(curso_bp)
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(persona_bp)

    # Endpoint de salud
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )