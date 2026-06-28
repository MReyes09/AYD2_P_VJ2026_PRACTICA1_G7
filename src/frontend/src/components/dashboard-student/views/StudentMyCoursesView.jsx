// src/components/dashboard-student/views/StudentMyCoursesView.jsx
import { useState, useEffect } from "react";
import "../../../styles/DashboardStudent/views/student-my-courses.css";

const API = "http://localhost:5000/api";

// Convierte cualquier URL de YouTube a formato embed
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  // Ya es embed
  if (url.includes("youtube.com/embed/")) return url;

  // Formato: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // Formato: https://www.youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  return null;
};

const StudentMyCoursesView = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [videoActivo, setVideoActivo] = useState(null); // { idContenido, titulo, embedUrl }
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [cargandoContenidos, setCargandoContenidos] = useState(false);
  const [error, setError] = useState(null);

  const idPersona = localStorage.getItem("userId");

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
        if (data.length > 0) setCursoActivo(data[0]);
      })
      .catch(() => setError("Error al cargar tus cursos."))
      .finally(() => setCargandoCursos(false));
  }, [idPersona]);

  // 2. Cargar contenidos cuando cambia el curso activo
  useEffect(() => {
    if (!cursoActivo) return;

    setVideoActivo(null); // limpia el reproductor al cambiar de curso
    setCargandoContenidos(true);

    fetch(`${API}/mis-cursos/${idPersona}/curso/${cursoActivo.idCurso}/contenidos`)
      .then((r) => r.json())
      .then(({ data }) => setContenidos(data))
      .catch(() => setError("Error al cargar los contenidos."))
      .finally(() => setCargandoContenidos(false));
  }, [cursoActivo]);

  // 3. Reproducir: muestra el video y registra en Bitácora
  const handleReproducir = (contenido) => {
    const embedUrl = getYoutubeEmbedUrl(contenido.pathContenido);

    // Muestra el reproductor
    setVideoActivo({
      idContenido: contenido.idContenido,
      titulo: contenido.titulo,
      embedUrl,
    });

    // Registra en Bitácora
    fetch(`${API}/mis-cursos/vista`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPersona: Number(idPersona),
        idContenido: contenido.idContenido,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        // Marca como visto en la lista
        setContenidos((prev) =>
          prev.map((c) =>
            c.idContenido === contenido.idContenido
              ? { ...c, visto: true, ultimaVista: new Date().toISOString() }
              : c
          )
        );
        // Recalcula progreso
        setCursos((prev) =>
          prev.map((curso) => {
            if (curso.idCurso !== cursoActivo.idCurso) return curso;
            const vistos = contenidos.filter(
              (c) => c.visto || c.idContenido === contenido.idContenido
            ).length;
            const progreso = Math.round((vistos / curso.totalContenidos) * 100);
            return { ...curso, contenidosVistos: vistos, progreso };
          })
        );
      })
      .catch(() => setError("No se pudo registrar la reproducción."));
  };

  if (cargandoCursos) return <p className="estado-info">Cargando tus cursos...</p>;
  if (error)          return <p className="estado-error">{error}</p>;
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

      {/* Panel derecho */}
      <div className="my-courses-content">
        <h2>{cursoActivo?.nombreCurso}</h2>

        {/* Reproductor YouTube */}
        {videoActivo ? (
          <div className="video-wrapper">
            <h3 className="video-titulo">{videoActivo.titulo}</h3>
            {videoActivo.embedUrl ? (
              <iframe
                src={videoActivo.embedUrl}
                title={videoActivo.titulo}
                className="video-player"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <p className="estado-error">
                URL de video no válida para este contenido.
              </p>
            )}
          </div>
        ) : (
          <p className="video-placeholder">
            Selecciona un contenido para reproducirlo.
          </p>
        )}

        {/* Lista de contenidos */}
        {cargandoContenidos ? (
          <p className="estado-info">Cargando contenidos...</p>
        ) : (
          <div className="contenido-lista">
            {contenidos.map((c) => (
              <article
                key={c.idContenido}
                className={`contenido-item ${c.visto ? "visto" : ""} ${
                  videoActivo?.idContenido === c.idContenido ? "reproduciendo" : ""
                }`}
              >
                <div>
                  <h3>{c.titulo}</h3>
                  {c.visto && <span className="badge-visto">✓ Visto</span>}
                  {videoActivo?.idContenido === c.idContenido && (
                    <span className="badge-reproduciendo">▶ Reproduciendo</span>
                  )}
                </div>
                <button
                  className="btn-small"
                  onClick={() => handleReproducir(c)}
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