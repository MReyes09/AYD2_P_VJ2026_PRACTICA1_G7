from db import get_connection  # tu función de conexión a MySQL

class CursoRepository:

    def buscar_cursos(self, titulo=None, id_tematica=None, id_dificultad=None):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                c.idCurso,
                c.nombreCurso,
                c.resumen,
                c.descripcion,
                c.anioProduccion,
                d.idDificultad,
                d.tipoDificultad,
                t.idTematica,
                t.tipoTematica,
                p.idPersona      AS idInstructor,
                p.nombreCompleto AS nombreInstructor
            FROM Curso c
            JOIN Dificultad d ON c.idDificultad = d.idDificultad
            JOIN Tematica   t ON c.idTematica   = t.idTematica
            JOIN Persona    p ON c.idPersona    = p.idPersona
            WHERE 1=1
        """
        params = []

        if titulo:
            query += " AND c.nombreCurso LIKE %s"
            params.append(f"%{titulo}%")

        if id_tematica:
            query += " AND c.idTematica = %s"
            params.append(id_tematica)

        if id_dificultad:
            query += " AND c.idDificultad = %s"
            params.append(id_dificultad)

        query += " ORDER BY c.anioProduccion DESC"

        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    def get_tematicas(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT idTematica, tipoTematica FROM Tematica ORDER BY tipoTematica")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    def get_dificultades(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT idDificultad, tipoDificultad FROM Dificultad ORDER BY idDificultad")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows