from flask import Blueprint, request, jsonify
from services.tipo_contenido_service import TipoContenidoService

tipo_contenido_bp = Blueprint("tipo_contenido", __name__, url_prefix="/tipos-contenido")


@tipo_contenido_bp.route("", methods=["GET"])
def listar():
    try:
        return jsonify(TipoContenidoService.listar()), 200
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tipo_contenido_bp.route("", methods=["POST"])
def crear():
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(TipoContenidoService.crear(datos)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tipo_contenido_bp.route("/<int:id_tipo>", methods=["PUT"])
def actualizar(id_tipo):
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(TipoContenidoService.actualizar(id_tipo, datos)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@tipo_contenido_bp.route("/<int:id_tipo>", methods=["DELETE"])
def eliminar(id_tipo):
    try:
        return jsonify(TipoContenidoService.eliminar(id_tipo)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500