import React, { useState, useEffect } from "react";
import "../../../styles/DashboardTeacher/views/teacher-content.css";

const AdminContentView = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    pathContenido: "",
    descripcion: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/cursos")
      .then((r) => r.json())
      .then((data) => {
        const lista = data.data || [];
        setCursos(lista);
        if (lista.length > 0) setCursoSeleccionado(lista[0].idCurso);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/admin/cursos/${cursoSeleccionado}/contenido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Contenido agregado exitosamente");
      setForm({ titulo: "", pathContenido: "", descripcion: "" });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <section className="teacher-content">
      <h2>Contenido de curso</h2>
      <div className="teacher-content-form">
        <label>Curso
          <select value={cursoSeleccionado || ""} onChange={(e) => setCursoSeleccionado(Number(e.target.value))}>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>{c.nombreCurso}</option>
            ))}
          </select>
        </label>
        <form onSubmit={handleSubmit}>
          <label>Título del contenido
            <input name="titulo" value={form.titulo} onChange={handleChange} required />
          </label>
          <label>URL o ruta del video
            <input name="pathContenido" value={form.pathContenido} onChange={handleChange} required />
          </label>
          <label>Descripción
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </label>
          <button className="btn-primary" type="submit">Agregar contenido</button>
        </form>
      </div>
    </section>
  );
};

export default AdminContentView;