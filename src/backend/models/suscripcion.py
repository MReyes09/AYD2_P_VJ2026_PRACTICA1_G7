from extensions import db


class Suscripcion(db.Model):
    __tablename__ = "Suscripcion"

    idSuscripcion       = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fechaCompra         = db.Column(db.Date, nullable=False)
    fechaCaducidad      = db.Column(db.Date, nullable=False)
    idEstadoSuscripcion = db.Column(
        db.Integer,
        db.ForeignKey("EstadoSuscripcion.idEstadoSuscripcion", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    idTarifa  = db.Column(
        db.Integer,
        db.ForeignKey("Tarifa.idTarifa", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    idPersona = db.Column(
        db.Integer,
        db.ForeignKey("Persona.idPersona", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        unique=True,   # una suscripción por persona
    )

    estado   = db.relationship("EstadoSuscripcion", back_populates="suscripciones")
    tarifa   = db.relationship("Tarifa", back_populates="suscripciones")
    persona  = db.relationship("Persona", back_populates="suscripcion")

    def to_dict(self):
        return {
            "idSuscripcion":       self.idSuscripcion,
            "fechaCompra":         str(self.fechaCompra),
            "fechaCaducidad":      str(self.fechaCaducidad),
            "idEstadoSuscripcion": self.idEstadoSuscripcion,
            "estado":              self.estado.tipoEstadoSolicitud if self.estado else None,
            "idTarifa":            self.idTarifa,
            "tipoTarifa":          self.tarifa.tipoTarifa if self.tarifa else None,
            "precio":              float(self.tarifa.precio) if self.tarifa else None,
            "idPersona":           self.idPersona,
        }