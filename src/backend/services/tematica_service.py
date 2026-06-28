from sqlalchemy import func
from extensions import db
from models.tematica import Tematica
from repositories.tematica_repository import TematicaRepository


class TematicaService:

    @staticmethod
    def listar() -> list:
        return [t.to_dict() for t in TematicaRepository.obtener_todas()]

    @staticmethod
    def crear(datos: dict) -> dict:
        if not datos.get("tipoTematica"):
            raise ValueError("El campo 'tipoTematica' es requerido.")

        if TematicaRepository.existe_nombre(datos["tipoTematica"]):
            raise ValueError(f"Ya existe una temática con el nombre '{datos['tipoTematica']}'.")

        nueva = Tematica(tipoTematica=datos["tipoTematica"].strip())
        TematicaRepository.crear(nueva)
        db.session.commit()

        return {"mensaje": "Temática creada exitosamente.", **nueva.to_dict()}

    @staticmethod
    def actualizar(id_tematica: int, datos: dict) -> dict:
        tematica = TematicaRepository.obtener_por_id(id_tematica)
        if not tematica:
            raise LookupError("Temática no encontrada.")

        if not datos.get("tipoTematica"):
            raise ValueError("El campo 'tipoTematica' es requerido.")

        duplicado = Tematica.query.filter(
            func.lower(Tematica.tipoTematica) == datos["tipoTematica"].strip().lower(),
            Tematica.idTematica != id_tematica
        ).first()
        if duplicado:
            raise ValueError(f"Ya existe una temática con el nombre '{datos['tipoTematica']}'.")

        tematica.tipoTematica = datos["tipoTematica"].strip()
        db.session.commit()

        return {"mensaje": "Temática actualizada exitosamente.", **tematica.to_dict()}

    @staticmethod
    def eliminar(id_tematica: int) -> dict:
        tematica = TematicaRepository.obtener_por_id(id_tematica)
        if not tematica:
            raise LookupError("Temática no encontrada.")

        if TematicaRepository.en_uso(id_tematica):
            raise ValueError(
                "No se puede eliminar la temática porque hay cursos que la están usando."
            )

        TematicaRepository.eliminar(tematica)
        db.session.commit()

        return {"mensaje": "Temática eliminada exitosamente."}
