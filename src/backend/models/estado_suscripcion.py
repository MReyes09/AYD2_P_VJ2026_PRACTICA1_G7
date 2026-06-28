from extensions import db


class EstadoSuscripcion(db.Model):
    __tablename__ = "EstadoSuscripcion"

    idEstadoSuscripcion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoEstadoSolicitud = db.Column(db.String(12), nullable=False)

    suscripciones = db.relationship("Suscripcion", back_populates="estado", lazy="dynamic")

    def to_dict(self):
        return {
            "idEstadoSuscripcion": self.idEstadoSuscripcion,
            "tipoEstadoSolicitud": self.tipoEstadoSolicitud,
        }