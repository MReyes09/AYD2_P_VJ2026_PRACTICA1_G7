from dataclasses import dataclass
from typing import Optional

@dataclass
class Curso:
    idCurso: int
    nombreCurso: str
    resumen: Optional[str]
    descripcion: str
    anioProduccion: int
    idDificultad: int
    tipoDificultad: str
    idTematica: int
    tipoTematica: str
    idPersona: int
    nombreInstructor: str