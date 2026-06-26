from extensions import db


class Dificultad(db.Model):
    __tablename__ = "Dificultad"

    idDificultad   = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoDificultad = db.Column(db.String(20), nullable=False)

    cursos = db.relationship("Curso", back_populates="dificultad", lazy="dynamic")

    def to_dict(self):
        return {
            "idDificultad":   self.idDificultad,
            "tipoDificultad": self.tipoDificultad,
        }