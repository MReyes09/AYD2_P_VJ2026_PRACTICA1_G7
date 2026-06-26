from extensions import db
from models.tematica import Tematica


class TematicaRepository:

    @staticmethod
    def obtener_todas() -> list:
        return Tematica.query.all()

    @staticmethod
    def obtener_por_id(id_tematica: int):
        return Tematica.query.get(id_tematica)

    @staticmethod
    def existe_nombre(nombre: str) -> bool:
        from sqlalchemy import func
        return Tematica.query.filter(
            func.lower(Tematica.tipoTematica) == nombre.lower()
        ).first() is not None

    @staticmethod
    def crear(tematica: Tematica) -> Tematica:
        db.session.add(tematica)
        db.session.flush()
        return tematica

    @staticmethod
    def eliminar(tematica: Tematica) -> None:
        db.session.delete(tematica)
        db.session.flush()

    @staticmethod
    def en_uso(id_tematica: int) -> bool:
        from models.curso_admin import Curso
        return Curso.query.filter_by(idTematica=id_tematica).first() is not None