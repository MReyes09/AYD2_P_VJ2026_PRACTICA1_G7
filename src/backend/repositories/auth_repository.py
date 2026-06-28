from extensions import db
from sqlalchemy import text


class AuthRepository:

    @staticmethod
    def get_persona_by_mail(mail: str):
    #ya sabe que ahce no peregunten jejeje

        return db.session.execute(
            text("""
                SELECT idPersona, nombreCompleto, mail, contrasenia AS user_password, idRol
                FROM Persona
                WHERE mail = :mail
            """),
            {"mail": mail}
        ).fetchone()