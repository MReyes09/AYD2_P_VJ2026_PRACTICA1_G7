from sqlalchemy import func
from extensions import db
from models.tipo_contenido import TipoContenido
from repositories.tipo_contenido_repository import TipoContenidoRepository


class TipoContenidoService:

    @staticmethod
    def listar() -> list:
        return [t.to_dict() for t in TipoContenidoRepository.obtener_todos()]

    @staticmethod
    def crear(datos: dict) -> dict:
        if not datos.get("tipoContenido"):
            raise ValueError("El campo 'tipoContenido' es requerido.")

        if TipoContenidoRepository.existe_nombre(datos["tipoContenido"]):
            raise ValueError(f"Ya existe un tipo de contenido con el nombre '{datos['tipoContenido']}'.")

        nuevo = TipoContenido(tipoContenido=datos["tipoContenido"].strip())
        TipoContenidoRepository.crear(nuevo)
        db.session.commit()

        return {"mensaje": "Tipo de contenido creado exitosamente.", **nuevo.to_dict()}

    @staticmethod
    def actualizar(id_tipo: int, datos: dict) -> dict:
        tipo = TipoContenidoRepository.obtener_por_id(id_tipo)
        if not tipo:
            raise LookupError("Tipo de contenido no encontrado.")

        if not datos.get("tipoContenido"):
            raise ValueError("El campo 'tipoContenido' es requerido.")

        duplicado = TipoContenido.query.filter(
            func.lower(TipoContenido.tipoContenido) == datos["tipoContenido"].strip().lower(),
            TipoContenido.idTipoContenido != id_tipo
        ).first()
        if duplicado:
            raise ValueError(f"Ya existe un tipo de contenido con el nombre '{datos['tipoContenido']}'.")

        tipo.tipoContenido = datos["tipoContenido"].strip()
        db.session.commit()

        return {"mensaje": "Tipo de contenido actualizado exitosamente.", **tipo.to_dict()}

    @staticmethod
    def eliminar(id_tipo: int) -> dict:
        tipo = TipoContenidoRepository.obtener_por_id(id_tipo)
        if not tipo:
            raise LookupError("Tipo de contenido no encontrado.")

        if TipoContenidoRepository.en_uso(id_tipo):
            raise ValueError(
                "No se puede eliminar el tipo de contenido porque hay contenidos que lo están usando."
            )

        TipoContenidoRepository.eliminar(tipo)
        db.session.commit()

        return {"mensaje": "Tipo de contenido eliminado exitosamente."}