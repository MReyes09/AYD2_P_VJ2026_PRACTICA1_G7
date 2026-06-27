from flask import Blueprint, request, jsonify
from services.estudiante_curso_service import EstudianteCursoService

estudiante_curso_bp = Blueprint(
    "estudiante_curso", __name__, url_prefix="/api/inscripciones"
)
service = EstudianteCursoService()


@estudiante_curso_bp.route("", methods=["POST"])
def inscribir():
    """
    POST /api/inscripciones
    Body: { "idPersona": 1, "idCurso": 3 }
    ├── Sin suscripción activa  → 403 → alert "Adquiere un plan..."
      ├── Ya inscrito             → 409 → botón "Ya inscrito" (gris)
      └── OK                      → 201 → botón "✓ Inscrito" (verde)
                                        → aparece en Mis Cursos
    """
    body = request.get_json()
    id_persona = body.get("idPersona")
    id_curso   = body.get("idCurso")

    if not id_persona or not id_curso:
        return jsonify({"ok": False, "mensaje": "idPersona e idCurso son requeridos."}), 400

    try:
        resultado = service.inscribir(id_persona, id_curso)
        return jsonify({"ok": True, "data": resultado}), 201

    except PermissionError as e:
        return jsonify({"ok": False, "mensaje": str(e)}), 403

    except ValueError as e:
        return jsonify({"ok": False, "mensaje": str(e)}), 409

    except Exception as e:
        return jsonify({"ok": False, "mensaje": "Error interno.", "detalle": str(e)}), 500