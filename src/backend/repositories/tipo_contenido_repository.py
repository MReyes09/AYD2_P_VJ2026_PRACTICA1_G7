from extensions import db
from models.tipo_contenido import TipoContenido


class TipoContenidoRepository:

    @staticmethod
    def obtener_todos() -> list:
        return TipoContenido.query.all()

    @staticmethod
    def obtener_por_id(id_tipo: int):
        return TipoContenido.query.get(id_tipo)

    @staticmethod
    def existe_nombre(nombre: str) -> bool:
        from sqlalchemy import func
        return TipoContenido.query.filter(
            func.lower(TipoContenido.tipoContenido) == nombre.lower()
        ).first() is not None

    @staticmethod
    def crear(tipo: TipoContenido) -> TipoContenido:
        db.session.add(tipo)
        db.session.flush()
        return tipo

    @staticmethod
    def eliminar(tipo: TipoContenido) -> None:
        db.session.delete(tipo)
        db.session.flush()

    @staticmethod
    def en_uso(id_tipo: int) -> bool:
        from models.contenido import Contenido
        return Contenido.query.filter_by(idTipoContenido=id_tipo).first() is not None