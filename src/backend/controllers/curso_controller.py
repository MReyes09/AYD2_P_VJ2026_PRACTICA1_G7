from flask import Blueprint, request, jsonify
from services.curso_service import CursoService

curso_bp = Blueprint("curso", __name__, url_prefix="/api/cursos")
service = CursoService()


@curso_bp.route("", methods=["GET"])
def buscar_cursos():
    """
    GET /api/cursos
    Query params opcionales:
      - titulo       (str)
      - idTematica   (int)
      - idDificultad (int)
    """
    titulo       = request.args.get("titulo", "").strip() or None
    id_tematica  = request.args.get("idTematica",  type=int)
    id_dificultad = request.args.get("idDificultad", type=int)

    cursos = service.buscar_cursos(titulo, id_tematica, id_dificultad)
    return jsonify({"ok": True, "data": cursos}), 200


@curso_bp.route("/filtros", methods=["GET"])
def get_filtros():
    """
    GET /api/cursos/filtros
    Devuelve las listas de categorías y niveles para poblar los dropdowns.
    """
    filtros = service.get_filtros()
    return jsonify({"ok": True, "data": filtros}), 200


@curso_bp.route("/top10", methods=["GET"])
def get_top10():
    """
    GET /api/cursos/top10
    Devuelve los 10 cursos con más reproducciones.
    """
    cursos = service.get_top10_cursos()
    return jsonify({"ok": True, "data": cursos}), 200

@curso_bp.route("/recomendados/<int:id_persona>", methods=["GET"])
def get_recomendados(id_persona):
    """
    GET /api/cursos/recomendados/<idPersona>

    - Con historial: devuelve cursos de la temática más vista por ese usuario.
    - Sin historial: devuelve los cursos más populares globalmente.
    - En ambos casos excluye cursos en los que ya está inscrito.
    """
    resultado = service.get_recomendados(id_persona)
    return jsonify({"ok": True, "data": resultado}), 200