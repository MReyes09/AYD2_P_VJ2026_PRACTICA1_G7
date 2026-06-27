from extensions import db


class Contenido(db.Model):
    __tablename__ = "Contenido"

    idContenido     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo          = db.Column(db.String(150), nullable=False)
    pathContenido   = db.Column(db.String(250), nullable=False)
    descripcion     = db.Column(db.String(250), nullable=True)
    idCurso         = db.Column(
        db.Integer,
        db.ForeignKey("Curso.idCurso", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    idTipoContenido = db.Column(
        db.Integer,
        db.ForeignKey("TipoContenido.idTipoContenido"),
        nullable=True,
    )

    tipo_contenido = db.relationship("TipoContenido", back_populates="contenidos")

    def to_dict(self):
        return {
            "idContenido":     self.idContenido,
            "titulo":          self.titulo,
            "pathContenido":   self.pathContenido,
            "descripcion":     self.descripcion,
            "idCurso":         self.idCurso,
            "idTipoContenido": self.idTipoContenido,
        }