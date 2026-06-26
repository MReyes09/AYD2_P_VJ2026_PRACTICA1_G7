// src/components/dashboard-student/views/StudentMyCoursesView.jsx
import { useState, useEffect } from "react";
import "../../../styles/DashboardStudent/views/student-my-courses.css";

const API = "http://localhost:5000/api";

const StudentMyCoursesView = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [cargandoContenidos, setCargandoContenidos] = useState(false);
  const [error, setError] = useState(null);

  // Obtener idPersona desde localStorage
  const idPersona = localStorage.getItem("idPersona");

  //Prueba par acolocar una persona logeada
  //idPersona = 4;

  // 1. Cargar mis cursos al montar
  useEffect(() => {
    if (!idPersona) {
      setError("No hay sesión activa.");
      setCargandoCursos(false);
      return;
    }

    fetch(`${API}/mis-cursos/${idPersona}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setCursos(data);
        if (data.length > 0) setCursoActivo(data[0]); // selecciona el primero por defecto
      })
      .catch(() => setError("Error al cargar tus cursos."))
      .finally(() => setCargandoCursos(false));
  }, [idPersona]);

  // 2. Cargar contenidos cuando cambia el curso activo
  useEffect(() => {
    if (!cursoActivo) return;

    setCargandoContenidos(true);
    fetch(`${API}/mis-cursos/${idPersona}/curso/${cursoActivo.idCurso}/contenidos`)
      .then((r) => r.json())
      .then(({ data }) => setContenidos(data))
      .catch(() => setError("Error al cargar los contenidos."))
      .finally(() => setCargandoContenidos(false));
  }, [cursoActivo]);

  // 3. Registrar vista al presionar Reproducir
  const handleReproducir = (idContenido) => {
    fetch(`${API}/mis-cursos/vista`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPersona: Number(idPersona), idContenido }),
    })
      .then((r) => r.json())
      .then(() => {
        // Actualiza el estado local: marca el contenido como visto
        setContenidos((prev) =>
          prev.map((c) =>
            c.idContenido === idContenido
              ? { ...c, visto: true, ultimaVista: new Date().toISOString() }
              : c
          )
        );
        // Recalcula progreso en la lista de cursos
        setCursos((prev) =>
          prev.map((curso) => {
            if (curso.idCurso !== cursoActivo.idCurso) return curso;
            const vistos = contenidos.filter(
              (c) => c.visto || c.idContenido === idContenido
            ).length;
            const progreso = Math.round((vistos / curso.totalContenidos) * 100);
            return { ...curso, contenidosVistos: vistos, progreso };
          })
        );
      })
      .catch(() => setError("No se pudo registrar la reproducción."));
  };

  if (cargandoCursos) return <p className="estado-info">Cargando tus cursos...</p>;
  if (error)         return <p className="estado-error">{error}</p>;
  if (cursos.length === 0) return <p className="estado-info">Aún no estás inscrito en ningún curso.</p>;

  return (
    <section className="student-my-courses">

      {/* Panel izquierdo: lista de cursos */}
      <div className="my-courses-list">
        <h2>Mis cursos</h2>
        <ul>
          {cursos.map((curso) => (
            <li
              key={curso.idCurso}
              className={cursoActivo?.idCurso === curso.idCurso ? "active" : ""}
              onClick={() => setCursoActivo(curso)}
            >
              <span>{curso.nombreCurso}</span>
              <span className="progreso">{curso.progreso ?? 0}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho: contenidos del curso activo */}
      <div className="my-courses-content">
        <h2>{cursoActivo?.nombreCurso}</h2>
        <p>Selecciona un contenido para reproducirlo.</p>

        {cargandoContenidos ? (
          <p className="estado-info">Cargando contenidos...</p>
        ) : (
          <div className="contenido-lista">
            {contenidos.map((c) => (
              <article
                key={c.idContenido}
                className={`contenido-item ${c.visto ? "visto" : ""}`}
              >
                <div>
                  <h3>{c.titulo}</h3>
                  {c.visto && (
                    <span className="badge-visto">✓ Visto</span>
                  )}
                </div>
                <button
                  className="btn-small"
                  onClick={() => handleReproducir(c.idContenido)}
                >
                  {c.visto ? "Ver de nuevo" : "Reproducir"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

    </section>
  );
};

export default StudentMyCoursesView;