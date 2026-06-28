from extensions import db
from models.dificultad import Dificultad


class DificultadRepository:

    @staticmethod
    def obtener_todas() -> list:
        return Dificultad.query.all()

    @staticmethod
    def obtener_por_id(id_dificultad: int):
        return Dificultad.query.get(id_dificultad)

    @staticmethod
    def existe_nombre(nombre: str) -> bool:
        from sqlalchemy import func
        return Dificultad.query.filter(
            func.lower(Dificultad.tipoDificultad) == nombre.lower()
        ).first() is not None

    @staticmethod
    def crear(dificultad: Dificultad) -> Dificultad:
        db.session.add(dificultad)
        db.session.flush()
        return dificultad

    @staticmethod
    def eliminar(dificultad: Dificultad) -> None:
        db.session.delete(dificultad)
        db.session.flush()

    @staticmethod
    def en_uso(id_dificultad: int) -> bool:
        """Retorna True si algún curso está usando esta dificultad."""
        from models.curso_admin import Curso
        return Curso.query.filter_by(idDificultad=id_dificultad).first() is not None