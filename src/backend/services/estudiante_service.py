import os
import uuid
from datetime import date, datetime

from extensions import db
from models.persona import Persona
from models.tarjeta import Tarjeta
from repositories.persona_repositories import PersonaRepository
from repositories.tarjeta_repositories import TarjetaRepository
from repositories.rol_repositories import RolRepository
from extensions import db, bcrypt

# Carpeta donde se guardan las fotografías
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads", "fotografias")


class EstudianteService:

    # ------------------------------------------------------------------
    # Registro de estudiante
    # ------------------------------------------------------------------
    @staticmethod
    def registrar(datos: dict, archivo_foto=None) -> dict:
        """
        Crea una Persona con rol 'estudiante' y su Tarjeta.
 
        Parámetros esperados en `datos`:
            nombreCompleto  str   requerido
            mail            str   requerido, único
            contrasenia     str   requerido (máx 10 chars según esquema)
            fechaNacimiento str   opcional  (YYYY-MM-DD)
            nit             int   opcional
            numeroTarjeta   str   requerido  (se guarda como referencia, no el número real)
            fechaVencimiento str  requerido  (YYYY-MM-DD  o  YYYY-MM)
 
        `archivo_foto`: objeto FileStorage de Flask (puede ser None).
        """
 
        # 1. Validar campos obligatorios
        requeridos = ["nombreCompleto", "mail", "contrasenia",
                      "numeroTarjeta", "fechaVencimiento"]
        faltantes = [c for c in requeridos if not datos.get(c)]
        if faltantes:
            raise ValueError(f"Campos requeridos faltantes: {', '.join(faltantes)}")
 
        # 2. Correo único
        if PersonaRepository.existe_mail(datos["mail"]):
            raise ValueError("El correo electrónico ya está registrado.")
 
        # 3. Resolver rol 'estudiante'
        rol = RolRepository.obtener_por_tipo("estudiante")
        if not rol:
            raise ValueError("El rol 'estudiante' no existe en la base de datos.")
 
        # 4. Guardar fotografía (si se envió)
        ruta_foto = None
        if archivo_foto and archivo_foto.filename:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            extension = os.path.splitext(archivo_foto.filename)[1].lower()
            nombre_unico = f"{uuid.uuid4().hex}{extension}"
            ruta_foto = os.path.join("uploads", "fotografias", nombre_unico)
            archivo_foto.save(os.path.join(UPLOAD_FOLDER, nombre_unico))
 
        # 5. Parsear fecha de nacimiento
        fecha_nac = None
        if datos.get("fechaNacimiento"):
            fecha_nac = datetime.strptime(datos["fechaNacimiento"], "%Y-%m-%d").date()
 
        # 6. Crear Persona
        nueva_persona = Persona(
            nombreCompleto  = datos["nombreCompleto"].strip(),
            fechaNacimiento = fecha_nac,
            mail            = datos["mail"].strip().lower(),
            contrasenia     = datos["contrasenia"],          # En producción: hashear
            nit             = int(datos["nit"]) if datos.get("nit") else None,
            fotografia      = ruta_foto,
            idRol           = rol.idRol,
        )
        PersonaRepository.crear(nueva_persona)
 
        # 7. Parsear fecha de vencimiento de tarjeta
        #    El front puede enviar "YYYY-MM" (type="month") o "YYYY-MM-DD"
        fv_raw = datos["fechaVencimiento"]
        if len(fv_raw) == 7:          # formato YYYY-MM
            fv_raw = fv_raw + "-01"   # primer día del mes
        fecha_venc = datetime.strptime(fv_raw, "%Y-%m-%d").date()
 
        # 8. Crear Tarjeta (el número de tarjeta es la PK)
        nueva_tarjeta = Tarjeta(
            idTarjeta        = int(datos["numeroTarjeta"]),
            fechaVencimiento = fecha_venc,
            idPersona        = nueva_persona.idPersona,
        )
        TarjetaRepository.crear(nueva_tarjeta)
 
        # 9. Confirmar transacción
        db.session.commit()
 
        return {
            "mensaje":    "Estudiante registrado exitosamente.",
            "idPersona":  nueva_persona.idPersona,
            "idTarjeta":  nueva_tarjeta.idTarjeta,
        }
    

    # ------------------------------------------------------------------
    # Obtener perfil de estudiante
    # ------------------------------------------------------------------
    @staticmethod
    def obtener_perfil(id_persona: int) -> dict:
        persona = PersonaRepository.obtener_por_id(id_persona)
 
        if not persona:
            raise LookupError("Estudiante no encontrado.")
 
        # Incluir tarjetas asociadas
        tarjetas = [t.to_dict() for t in persona.tarjetas]
 
        return {
            **persona.to_dict(),
            "tarjetas": tarjetas,
        }
    

    # ------------------------------------------------------------------
    # Actualizar datos personales del estudiante
    # ------------------------------------------------------------------
    @staticmethod
    def actualizar(id_persona: int, datos: dict, archivo_foto=None) -> dict:
        """
        Actualiza los campos enviados. Solo modifica lo que llega en `datos`.
 
        Campos actualizables:
            nombreCompleto   str  opcional
            mail             str  opcional  (debe seguir siendo único)
            contrasenia      str  opcional
            fechaNacimiento  str  opcional  YYYY-MM-DD
            nit              int  opcional
            fotografia       file opcional  (multipart)
        """
        # 1. Verificar que el estudiante existe
        persona = PersonaRepository.obtener_por_id(id_persona)
        if not persona:
            raise LookupError("Estudiante no encontrado.")
 
        # 2. Validar unicidad del mail si se quiere cambiar
        nuevo_mail = datos.get("mail")
        if nuevo_mail:
            nuevo_mail = nuevo_mail.strip().lower()
            if PersonaRepository.existe_mail_otro(nuevo_mail, id_persona):
                raise ValueError("El correo electrónico ya está en uso por otro estudiante.")
            persona.mail = nuevo_mail
 
        # 3. Actualizar campos simples (solo si vienen en el body)
        if datos.get("nombreCompleto"):
            persona.nombreCompleto = datos["nombreCompleto"].strip()
 
        if datos.get("contrasenia"):
            persona.contrasenia = datos["contrasenia"]   # hashear en producción
 
        if datos.get("nit"):
            persona.nit = int(datos["nit"])
 
        if datos.get("fechaNacimiento"):
            persona.fechaNacimiento = datetime.strptime(
                datos["fechaNacimiento"], "%Y-%m-%d"
            ).date()
 
        # 4. Actualizar fotografía si se envió una nueva
        if archivo_foto and archivo_foto.filename:
            # Eliminar foto anterior si existe
            if persona.fotografia:
                ruta_anterior = os.path.join(
                    os.path.dirname(__file__), "..", persona.fotografia
                )
                if os.path.exists(ruta_anterior):
                    os.remove(ruta_anterior)
 
            # Guardar nueva foto
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            extension    = os.path.splitext(archivo_foto.filename)[1].lower()
            nombre_unico = f"{uuid.uuid4().hex}{extension}"
            persona.fotografia = os.path.join("uploads", "fotografias", nombre_unico)
            archivo_foto.save(os.path.join(UPLOAD_FOLDER, nombre_unico))
 
        # 5. Confirmar cambios
        db.session.commit()
 
        return {
            "mensaje":   "Datos actualizados correctamente.",
            "idPersona": persona.idPersona,
        }
 