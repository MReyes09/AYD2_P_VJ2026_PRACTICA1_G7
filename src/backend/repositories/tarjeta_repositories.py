from extensions import db
from models.tarjeta import Tarjeta


class TarjetaRepository:

    @staticmethod
    def crear(tarjeta: Tarjeta) -> Tarjeta:
        db.session.add(tarjeta)
        db.session.flush()
        return tarjeta