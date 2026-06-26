from flask import Blueprint, jsonify, request
from services.auth_service import AuthService, CredencialesInvalidasError, UsuarioNoEncontradoError

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    mail = body.get("mail")
    password = body.get("password")

    if not mail or not password:
        return jsonify({"error": "Faltan campos requeridos"}), 400

    try:
        resultado = AuthService.login(mail, password)
        return jsonify(resultado), 200

    except UsuarioNoEncontradoError as e:
        return jsonify({"error": str(e)}), 404

    except CredencialesInvalidasError as e:
        return jsonify({"error": str(e)}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500