from extensions import db
from models.persona import Persona


class PersonaRepository:

    @staticmethod
    def existe_mail(mail: str) -> bool:
        """Retorna True si ya hay una Persona con ese correo."""
        return Persona.query.filter_by(mail=mail).first() is not None

    @staticmethod
    def crear(persona: Persona) -> Persona:
        db.session.add(persona)
        db.session.flush()   # obtiene idPersona antes del commit
        return persona

    @staticmethod
    def obtener_por_id(id_persona: int):
        return Persona.query.get(id_persona)
    
    @staticmethod
    def existe_mail_otro(mail: str, id_persona: int) -> bool:
        """Verifica si el mail ya lo usa OTRA persona distinta."""
        return Persona.query.filter(
            Persona.mail == mail,
            Persona.idPersona != id_persona
        ).first() is not None
        