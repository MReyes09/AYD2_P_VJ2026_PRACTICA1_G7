// src/components/dashboard-student/views/StudentHomeView.jsx
import { useState, useEffect } from "react";
import "../../../styles/DashboardStudent/views/student-home.css";

const API = "http://localhost:5000";

const StudentHomeView = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [recomendados, setRecomendados] = useState([]);
  const [tematicaFavorita, setTematicaFavorita] = useState(null);
  const [top10, setTop10] = useState([]);
  const [cargando, setCargando] = useState(true);

  const idPersona = localStorage.getItem("userId");

  useEffect(() => {
    if (!idPersona) return;

    Promise.all([
      fetch(`${API}/estudiantes/${idPersona}`).then((r) => r.json()),
      fetch(`${API}/api/cursos/recomendados/${idPersona}`).then((r) => r.json()),
      fetch(`${API}/api/cursos/top10`).then((r) => r.json()),
    ])
      .then(([perfil, recomendacion, ranking]) => {
        setNombreUsuario(perfil.nombreCompleto?.split(" ")[0] ?? "Estudiante");
        setRecomendados(ranking.data ?? []);
        setTematicaFavorita(recomendacion.data?.tematicaFavorita ?? null);
        setTop10(ranking.data ?? []);
      })
      .catch(() => setNombreUsuario("Estudiante"))
      .finally(() => setCargando(false));
  }, [idPersona]);

  return (
    <section className="student-home">
      <header className="student-home-header">
        <h1>{cargando ? "Hola 👋" : `Hola, ${nombreUsuario} 👋`}</h1>
        <p>
          Continúa con tus cursos o explora nuevas recomendaciones basadas en
          lo que más ves.
        </p>
      </header>

      <div className="student-home-grid">

        {/* Panel recomendados */}
        <div className="student-panel">
          <h2>Recomendado para ti</h2>

          {/* Subtítulo dinámico según si tiene historial o no */}
          {!cargando && (
            <p className="panel-subtitulo">
              {tematicaFavorita
                ? `Basado en tu interés en ${tematicaFavorita.tipoTematica}`
                : "Cursos populares para empezar"}
            </p>
          )}

          {cargando ? (
            <p className="estado-info">Cargando recomendaciones...</p>
          ) : recomendados.length === 0 ? (
            <p className="estado-info">No hay recomendaciones disponibles.</p>
          ) : (
            <div className="student-cards">
              {recomendados.slice(0, 3).map((curso) => (
                <article key={curso.idCurso} className="student-course-card">
                  <h3>{curso.nombreCurso}</h3>
                  <p>{curso.tipoTematica}</p>
                  <span className="badge-level">{curso.tipoDificultad}</span>
                  {/* <button className="btn-small">Ver curso</button> */}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Panel Top 10 global */}
        <div className="student-panel">
          <h2>Top 10 cursos por tráfico</h2>

          {cargando ? (
            <p className="estado-info">Cargando ranking...</p>
          ) : top10.length === 0 ? (
            <p className="estado-info">No hay datos de reproducciones aún.</p>
          ) : (
            <ol className="student-top-list">
              {top10.map((curso) => (
                <li key={curso.idCurso}>
                  {curso.nombreCurso}
                  <span className="reproducciones">
                    {curso.totalReproducciones} vistas
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

      </div>
    </section>
  );
};

export default StudentHomeView;