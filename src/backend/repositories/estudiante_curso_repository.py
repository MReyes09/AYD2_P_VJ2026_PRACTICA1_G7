from db import get_connection

class EstudianteCursoRepository:

    def verificar_suscripcion_activa(self, id_persona):
        """Retorna la suscripción activa del estudiante o None."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT s.idSuscripcion, s.fechaCaducidad, es.tipoEstadoSolicitud
            FROM Suscripcion s
            JOIN EstadoSuscripcion es ON s.idEstadoSuscripcion = es.idEstadoSuscripcion
            WHERE s.idPersona = %s
              AND es.tipoEstadoSolicitud = 'Activa'
              AND s.fechaCaducidad >= CURDATE()
            LIMIT 1
        """, (id_persona,))

        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row

    def verificar_inscripcion_existente(self, id_persona, id_curso):
        """Retorna True si el estudiante ya está inscrito en el curso."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 1 FROM Estudiante_Curso
            WHERE idPersona = %s AND idCurso = %s
            LIMIT 1
        """, (id_persona, id_curso))

        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row is not None

    def inscribir(self, id_persona, id_curso):
        """Inserta en Estudiante_Curso."""
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Estudiante_Curso (idCurso, idPersona)
            VALUES (%s, %s)
        """, (id_curso, id_persona))

        conn.commit()
        cursor.close()
        conn.close()