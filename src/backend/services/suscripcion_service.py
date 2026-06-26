from datetime import date
from dateutil.relativedelta import relativedelta

from extensions import db
from models.suscripcion import Suscripcion
from repositories.persona_repositories import PersonaRepository
from repositories.tarifa_repository import TarifaRepository
from repositories.suscripcion_repository import SuscripcionRepository
from repositories.estado_suscripcion_repository import EstadoSuscripcionRepository

# Meses que agrega cada tipo de tarifa
DURACION_TARIFA = {
    "mensual":     1,
    "trimestral":  3,
    "anual":      12,
}


class SuscripcionService:

    # ------------------------------------------------------------------
    # Listar tarifas disponibles
    # ------------------------------------------------------------------
    @staticmethod
    def listar_tarifas() -> list:
        tarifas = TarifaRepository.obtener_todas()
        return [t.to_dict() for t in tarifas]

    # ------------------------------------------------------------------
    # Adquirir suscripción
    # ------------------------------------------------------------------
    @staticmethod
    def adquirir(datos: dict) -> dict:
        """
        Crea una suscripción para el estudiante.
        Si ya tiene una activa, lanza error.

        Campos esperados en `datos`:
            idPersona  int  requerido
            idTarifa   int  requerido
        """
        # 1. Validar campos requeridos
        requeridos = ["idPersona", "idTarifa"]
        faltantes = [c for c in requeridos if not datos.get(c)]
        if faltantes:
            raise ValueError(f"Campos requeridos faltantes: {', '.join(faltantes)}")

        id_persona = int(datos["idPersona"])
        id_tarifa  = int(datos["idTarifa"])

        # 2. Verificar que el estudiante existe
        persona = PersonaRepository.obtener_por_id(id_persona)
        if not persona:
            raise LookupError("Estudiante no encontrado.")

        # 3. Verificar que no tenga ya una suscripción activa
        suscripcion_existente = SuscripcionRepository.obtener_por_persona(id_persona)
        if suscripcion_existente:
            raise ValueError("El estudiante ya cuenta con una suscripción registrada.")

        # 4. Verificar que la tarifa existe
        tarifa = TarifaRepository.obtener_por_id(id_tarifa)
        if not tarifa:
            raise ValueError("La tarifa seleccionada no existe.")

        # 5. Resolver estado 'activa'
        estado = EstadoSuscripcionRepository.obtener_por_tipo("activa")
        if not estado:
            raise ValueError("El estado 'activa' no existe en la base de datos.")

        # 6. Calcular fechas
        fecha_compra    = date.today()
        meses           = DURACION_TARIFA.get(tarifa.tipoTarifa.lower(), 1)
        fecha_caducidad = fecha_compra + relativedelta(months=meses)

        # 7. Crear suscripción
        nueva = Suscripcion(
            fechaCompra         = fecha_compra,
            fechaCaducidad      = fecha_caducidad,
            idEstadoSuscripcion = estado.idEstadoSuscripcion,
            idTarifa            = id_tarifa,
            idPersona           = id_persona,
        )
        SuscripcionRepository.crear(nueva)
        db.session.commit()

        return {
            "mensaje":        "Suscripción adquirida exitosamente.",
            "idSuscripcion":  nueva.idSuscripcion,
            "fechaCompra":    str(nueva.fechaCompra),
            "fechaCaducidad": str(nueva.fechaCaducidad),
            "tipoTarifa":     tarifa.tipoTarifa,
            "precio":         float(tarifa.precio),
        }
    
    # ------------------------------------------------------------------
    # Ver suscripción activa del estudiante
    # ------------------------------------------------------------------
    @staticmethod
    def obtener_por_estudiante(id_persona: int) -> dict:
        persona = PersonaRepository.obtener_por_id(id_persona)
        if not persona:
            raise LookupError("Estudiante no encontrado.")
 
        suscripcion = SuscripcionRepository.obtener_por_persona(id_persona)
        if not suscripcion:
            raise LookupError("El estudiante no tiene una suscripción registrada.")
 
        return suscripcion.to_dict()