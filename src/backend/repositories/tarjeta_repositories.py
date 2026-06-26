from extensions import db
from models.tarjeta import Tarjeta


class TarjetaRepository:

    @staticmethod
    def crear(tarjeta: Tarjeta) -> Tarjeta:
        db.session.add(tarjeta)
        db.session.flush()
        return tarjeta

    @staticmethod
    def obtener_por_persona(id_persona: int):
        """Retorna la primera tarjeta asociada a la persona."""
        return Tarjeta.query.filter_by(idPersona=id_persona).first()

    @staticmethod
    def eliminar(tarjeta: Tarjeta) -> None:
        from extensions import db
        db.session.delete(tarjeta)
        db.session.flush()