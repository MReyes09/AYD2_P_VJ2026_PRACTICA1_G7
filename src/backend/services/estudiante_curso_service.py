from repositories.estudiante_curso_repository import EstudianteCursoRepository

class EstudianteCursoService:

    def __init__(self):
        self.repo = EstudianteCursoRepository()

    def inscribir(self, id_persona, id_curso):
        # 1. Validar suscripción activa
        suscripcion = self.repo.verificar_suscripcion_activa(id_persona)
        if not suscripcion:
            raise PermissionError("No tienes una suscripción activa. Adquiere un plan para inscribirte.")

        # 2. Validar que no esté ya inscrito
        if self.repo.verificar_inscripcion_existente(id_persona, id_curso):
            raise ValueError("Ya estás inscrito en este curso.")

        # 3. Inscribir
        self.repo.inscribir(id_persona, id_curso)
        return {"inscrito": True, "idCurso": id_curso}