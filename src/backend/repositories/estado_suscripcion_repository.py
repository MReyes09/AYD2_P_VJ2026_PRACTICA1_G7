from models.estado_suscripcion import EstadoSuscripcion


class EstadoSuscripcionRepository:

    @staticmethod
    def obtener_por_tipo(tipo: str):
        """Busca un estado por nombre (ej. 'activa', 'cancelada')."""
        return EstadoSuscripcion.query.filter_by(tipoEstadoSolicitud=tipo).first()