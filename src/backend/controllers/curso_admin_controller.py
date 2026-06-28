from flask import Blueprint, request, jsonify
from services.curso_admin_service import CursoAdminService

curso_admin_bp = Blueprint("curso_admin", __name__, url_prefix="/admin/cursos")


@curso_admin_bp.route("", methods=["POST"])
def crear_curso():
    """
    POST /admin/cursos
    Body JSON:
        nombreCurso     str  requerido
        descripcion     str  requerido
        anioProduccion  int  requerido
        idDificultad    int  requerido
        idPersona       int  requerido
        idTematica      int  requerido
        resumen         str  opcional
    """
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(CursoAdminService.crear(datos)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@curso_admin_bp.route("/<int:id_curso>/contenido", methods=["POST"])
def agregar_contenido(id_curso):
    """
    POST /admin/cursos/<id_curso>/contenido
    Body JSON:
        titulo           str  requerido
        pathContenido    str  requerido  (URL del video o archivo)
        descripcion      str  opcional
        idTipoContenido  int  opcional
    """
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(CursoAdminService.agregar_contenido(id_curso, datos)), 201
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
    

@curso_admin_bp.route("/<int:id_curso>/contenido", methods=["GET"])
def ver_contenido(id_curso):
    """GET /admin/cursos/<id_curso>/contenido — Lista todo el contenido del curso."""
    try:
        return jsonify(CursoAdminService.ver_contenido(id_curso)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
 
 
@curso_admin_bp.route("/contenido/<int:id_contenido>", methods=["PUT"])
def actualizar_contenido(id_contenido):
    """
    PUT /admin/cursos/contenido/<id_contenido>
    Actualiza los campos enviados. Todos son opcionales.
    """
    datos = request.get_json(force=True) or {}
    try:
        return jsonify(CursoAdminService.actualizar_contenido(id_contenido, datos)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
 
 
@curso_admin_bp.route("/contenido/<int:id_contenido>", methods=["DELETE"])
def eliminar_contenido(id_contenido):
    """DELETE /admin/cursos/contenido/<id_contenido> — Elimina el contenido."""
    try:
        return jsonify(CursoAdminService.eliminar_contenido(id_contenido)), 200
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500