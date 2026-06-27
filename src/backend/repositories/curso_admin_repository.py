from extensions import db
from models.curso_admin import Curso


class CursoRepository:

    @staticmethod
    def crear(curso: Curso) -> Curso:
        db.session.add(curso)
        db.session.flush()
        return curso

    @staticmethod
    def obtener_por_id(id_curso: int):
        return Curso.query.get(id_curso)

    @staticmethod
    def obtener_todos() -> list:
        return Curso.query.all()