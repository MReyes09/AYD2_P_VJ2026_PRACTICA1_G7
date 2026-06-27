from extensions import db
from sqlalchemy import text

class AnalyticsRepository:

    def get_top_categorias(self, limit: int = 3):
        """
        Top N temáticas por número de reproducciones (registros en Bitacora).
        Bitacora -> Contenido -> Curso -> Tematica
        """
        sql = """
            SELECT
                t.tipoTematica   AS nombre,
                COUNT(b.idBitacora) AS reproducciones
            FROM Bitacora b
            JOIN Contenido c  ON b.idContenido = c.idContenido
            JOIN Curso     cu ON c.idCurso     = cu.idCurso
            JOIN Tematica  t  ON cu.idTematica = t.idTematica
            GROUP BY t.idTematica, t.tipoTematica
            ORDER BY reproducciones DESC
            LIMIT :limit
        """
        result = db.session.execute(db.text(sql), {"limit": limit})
        return [{"nombre": row.nombre, "reproducciones": row.reproducciones}
                for row in result]

    def get_top_niveles(self, limit: int = 3):
        """
        Top N dificultades por número de inscripciones (Estudiante_Curso).
        Estudiante_Curso -> Curso -> Dificultad
        """
        sql = """
            SELECT
                d.tipoDificultad  AS nombre,
                COUNT(ec.idPersona) AS cursados
            FROM Estudiante_Curso ec
            JOIN Curso      cu ON ec.idCurso      = cu.idCurso
            JOIN Dificultad d  ON cu.idDificultad = d.idDificultad
            GROUP BY d.idDificultad, d.tipoDificultad
            ORDER BY cursados DESC
            LIMIT :limit
        """
        result = db.session.execute(db.text(sql), {"limit": limit})
        return [{"nombre": row.nombre, "cursados": row.cursados}
                for row in result]

    def get_top_cursos(self, limit: int = 10):
        """
        Top N cursos por reproducciones totales de su contenido.
        Bitacora -> Contenido -> Curso
        """
        sql = """
            SELECT
                cu.nombreCurso      AS titulo,
                COUNT(b.idBitacora) AS reproducciones
            FROM Bitacora b
            JOIN Contenido c  ON b.idContenido = c.idContenido
            JOIN Curso     cu ON c.idCurso     = cu.idCurso
            GROUP BY cu.idCurso, cu.nombreCurso
            ORDER BY reproducciones DESC
            LIMIT :limit
        """
        result = db.session.execute(db.text(sql), {"limit": limit})
        return [{"titulo": row.titulo, "reproducciones": row.reproducciones}
                for row in result]

    def get_distribucion_suscripciones(self):
        """
        Cantidad de estudiantes activos agrupados por tipo de tarifa.
        Suscripcion -> Tarifa
        """
        sql = """
            SELECT
                ta.tipoTarifa       AS tipo,
                COUNT(s.idPersona)  AS estudiantes
            FROM Suscripcion s
            JOIN Tarifa ta ON s.idTarifa = ta.idTarifa
            GROUP BY ta.idTarifa, ta.tipoTarifa
            ORDER BY estudiantes DESC
        """
        result = db.session.execute(db.text(sql))
        return [{"tipo": row.tipo, "estudiantes": row.estudiantes}
                for row in result]