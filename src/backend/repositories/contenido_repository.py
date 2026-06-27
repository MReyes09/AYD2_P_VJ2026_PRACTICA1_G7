from extensions import db
from models.contenido import Contenido


class ContenidoRepository:

    @staticmethod
    def crear(contenido: Contenido) -> Contenido:
        db.session.add(contenido)
        db.session.flush()
        return contenido