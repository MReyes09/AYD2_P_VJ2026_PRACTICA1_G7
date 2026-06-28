from flask import Blueprint, request, jsonify
from services.mis_cursos_service import MisCursosService

mis_cursos_bp = Blueprint("mis_cursos", __name__, url_prefix="/api/mis-cursos")
service = MisCursosService()


@mis_cursos_bp.route("/<int:id_persona>", methods=["GET"])
def get_mis_cursos(id_persona):
    """
    GET /api/mis-cursos/<idPersona>
    Devuelve los cursos inscritos del estudiante con su progreso.
    """
    cursos = service.get_cursos_del_estudiante(id_persona)
    return jsonify({"ok": True, "data": cursos}), 200


@mis_cursos_bp.route("/<int:id_persona>/curso/<int:id_curso>/contenidos", methods=["GET"])
def get_contenidos(id_persona, id_curso):
    """
    GET /api/mis-cursos/<idPersona>/curso/<idCurso>/contenidos
    Devuelve los contenidos del curso indicando cuáles ya fueron vistos.
    """
    contenidos = service.get_contenidos_del_curso(id_curso, id_persona)
    return jsonify({"ok": True, "data": contenidos}), 200


@mis_cursos_bp.route("/vista", methods=["POST"])
def registrar_vista():
    """
    POST /api/mis-cursos/vista
    Body JSON: { "idPersona": 1, "idContenido": 3 }
    Registra que el estudiante reprodujo un contenido.
    """
    body = request.get_json()
    id_persona   = body.get("idPersona")
    id_contenido = body.get("idContenido")

    if not id_persona or not id_contenido:
        return jsonify({"ok": False, "mensaje": "idPersona e idContenido son requeridos"}), 400

    resultado = service.registrar_vista(id_persona, id_contenido)
    return jsonify({"ok": True, "data": resultado}), 201