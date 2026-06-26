from flask import Blueprint, request, jsonify
from services.dificultad_service import DificultadService

dificultad_bp = Blueprint("dificultad", __name__, url_prefix="/dificultades")


@dificultad_bp.route("", methods=["POST"])
def crear_dificultad():
    """
    POST /dificultades
    Body JSON: { "tipoDificultad": "Principiante" }
    """
    datos = request.get_json(force=True) or {}
    try:
        resultado = DificultadService.crear(datos)
        return jsonify(resultado), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@dificultad_bp.route("/<int:id_dificultad>", methods=["PUT"])
def actualizar_dificultad(id_dificultad):
    """
    PUT /dificultades/<id_dificultad>
    Body JSON: { "tipoDificultad": "Avanzado" }
    """
    datos = request.get_json(force=True) or {}
    try:
        resultado = DificultadService.actualizar(id_dificultad, datos)
        return jsonify(resultado), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@dificultad_bp.route("/<int:id_dificultad>", methods=["DELETE"])
def eliminar_dificultad(id_dificultad):
    """
    DELETE /dificultades/<id_dificultad>
    Falla con 400 si algún curso está usando esta dificultad.
    """
    try:
        resultado = DificultadService.eliminar(id_dificultad)
        return jsonify(resultado), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
    

@dificultad_bp.route("", methods=["GET"])
def listar_dificultades():
    """GET /dificultades — Lista todas las dificultades."""
    try:
        return jsonify(DificultadService.listar()), 200
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500