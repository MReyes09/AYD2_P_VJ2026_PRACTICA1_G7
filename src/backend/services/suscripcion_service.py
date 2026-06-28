from datetime import date
from dateutil.relativedelta import relativedelta

from extensions import db
from models.suscripcion import Suscripcion
from repositories.persona_repositories import PersonaRepository
from repositories.tarifa_repository import TarifaRepository
from repositories.suscripcion_repository import SuscripcionRepository
from repositories.estado_suscripcion_repository import EstadoSuscripcionRepository
from repositories.tarjeta_repositories import TarjetaRepository

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
        
        # 3. Verificar que tenga una tarjeta asociada
        tarjeta = TarjetaRepository.obtener_por_persona(id_persona)
        if not tarjeta:
            raise LookupError("No se puede adquirir una suscripcion si no tiene una tarjeta registrada")

        # 4. Verificar que no tenga ya una suscripción activa
        suscripcion_existente = SuscripcionRepository.obtener_por_persona(id_persona)
        if suscripcion_existente:
            raise ValueError("El estudiante ya cuenta con una suscripción registrada.")

        # 5. Verificar que la tarifa existe
        tarifa = TarifaRepository.obtener_por_id(id_tarifa)
        if not tarifa:
            raise ValueError("La tarifa seleccionada no existe.")

        # 6. Resolver estado 'activa'
        estado = EstadoSuscripcionRepository.obtener_por_tipo("activa")
        if not estado:
            raise ValueError("El estado 'activa' no existe en la base de datos.")

        # 7. Calcular fechas
        fecha_compra    = date.today()
        meses           = DURACION_TARIFA.get(tarifa.tipoTarifa.lower(), 1)
        fecha_caducidad = fecha_compra + relativedelta(months=meses)

        # 8. Crear suscripción
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
    

    # ------------------------------------------------------------------
    # Cancelar suscripción
    # ------------------------------------------------------------------
    @staticmethod
    def cancelar(id_suscripcion: int) -> dict:
        suscripcion = SuscripcionRepository.obtener_por_id(id_suscripcion)
        if not suscripcion:
            raise LookupError("Suscripción no encontrada.")
 
        # Verificar que no esté ya cancelada
        if suscripcion.estado.tipoEstadoSolicitud == "cancelada":
            raise ValueError("La suscripción ya se encuentra cancelada.")
 
        # Cambiar estado a 'cancelada'
        estado_cancelada = EstadoSuscripcionRepository.obtener_por_tipo("cancelada")
        if not estado_cancelada:
            raise ValueError("El estado 'cancelada' no existe en la base de datos.")
 
        suscripcion.idEstadoSuscripcion = estado_cancelada.idEstadoSuscripcion
        db.session.commit()
 
        return {
            "mensaje":        "Suscripción cancelada. El acceso se mantiene hasta la fecha de caducidad.",
            "idSuscripcion":  suscripcion.idSuscripcion,
            "fechaCaducidad": str(suscripcion.fechaCaducidad),
            "estado":         estado_cancelada.tipoEstadoSolicitud,
        }
 
    # ------------------------------------------------------------------
    # Renovar suscripción
    # ------------------------------------------------------------------
    @staticmethod
    def renovar(id_suscripcion: int, datos: dict) -> dict:
        """
        Renueva la suscripción existente sumando meses a la fechaCaducidad.
        Si se envía idTarifa distinto, también cambia el plan.
 
        Campos opcionales en `datos`:
            idTarifa  int  opcional  (si se quiere cambiar de plan)
        """
        suscripcion = SuscripcionRepository.obtener_por_id(id_suscripcion)
        if not suscripcion:
            raise LookupError("Suscripción no encontrada.")
 
        # 1. Determinar tarifa a usar (la nueva si viene, si no la actual)
        id_tarifa_nueva = datos.get("idTarifa")
 
        # Validar: si está activa, solo permitir si cambia de tarifa
        estado_actual = suscripcion.estado.tipoEstadoSolicitud.lower()
        if estado_actual == "activa":
            if not id_tarifa_nueva or int(id_tarifa_nueva) == suscripcion.idTarifa:
                raise ValueError("La suscripcion esta activa. Para renovar debes seleccionar un plan diferente al actual.")
 
        if id_tarifa_nueva:
            tarifa = TarifaRepository.obtener_por_id(int(id_tarifa_nueva))
            if not tarifa:
                raise ValueError("La tarifa seleccionada no existe.")
            suscripcion.idTarifa = tarifa.idTarifa
        else:
            tarifa = suscripcion.tarifa
 
        # 2. Sumar meses a la fechaCaducidad actual
        meses = DURACION_TARIFA.get(tarifa.tipoTarifa.lower(), 1)
        suscripcion.fechaCaducidad = suscripcion.fechaCaducidad + relativedelta(months=meses)
 
        # 3. Si estaba cancelada, reactivarla
        if suscripcion.estado.tipoEstadoSolicitud.lower() == "cancelada":
            estado_activa = EstadoSuscripcionRepository.obtener_por_tipo("activa")
            if not estado_activa:
                raise ValueError("El estado 'activa' no existe en la base de datos.")
            suscripcion.idEstadoSuscripcion = estado_activa.idEstadoSuscripcion
 
        db.session.commit()
 
        return {
            "mensaje":        "Suscripción renovada exitosamente.",
            "idSuscripcion":  suscripcion.idSuscripcion,
            "fechaCaducidad": str(suscripcion.fechaCaducidad),
            "tipoTarifa":     tarifa.tipoTarifa,
            "precio":         float(tarifa.precio),
            "estado":         suscripcion.estado.tipoEstadoSolicitud,
        }