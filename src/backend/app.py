from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from extensions import db
from extensions import db, bcrypt


# Importar modelos para que SQLAlchemy los registre
import models
import os

# Importar blueprints
from controllers.estudiante_controller import estudiante_bp
from controllers.curso_controller import curso_bp
from controllers.mis_cursos_controller import mis_cursos_bp
from controllers.auth_controller import auth_bp
from controllers.suscripcion_controller import suscripcion_bp
from controllers.dificultad_controller import dificultad_bp
from controllers.tematica_controller import tematica_bp
from controllers.tipo_contenido_controller import tipo_contenido_bp
from controllers.curso_admin_controller import curso_admin_bp
from controllers.estudiante_curso_controller import estudiante_curso_bp
# from controllers.persona_controller import persona_bp


def create_app() -> Flask:
    app = Flask(__name__)

    # Configuración
    app.config.from_object(Config)

    # Extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Blueprints
    app.register_blueprint(estudiante_bp)
    app.register_blueprint(curso_bp)
    app.register_blueprint(mis_cursos_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(suscripcion_bp)
    app.register_blueprint(dificultad_bp)
    app.register_blueprint(tematica_bp)
    app.register_blueprint(tipo_contenido_bp)
    app.register_blueprint(curso_admin_bp)
    app.register_blueprint(estudiante_curso_bp)
    # app.register_blueprint(persona_bp)

    # Endpoint para servir fotografías
    @app.route("/uploads/<path:filename>")
    def servir_foto(filename):
        carpeta = os.path.join(os.path.dirname(__file__), "uploads")
        return send_from_directory(carpeta, filename)

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