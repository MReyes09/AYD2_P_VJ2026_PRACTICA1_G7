from extensions import db
from models.contenido import Contenido


class ContenidoRepository:

    @staticmethod
    def crear(contenido: Contenido) -> Contenido:
        db.session.add(contenido)
        db.session.flush()
        return contenido

    @staticmethod
    def obtener_por_id(id_contenido: int):
        return Contenido.query.get(id_contenido)
 
    @staticmethod
    def obtener_por_curso(id_curso: int) -> list:
        return Contenido.query.filter_by(idCurso=id_curso).all()
 
    @staticmethod
    def eliminar(contenido: Contenido) -> None:
        db.session.delete(contenido)
        db.session.flush()