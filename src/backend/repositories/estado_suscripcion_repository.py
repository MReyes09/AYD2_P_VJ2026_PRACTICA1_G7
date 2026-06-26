from models.estado_suscripcion import EstadoSuscripcion


class EstadoSuscripcionRepository:

    @staticmethod
    def obtener_por_tipo(tipo: str):
        """Busca un estado por nombre, sin importar mayúsculas/minúsculas."""
        from sqlalchemy import func
        return EstadoSuscripcion.query.filter(
            func.lower(EstadoSuscripcion.tipoEstadoSolicitud) == tipo.lower()
        ).first()