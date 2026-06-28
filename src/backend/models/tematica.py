from extensions import db


class Tematica(db.Model):
    __tablename__ = "Tematica"

    idTematica   = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoTematica = db.Column(db.String(25), nullable=False)

    cursos = db.relationship("Curso", back_populates="tematica", lazy="dynamic")

    def to_dict(self):
        return {
            "idTematica":   self.idTematica,
            "tipoTematica": self.tipoTematica,
        }