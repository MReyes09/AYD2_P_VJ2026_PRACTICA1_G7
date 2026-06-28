from extensions import db
from models.curso_admin import Curso
from models.contenido import Contenido
from repositories.curso_admin_repository import CursoRepository
from repositories.contenido_repository import ContenidoRepository
from repositories.dificultad_repository import DificultadRepository
from repositories.tematica_repository import TematicaRepository
from repositories.persona_repositories import PersonaRepository


class CursoAdminService:

    # ------------------------------------------------------------------
    # Crear curso
    # ------------------------------------------------------------------
    @staticmethod
    def crear(datos: dict) -> dict:
        """
        Campos requeridos:
            nombreCurso, descripcion, anioProduccion,
            idDificultad, idPersona, idTematica
        Campos opcionales:
            resumen
        """
        requeridos = ["nombreCurso", "descripcion", "anioProduccion",
                      "idDificultad", "idPersona", "idTematica"]
        faltantes = [c for c in requeridos if not datos.get(c)]
        if faltantes:
            raise ValueError(f"Campos requeridos faltantes: {', '.join(faltantes)}")

        if not DificultadRepository.obtener_por_id(int(datos["idDificultad"])):
            raise ValueError("La dificultad seleccionada no existe.")

        if not TematicaRepository.obtener_por_id(int(datos["idTematica"])):
            raise ValueError("La temática seleccionada no existe.")

        if not PersonaRepository.obtener_por_id(int(datos["idPersona"])):
            raise ValueError("El instructor seleccionado no existe.")

        nuevo_curso = Curso(
            nombreCurso    = datos["nombreCurso"].strip(),
            resumen        = datos.get("resumen", "").strip() or None,
            descripcion    = datos["descripcion"].strip(),
            anioProduccion = int(datos["anioProduccion"]),
            idDificultad   = int(datos["idDificultad"]),
            idPersona      = int(datos["idPersona"]),
            idTematica     = int(datos["idTematica"]),
        )
        CursoRepository.crear(nuevo_curso)
        db.session.commit()

        return {
            "mensaje":     "Curso creado exitosamente.",
            **nuevo_curso.to_dict(),
        }

    # ------------------------------------------------------------------
    # Agregar contenido a un curso
    # ------------------------------------------------------------------
    @staticmethod
    def agregar_contenido(id_curso: int, datos: dict) -> dict:
        """
        Campos requeridos:
            titulo, pathContenido
        Campos opcionales:
            descripcion, idTipoContenido
        """
        curso = CursoRepository.obtener_por_id(id_curso)
        if not curso:
            raise LookupError("Curso no encontrado.")

        requeridos = ["titulo", "pathContenido"]
        faltantes = [c for c in requeridos if not datos.get(c)]
        if faltantes:
            raise ValueError(f"Campos requeridos faltantes: {', '.join(faltantes)}")

        nuevo_contenido = Contenido(
            titulo          = datos["titulo"].strip(),
            pathContenido   = datos["pathContenido"].strip(),
            descripcion     = datos.get("descripcion", "").strip() or None,
            idCurso         = id_curso,
            idTipoContenido = int(datos["idTipoContenido"]) if datos.get("idTipoContenido") else None,
        )
        ContenidoRepository.crear(nuevo_contenido)
        db.session.commit()

        return {
            "mensaje": "Contenido agregado exitosamente.",
            **nuevo_contenido.to_dict(),
        }
    
    
    # ------------------------------------------------------------------
    # Ver contenido de un curso
    # ------------------------------------------------------------------
    @staticmethod
    def ver_contenido(id_curso: int) -> list:
        curso = CursoRepository.obtener_por_id(id_curso)
        if not curso:
            raise LookupError("Curso no encontrado.")
 
        contenidos = ContenidoRepository.obtener_por_curso(id_curso)
        return [c.to_dict() for c in contenidos]
 
    # ------------------------------------------------------------------
    # Modificar contenido
    # ------------------------------------------------------------------
    @staticmethod
    def actualizar_contenido(id_contenido: int, datos: dict) -> dict:
        contenido = ContenidoRepository.obtener_por_id(id_contenido)
        if not contenido:
            raise LookupError("Contenido no encontrado.")
 
        if datos.get("titulo"):
            contenido.titulo = datos["titulo"].strip()
 
        if datos.get("pathContenido"):
            contenido.pathContenido = datos["pathContenido"].strip()
 
        if datos.get("descripcion"):
            contenido.descripcion = datos["descripcion"].strip()
 
        if datos.get("idTipoContenido"):
            contenido.idTipoContenido = int(datos["idTipoContenido"])
 
        db.session.commit()
 
        return {
            "mensaje": "Contenido actualizado exitosamente.",
            **contenido.to_dict(),
        }
 
    # ------------------------------------------------------------------
    # Eliminar contenido
    # ------------------------------------------------------------------
    @staticmethod
    def eliminar_contenido(id_contenido: int) -> dict:
        contenido = ContenidoRepository.obtener_por_id(id_contenido)
        if not contenido:
            raise LookupError("Contenido no encontrado.")
 
        ContenidoRepository.eliminar(contenido)
        db.session.commit()
 
        return {"mensaje": "Contenido eliminado exitosamente."}