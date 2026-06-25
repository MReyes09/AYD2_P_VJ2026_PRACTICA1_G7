from extensions import db


class Rol(db.Model):
    __tablename__ = "Rol"

    idRol   = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoRol = db.Column(db.String(10), nullable=False)

    # Relación inversa: un rol puede tener muchas personas
    personas = db.relationship("Persona", back_populates="rol", lazy="dynamic")

    def to_dict(self):
        return {"idRol": self.idRol, "tipoRol": self.tipoRol}