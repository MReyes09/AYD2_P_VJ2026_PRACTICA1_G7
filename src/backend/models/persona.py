from extensions import db


class Persona(db.Model):
    __tablename__ = "Persona"

    idPersona       = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombreCompleto  = db.Column(db.String(170), nullable=False)
    fechaNacimiento = db.Column(db.Date, nullable=True)
    mail            = db.Column(db.String(80), nullable=False, unique=True)
    contrasenia     = db.Column(db.String(10), nullable=False)
    nit             = db.Column(db.Integer, nullable=True)
    fotografia      = db.Column(db.String(200), nullable=True)
    idRol           = db.Column(
        db.Integer,
        db.ForeignKey("Rol.idRol", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )

    # Relaciones activas (solo modelos ya creados)
    rol      = db.relationship("Rol", back_populates="personas")
    tarjetas = db.relationship("Tarjeta", back_populates="persona", cascade="all, delete-orphan", lazy="dynamic")

    suscripcion = db.relationship("Suscripcion", back_populates="persona", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "idPersona":       self.idPersona,
            "nombreCompleto":  self.nombreCompleto,
            "fechaNacimiento": str(self.fechaNacimiento) if self.fechaNacimiento else None,
            "mail":            self.mail,
            "nit":             self.nit,
            "fotografia":      self.fotografia,
            "idRol":           self.idRol,
        }