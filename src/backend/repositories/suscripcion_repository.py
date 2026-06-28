from extensions import db
from models.suscripcion import Suscripcion


class SuscripcionRepository:

    @staticmethod
    def obtener_por_persona(id_persona: int):
        return Suscripcion.query.filter_by(idPersona=id_persona).first()

    @staticmethod
    def crear(suscripcion: Suscripcion) -> Suscripcion:
        db.session.add(suscripcion)
        db.session.flush()
        return suscripcion
    
    @staticmethod
    def obtener_por_id(id_suscripcion: int):
        return Suscripcion.query.get(id_suscripcion)