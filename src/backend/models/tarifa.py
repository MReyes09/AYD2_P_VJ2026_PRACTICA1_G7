from extensions import db


class Tarifa(db.Model):
    __tablename__ = "Tarifa"

    idTarifa   = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoTarifa = db.Column(db.String(11), nullable=False)
    precio     = db.Column(db.Numeric(10, 2), nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)

    suscripciones = db.relationship("Suscripcion", back_populates="tarifa", lazy="dynamic")

    def to_dict(self):
        return {
            "idTarifa":   self.idTarifa,
            "tipoTarifa": self.tipoTarifa,
            "precio":     float(self.precio),
            "descripcion": self.descripcion 
        }