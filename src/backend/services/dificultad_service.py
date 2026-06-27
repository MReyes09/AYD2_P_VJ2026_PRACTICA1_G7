from extensions import db
from models.dificultad import Dificultad
from repositories.dificultad_repository import DificultadRepository


class DificultadService:

    # ------------------------------------------------------------------
    # Crear dificultad
    # ------------------------------------------------------------------
    @staticmethod
    def crear(datos: dict) -> dict:
        if not datos.get("tipoDificultad"):
            raise ValueError("El campo 'tipoDificultad' es requerido.")

        if DificultadRepository.existe_nombre(datos["tipoDificultad"]):
            raise ValueError(f"Ya existe una dificultad con el nombre '{datos['tipoDificultad']}'.")

        nueva = Dificultad(tipoDificultad=datos["tipoDificultad"].strip())
        DificultadRepository.crear(nueva)
        db.session.commit()

        return {
            "mensaje": "Dificultad creada exitosamente.",
            **nueva.to_dict(),
        }

    # ------------------------------------------------------------------
    # Actualizar dificultad
    # ------------------------------------------------------------------
    @staticmethod
    def actualizar(id_dificultad: int, datos: dict) -> dict:
        dificultad = DificultadRepository.obtener_por_id(id_dificultad)
        if not dificultad:
            raise LookupError("Dificultad no encontrada.")

        if not datos.get("tipoDificultad"):
            raise ValueError("El campo 'tipoDificultad' es requerido.")

        # Verificar que el nuevo nombre no lo use otra dificultad
        from sqlalchemy import func
        from models.dificultad import Dificultad as D
        duplicado = D.query.filter(
            func.lower(D.tipoDificultad) == datos["tipoDificultad"].strip().lower(),
            D.idDificultad != id_dificultad
        ).first()
        if duplicado:
            raise ValueError(f"Ya existe una dificultad con el nombre '{datos['tipoDificultad']}'.")

        dificultad.tipoDificultad = datos["tipoDificultad"].strip()
        db.session.commit()

        return {
            "mensaje": "Dificultad actualizada exitosamente.",
            **dificultad.to_dict(),
        }

    # ------------------------------------------------------------------
    # Eliminar dificultad
    # ------------------------------------------------------------------
    @staticmethod
    def eliminar(id_dificultad: int) -> dict:
        dificultad = DificultadRepository.obtener_por_id(id_dificultad)
        if not dificultad:
            raise LookupError("Dificultad no encontrada.")

        # Verificar que ningún curso la esté usando
        if DificultadRepository.en_uso(id_dificultad):
            raise ValueError(
                "No se puede eliminar la dificultad porque hay cursos que la están usando."
            )

        DificultadRepository.eliminar(dificultad)
        db.session.commit()

        return {"mensaje": "Dificultad eliminada exitosamente."}
    

    # ------------------------------------------------------------------
    # Listar dificultades
    # ------------------------------------------------------------------
    @staticmethod
    def listar() -> list:
        return [d.to_dict() for d in DificultadRepository.obtener_todas()]