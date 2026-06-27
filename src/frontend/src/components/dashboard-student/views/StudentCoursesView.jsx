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

  // Estado por tarjeta: { [idCurso]: "idle" | "cargando" | "inscrito" | "error" | "ya-inscrito" }
  const [estadoInscripcion, setEstadoInscripcion] = useState({});

  const idPersona = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`${API}/cursos/filtros`)
      .then((r) => r.json())
      .then(({ data }) => {
        setTematicas(data.tematicas);
        setDificultades(data.dificultades);
      })
      .catch(() => setError("No se pudieron cargar los filtros."));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    if (busqueda)     params.append("titulo", busqueda);
    if (idTematica)   params.append("idTematica", idTematica);
    if (idDificultad) params.append("idDificultad", idDificultad);

    fetch(`${API}/cursos?${params.toString()}`)
      .then((r) => r.json())
      .then(({ data }) => setCursos(data))
      .catch(() => setError("Error al obtener los cursos."))
      .finally(() => setCargando(false));
  }, [busqueda, idTematica, idDificultad]);

  const handleInscribirse = (idCurso) => {
    if (!idPersona) {
      alert("Debes iniciar sesión para inscribirte.");
      return;
    }

    // Evita doble clic
    if (estadoInscripcion[idCurso] === "cargando") return;

    setEstadoInscripcion((prev) => ({ ...prev, [idCurso]: "cargando" }));

    fetch(`${API}/inscripciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPersona: Number(idPersona),
        idCurso,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          setEstadoInscripcion((prev) => ({ ...prev, [idCurso]: "inscrito" }));
        } else {
          // 403 = sin suscripción, 409 = ya inscrito
          const estado = res.mensaje?.includes("Ya estás") ? "ya-inscrito" : "error";
          setEstadoInscripcion((prev) => ({ ...prev, [idCurso]: estado }));
          alert(res.mensaje); // muestra el motivo claro al usuario
        }
      })
      .catch(() => {
        setEstadoInscripcion((prev) => ({ ...prev, [idCurso]: "error" }));
        alert("Error de conexión. Intenta de nuevo.");
      });
  };

  // Texto y estilo del botón según el estado
  const getBtnProps = (idCurso) => {
    const estado = estadoInscripcion[idCurso] ?? "idle";
    const map = {
      idle:        { texto: "Inscribirme",  disabled: false, clase: "btn-small" },
      cargando:    { texto: "Procesando…",  disabled: true,  clase: "btn-small btn-cargando" },
      inscrito:    { texto: "✓ Inscrito",   disabled: true,  clase: "btn-small btn-inscrito" },
      "ya-inscrito":{ texto: "Ya inscrito", disabled: true,  clase: "btn-small btn-inscrito" },
      error:       { texto: "Reintentar",   disabled: false, clase: "btn-small btn-error" },
    };
    return map[estado];
  };

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
        <select value={idTematica} onChange={(e) => setIdTematica(e.target.value)}>
          <option value="">Todas las categorías</option>
          {tematicas.map((t) => (
            <option key={t.idTematica} value={t.idTematica}>{t.tipoTematica}</option>
          ))}
        </select>
        <select value={idDificultad} onChange={(e) => setIdDificultad(e.target.value)}>
          <option value="">Todos los niveles</option>
          {dificultades.map((d) => (
            <option key={d.idDificultad} value={d.idDificultad}>{d.tipoDificultad}</option>
          ))}
        </select>
      </div>

      {cargando && <p className="estado-info">Cargando cursos...</p>}
      {error    && <p className="estado-error">{error}</p>}

      <div className="student-courses-grid">
        {!cargando && !error && cursos.length === 0 && (
          <p className="estado-info">No se encontraron cursos.</p>
        )}
        {cursos.map((curso) => {
          const { texto, disabled, clase } = getBtnProps(curso.idCurso);
          return (
            <article key={curso.idCurso} className="student-course-card">
              <h3>{curso.nombreCurso}</h3>
              <p>{curso.tipoTematica}</p>
              <span className="badge-level">{curso.tipoDificultad}</span>
              <small>Año {curso.anioProduccion}</small>
              <button
                className={clase}
                disabled={disabled}
                onClick={() => handleInscribirse(curso.idCurso)}
              >
                {texto}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default StudentCoursesView;