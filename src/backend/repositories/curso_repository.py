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
    

    def get_top10_cursos(self):
        """
        Top 10 cursos con más reproducciones en Bitacora.
        """
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                c.idCurso,
                c.nombreCurso,
                t.tipoTematica,
                d.tipoDificultad,
                COUNT(b.idBitacora) AS totalReproducciones
            FROM Curso c
            JOIN Tematica   t ON c.idTematica   = t.idTematica
            JOIN Dificultad d ON c.idDificultad = d.idDificultad
            LEFT JOIN Contenido con ON con.idCurso = c.idCurso
            LEFT JOIN Bitacora  b   ON b.idContenido = con.idContenido
            GROUP BY c.idCurso, c.nombreCurso, t.tipoTematica, d.tipoDificultad
            ORDER BY totalReproducciones DESC
            LIMIT 10
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    
    def get_tematica_favorita(self, id_persona):
        """
        Devuelve la temática que más ha consumido el estudiante
        basándose en su historial en Bitacora.
        """
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                t.idTematica,
                t.tipoTematica,
                COUNT(b.idBitacora) AS totalVistas
            FROM Bitacora b
            JOIN Contenido con ON b.idContenido = con.idContenido
            JOIN Curso     c   ON con.idCurso   = c.idCurso
            JOIN Tematica  t   ON c.idTematica  = t.idTematica
            WHERE b.idPersona = %s
            GROUP BY t.idTematica, t.tipoTematica
            ORDER BY totalVistas DESC
            LIMIT 1
        """

        cursor.execute(query, (id_persona,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row  # None si el usuario no tiene historial


    def get_recomendados(self, id_persona):
        """
        Devuelve cursos recomendados basados en la temática favorita
        del estudiante. Excluye cursos en los que ya está inscrito.
        Si no tiene historial, devuelve los cursos más populares globalmente.
        """
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        tematica = self.get_tematica_favorita(id_persona)

        if tematica:
            # Recomendación personalizada por temática favorita
            query = """
                SELECT
                    c.idCurso,
                    c.nombreCurso,
                    c.resumen,
                    c.anioProduccion,
                    t.tipoTematica,
                    d.tipoDificultad,
                    p.nombreCompleto AS nombreInstructor,
                    COUNT(b.idBitacora) AS totalReproducciones
                FROM Curso c
                JOIN Tematica   t   ON c.idTematica   = t.idTematica
                JOIN Dificultad d   ON c.idDificultad = d.idDificultad
                JOIN Persona    p   ON c.idPersona    = p.idPersona
                LEFT JOIN Contenido con ON con.idCurso      = c.idCurso
                LEFT JOIN Bitacora  b   ON b.idContenido    = con.idContenido
                WHERE c.idTematica = %s
                AND c.idCurso NOT IN (
                    SELECT idCurso FROM Estudiante_Curso WHERE idPersona = %s
                )
                GROUP BY
                    c.idCurso, c.nombreCurso, c.resumen,
                    c.anioProduccion, t.tipoTematica,
                    d.tipoDificultad, p.nombreCompleto
                ORDER BY totalReproducciones DESC
                LIMIT 10
            """
            cursor.execute(query, (tematica["idTematica"], id_persona))

        else:
            # Fallback: cursos más populares globalmente (sin filtro de temática)
            query = """
                SELECT
                    c.idCurso,
                    c.nombreCurso,
                    c.resumen,
                    c.anioProduccion,
                    t.tipoTematica,
                    d.tipoDificultad,
                    p.nombreCompleto AS nombreInstructor,
                    COUNT(b.idBitacora) AS totalReproducciones
                FROM Curso c
                JOIN Tematica   t   ON c.idTematica   = t.idTematica
                JOIN Dificultad d   ON c.idDificultad = d.idDificultad
                JOIN Persona    p   ON c.idPersona    = p.idPersona
                LEFT JOIN Contenido con ON con.idCurso   = c.idCurso
                LEFT JOIN Bitacora  b   ON b.idContenido = con.idContenido
                WHERE c.idCurso NOT IN (
                    SELECT idCurso FROM Estudiante_Curso WHERE idPersona = %s
                )
                GROUP BY
                    c.idCurso, c.nombreCurso, c.resumen,
                    c.anioProduccion, t.tipoTematica,
                    d.tipoDificultad, p.nombreCompleto
                ORDER BY totalReproducciones DESC
                LIMIT 10
            """
            cursor.execute(query, (id_persona,))

        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return {
            "tematicaFavorita": tematica,  # None si no tiene historial
            "cursos": rows
        }