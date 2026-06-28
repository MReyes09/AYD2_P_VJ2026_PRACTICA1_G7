from repositories.mis_cursos_repository import MisCursosRepository

class MisCursosService:

    def __init__(self):
        self.repo = MisCursosRepository()

    def get_cursos_del_estudiante(self, id_persona):
        return self.repo.get_cursos_del_estudiante(id_persona)

    def get_contenidos_del_curso(self, id_curso, id_persona):
        return self.repo.get_contenidos_del_curso(id_curso, id_persona)

    def registrar_vista(self, id_persona, id_contenido):
        id_bitacora = self.repo.registrar_vista(id_persona, id_contenido)
        return {"idBitacora": id_bitacora, "registrado": True}