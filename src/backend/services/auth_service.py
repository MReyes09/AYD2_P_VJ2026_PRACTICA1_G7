import bcrypt
from repositories.auth_repository import AuthRepository


class CredencialesInvalidasError(Exception):
    pass

class UsuarioNoEncontradoError(Exception):
    pass


class AuthService:

    @staticmethod
    def login(mail: str, password: str) -> dict:

        # buscar por email
        persona = AuthRepository.get_persona_by_mail(mail)
        if not persona:
            raise UsuarioNoEncontradoError("Usuario no encontrado")

        
        if not bcrypt.checkpw(password.encode("utf-8"), persona.user_password.encode("utf-8")):
            raise CredencialesInvalidasError("Credenciales invalidas")

        
        return {
            "idPersona": persona.idPersona,
            "nombreCompleto": persona.nombreCompleto,
            "mail": persona.mail,
            "idRol": persona.idRol
        }