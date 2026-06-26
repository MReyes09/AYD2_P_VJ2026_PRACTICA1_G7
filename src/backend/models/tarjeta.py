from extensions import db


class Tarjeta(db.Model):
    __tablename__ = "Tarjeta"

    idTarjeta        = db.Column(db.BigInteger, primary_key=True)  # número de tarjeta como PK
    fechaVencimiento = db.Column(db.Date, nullable=False)
    idPersona        = db.Column(
        db.Integer,
        db.ForeignKey("Persona.idPersona", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    persona = db.relationship("Persona", back_populates="tarjetas")

    def to_dict(self):
        return {
            "idTarjeta":        self.idTarjeta,
            "fechaVencimiento": str(self.fechaVencimiento),
            "idPersona":        self.idPersona,
        }