from models.rol import Rol


class RolRepository:

    @staticmethod
    def obtener_por_tipo(tipo_rol: str):
        """Busca un Rol por su nombre (ej. 'estudiante')."""
        return Rol.query.filter_by(tipoRol=tipo_rol).first()