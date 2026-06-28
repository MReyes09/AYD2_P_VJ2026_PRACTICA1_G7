from flask import Blueprint, request, jsonify
from services.estudiante_service import EstudianteService

estudiante_bp = Blueprint("estudiante", __name__, url_prefix="/estudiantes")


@estudiante_bp.route("", methods=["POST"])
def registrar_estudiante():
    """
    POST /estudiantes
    Acepta multipart/form-data (con foto) o application/json (sin foto).

    Body esperado (form-data o JSON):
        nombreCompleto   str  requerido
        mail             str  requerido
        contrasenia      str  requerido
        fechaNacimiento  str  opcional   YYYY-MM-DD
        nit              str  opcional
        numeroTarjeta    str  requerido
        fechaVencimiento str  requerido  YYYY-MM o YYYY-MM-DD
        fotografia       file opcional  (solo multipart)
    """
    # Soporte para multipart/form-data y application/json
    if request.content_type and "multipart/form-data" in request.content_type:
        datos = request.form.to_dict()
        archivo_foto = request.files.get("fotografia")
    else:
        datos = request.get_json(force=True) or {}
        archivo_foto = None

    try:
        resultado = EstudianteService.registrar(datos, archivo_foto)
        return jsonify(resultado), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # En producción usa logging en lugar de exponer el mensaje
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500


@estudiante_bp.route("/<int:id_persona>", methods=["GET"])
def obtener_perfil(id_persona):
    """
    GET /estudiantes/<id_persona>
    Retorna el perfil completo del estudiante junto con sus tarjetas.
    """
    try:
        resultado = EstudianteService.obtener_perfil(id_persona)
        return jsonify(resultado), 200
 
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
 
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
    

@estudiante_bp.route("/<int:id_persona>", methods=["PUT"])
def actualizar_estudiante(id_persona):
    """
    PUT /estudiantes/<id_persona>
    Actualiza los datos personales del estudiante.
    Acepta multipart/form-data (con foto) o application/json (sin foto).
    Solo se modifican los campos que se envíen.
    """
    if request.content_type and "multipart/form-data" in request.content_type:
        datos = request.form.to_dict()
        archivo_foto = request.files.get("fotografia")
    else:
        datos = request.get_json(force=True) or {}
        archivo_foto = None
 
    try:
        resultado = EstudianteService.actualizar(id_persona, datos, archivo_foto)
        return jsonify(resultado), 200
 
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
 
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
 
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500
    


@estudiante_bp.route("/<int:id_persona>/tarjeta", methods=["PUT"])
def actualizar_tarjeta(id_persona):
    """
    PUT /estudiantes/<id_persona>/tarjeta
    Reemplaza la tarjeta de pago del estudiante.
 
    Body (JSON o form-data):
        numeroTarjeta    str  requerido
        fechaVencimiento str  requerido  YYYY-MM o YYYY-MM-DD
    """
    if request.content_type and "multipart/form-data" in request.content_type:
        datos = request.form.to_dict()
    else:
        datos = request.get_json(force=True) or {}
 
    try:
        resultado = EstudianteService.actualizar_tarjeta(id_persona, datos)
        return jsonify(resultado), 200
 
    except LookupError as e:
        return jsonify({"error": str(e)}), 404
 
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
 
    except Exception as e:
        return jsonify({"error": "Error interno del servidor.", "detalle": str(e)}), 500