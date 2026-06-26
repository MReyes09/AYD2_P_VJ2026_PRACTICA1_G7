from db import get_connection

class MisCursosRepository:

    def get_cursos_del_estudiante(self, id_persona):
        """
        Devuelve los cursos inscritos por el estudiante
        con el progreso calculado (contenidos vistos / total contenidos).
        """
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                c.idCurso,
                c.nombreCurso,
                c.resumen,
                c.descripcion,
                c.anioProduccion,
                d.tipoDificultad,
                t.tipoTematica,
                p.nombreCompleto AS nombreInstructor,

                -- Total de contenidos del curso
                COUNT(DISTINCT con.idContenido) AS totalContenidos,

                -- Contenidos vistos por este estudiante
                COUNT(DISTINCT b.idContenido)   AS contenidosVistos,

                -- Porcentaje de progreso
                CASE
                    WHEN COUNT(DISTINCT con.idContenido) = 0 THEN 0
                    ELSE ROUND(
                        COUNT(DISTINCT b.idContenido) * 100.0
                        / COUNT(DISTINCT con.idContenido)
                    )
                END AS progreso

            FROM Estudiante_Curso ec
            JOIN Curso      c   ON ec.idCurso   = c.idCurso
            JOIN Dificultad d   ON c.idDificultad = d.idDificultad
            JOIN Tematica   t   ON c.idTematica   = t.idTematica
            JOIN Persona    p   ON c.idPersona    = p.idPersona
            LEFT JOIN Contenido con ON con.idCurso = c.idCurso
            LEFT JOIN Bitacora  b   ON b.idContenido = con.idContenido
                                   AND b.idPersona   = %s
            WHERE ec.idPersona = %s
            GROUP BY
                c.idCurso, c.nombreCurso, c.resumen,
                c.descripcion, c.anioProduccion,
                d.tipoDificultad, t.tipoTematica,
                p.nombreCompleto
            ORDER BY c.nombreCurso
        """

        cursor.execute(query, (id_persona, id_persona))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    def get_contenidos_del_curso(self, id_curso, id_persona):
        """
        Devuelve los contenidos de un curso indicando
        si el estudiante ya los visualizó.
        """
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                con.idContenido,
                con.titulo,
                con.descripcion,
                con.pathContenido,

                -- Última vez que el estudiante vio este contenido (NULL si nunca)
                MAX(b.fechaVista) AS ultimaVista,

                -- Bandera de visto
                CASE WHEN MAX(b.idBitacora) IS NOT NULL THEN TRUE ELSE FALSE END AS visto

            FROM Contenido con
            LEFT JOIN Bitacora b ON b.idContenido = con.idContenido
                                AND b.idPersona   = %s
            WHERE con.idCurso = %s
            GROUP BY
                con.idContenido, con.titulo,
                con.descripcion, con.pathContenido
            ORDER BY con.idContenido
        """

        cursor.execute(query, (id_persona, id_curso))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    def registrar_vista(self, id_persona, id_contenido):
        """
        Inserta un registro en Bitacora cuando el estudiante
        reproduce un contenido.
        """
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO Bitacora (idPersona, idContenido)
            VALUES (%s, %s)
            """,
            (id_persona, id_contenido)
        )

        conn.commit()
        id_nuevo = cursor.lastrowid
        cursor.close()
        conn.close()
        return id_nuevo