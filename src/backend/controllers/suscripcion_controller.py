from flask import Blueprint, request, jsonify
from services.suscripcion_service import SuscripcionService

suscripcion_bp = Blueprint("suscripcion", __name__)


@suscripcion_bp.route("/tarifas", methods=["GET"])
def listar_tarifas():
    """
    GET /tarifas
    Retorna todas las tarifas disponibles (Mensual, Trimestral, Anual).
    """
    try:
        resultado = SuscripcionService.listar_tarifas()
        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@suscripcion_bp.route("/suscripciones", methods=["POST"])
def adquirir_suscripcion():
    """
    POST /suscripciones
    Adquiere una suscripción para el estudiante.

    Body (JSON):
        idPersona  int  requerido
        idTarifa   int  requerido
    """
    datos = request.get_json(force=True) or {}

    try:
        resultado = SuscripcionService.adquirir(datos)
        return jsonify(resultado), 201

    except LookupError as e:
        return jsonify({"error": str(e)}), 404

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
    

@suscripcion_bp.route("/suscripciones/estudiante/<int:id_persona>", methods=["GET"])
def obtener_suscripcion_estudiante(id_persona):
    """
    GET /suscripciones/estudiante/<id_persona>
    Retorna la suscripción del estudiante con estado y tarifa incluidos.
    """
    try:
        resultado = SuscripcionService.obtener_por_estudiante(id_persona)
        return jsonify(resultado), 200
 
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
 
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500