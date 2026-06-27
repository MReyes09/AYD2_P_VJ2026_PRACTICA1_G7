from extensions import db


class TipoContenido(db.Model):
    __tablename__ = "TipoContenido"

    idTipoContenido = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoContenido   = db.Column(db.String(50), nullable=False)

    contenidos = db.relationship("Contenido", back_populates="tipo_contenido", lazy="dynamic")

    def to_dict(self):
        return {
            "idTipoContenido": self.idTipoContenido,
            "tipoContenido":   self.tipoContenido,
        }