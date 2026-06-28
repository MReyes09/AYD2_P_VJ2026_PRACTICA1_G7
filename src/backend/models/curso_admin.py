from extensions import db


class Curso(db.Model):
    __tablename__ = "Curso"

    idCurso        = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombreCurso    = db.Column(db.String(200), nullable=False)
    resumen        = db.Column(db.String(100), nullable=True)
    descripcion    = db.Column(db.String(250), nullable=False)
    anioProduccion = db.Column(db.Integer, nullable=False)
    idDificultad   = db.Column(
        db.Integer,
        db.ForeignKey("Dificultad.idDificultad", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    idPersona = db.Column(
        db.Integer,
        db.ForeignKey("Persona.idPersona", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    idTematica = db.Column(
        db.Integer,
        db.ForeignKey("Tematica.idTematica", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )

    dificultad = db.relationship("Dificultad", back_populates="cursos")
    tematica   = db.relationship("Tematica", back_populates="cursos")

    def to_dict(self):
        return {
            "idCurso":        self.idCurso,
            "nombreCurso":    self.nombreCurso,
            "resumen":        self.resumen,
            "descripcion":    self.descripcion,
            "anioProduccion": self.anioProduccion,
            "idDificultad":   self.idDificultad,
            "idPersona":      self.idPersona,
            "idTematica":     self.idTematica,
        }