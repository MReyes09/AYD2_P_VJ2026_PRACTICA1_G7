import os
import uuid
from datetime import date, datetime

from extensions import db
from models.persona import Persona
from models.tarjeta import Tarjeta
from repositories.persona_repositories import PersonaRepository
from repositories.tarjeta_repositories import TarjetaRepository
from repositories.rol_repositories import RolRepository

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

        # 8. Crear Tarjeta
        nueva_tarjeta = Tarjeta(
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