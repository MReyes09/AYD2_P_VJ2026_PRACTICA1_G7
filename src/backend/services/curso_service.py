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
    
    def get_top10_cursos(self):
        return self.repo.get_top10_cursos()
    
    def get_recomendados(self, id_persona):
        return self.repo.get_recomendados(id_persona)