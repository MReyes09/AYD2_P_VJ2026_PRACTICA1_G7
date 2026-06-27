from flask import Blueprint, request, jsonify
from services.tematica_service import TematicaService

tematica_bp = Blueprint("tematica", __name__, url_prefix="/tematicas")


@tematica_bp.route("", methods=["GET"])
def listar_tematicas():
    try:
        return jsonify(TematicaService.listar()), 200
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tematica_bp.route("", methods=["POST"])
def crear_tematica():
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(TematicaService.crear(datos)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tematica_bp.route("/<int:id_tematica>", methods=["PUT"])
def actualizar_tematica(id_tematica):
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(TematicaService.actualizar(id_tematica, datos)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tematica_bp.route("/<int:id_tematica>", methods=["DELETE"])
def eliminar_tematica(id_tematica):
    try:
        return jsonify(TematicaService.eliminar(id_tematica)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500