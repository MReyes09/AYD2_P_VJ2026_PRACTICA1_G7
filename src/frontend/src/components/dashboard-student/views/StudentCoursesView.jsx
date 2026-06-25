// src/components/dashboard-student/views/StudentCoursesView.jsx
import { useState, useEffect } from "react";
import "../../../styles/DashboardStudent/views/student-courses.css";

const API = "http://localhost:5000/api";

const StudentCoursesView = () => {
  const [cursos, setCursos] = useState([]);
  const [tematicas, setTematicas] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [idTematica, setIdTematica] = useState("");
  const [idDificultad, setIdDificultad] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Carga los filtros (categorías y niveles) una sola vez al montar
  useEffect(() => {
    fetch(`${API}/cursos/filtros`)
      .then((r) => r.json())
      .then(({ data }) => {
        setTematicas(data.tematicas);
        setDificultades(data.dificultades);
      })
      .catch(() => setError("No se pudieron cargar los filtros."));
  }, []);

  // Consulta cursos cada vez que cambian los filtros
  useEffect(() => {
    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    if (busqueda)    params.append("titulo", busqueda);
    if (idTematica)  params.append("idTematica", idTematica);
    if (idDificultad) params.append("idDificultad", idDificultad);

    fetch(`${API}/cursos?${params.toString()}`)
      .then((r) => r.json())
      .then(({ data }) => setCursos(data))
      .catch(() => setError("Error al obtener los cursos."))
      .finally(() => setCargando(false));
  }, [busqueda, idTematica, idDificultad]);

  return (
    <section className="student-courses">
      <header className="student-courses-header">
        <h1>Buscar cursos</h1>
        <p>Encuentra cursos por título, categoría o nivel de dificultad.</p>
      </header>

      <div className="student-courses-filters">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Categorías dinámicas desde la BD */}
        <select value={idTematica} onChange={(e) => setIdTematica(e.target.value)}>
          <option value="">Todas las categorías</option>
          {tematicas.map((t) => (
            <option key={t.idTematica} value={t.idTematica}>
              {t.tipoTematica}
            </option>
          ))}
        </select>

        {/* Niveles dinámicos desde la BD */}
        <select value={idDificultad} onChange={(e) => setIdDificultad(e.target.value)}>
          <option value="">Todos los niveles</option>
          {dificultades.map((d) => (
            <option key={d.idDificultad} value={d.idDificultad}>
              {d.tipoDificultad}
            </option>
          ))}
        </select>
      </div>

      {/* Estados de carga y error */}
      {cargando && <p className="estado-info">Cargando cursos...</p>}
      {error   && <p className="estado-error">{error}</p>}

      <div className="student-courses-grid">
        {!cargando && !error && cursos.length === 0 && (
          <p className="estado-info">No se encontraron cursos.</p>
        )}
        {cursos.map((curso) => (
          <article key={curso.idCurso} className="student-course-card">
            <h3>{curso.nombreCurso}</h3>
            <p>{curso.tipoTematica}</p>
            <span className="badge-level">{curso.tipoDificultad}</span>
            <small>Año {curso.anioProduccion}</small>
            <button className="btn-small">Inscribirme</button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StudentCoursesView;