from models.tarifa import Tarifa


class TarifaRepository:

    @staticmethod
    def obtener_todas() -> list:
        return Tarifa.query.all()

    @staticmethod
    def obtener_por_id(id_tarifa: int):
        return Tarifa.query.get(id_tarifa)