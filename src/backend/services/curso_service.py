from repositories.curso_repository import CursoRepository

class CursoService:

    def __init__(self):
        self.repo = CursoRepository()

    def buscar_cursos(self, titulo=None, id_tematica=None, id_dificultad=None):
        cursos = self.repo.buscar_cursos(titulo, id_tematica, id_dificultad)
        return cursos  # ya vienen como dicts desde cursor(dictionary=True)

    def get_filtros(self):
        return {
            "tematicas": self.repo.get_tematicas(),
            "dificultades": self.repo.get_dificultades()
        }