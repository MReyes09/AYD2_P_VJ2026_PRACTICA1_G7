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