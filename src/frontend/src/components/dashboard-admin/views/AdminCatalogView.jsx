// src/components/dashboard-admin/views/AdminCatalogView.jsx
import React, { useState } from "react";
import "../../../styles/DashboardAdmin/views/admin-catalog.css";

const tiposMock = ["Clase grabada", "Taller en vivo", "Conferencia"]; // [file:9]
const categoriasMock = ["Programación", "Diseño", "Negocios"];        // [file:9]
const nivelesMock = ["Principiante", "Intermedio", "Avanzado"];       // [file:9]

const cursosMock = [
  {
    id: 1,
    titulo: "React desde cero",
    tipo: "Clase grabada",
    categoria: "Programación",
    nivel: "Intermedio",
    anio: 2024,
  },
  {
    id: 2,
    titulo: "Introducción al diseño UI",
    tipo: "Clase grabada",
    categoria: "Diseño",
    nivel: "Principiante",
    anio: 2023,
  },
];

const AdminCatalogView = () => {
  const [filtros, setFiltros] = useState({
    titulo: "",
    tipo: "",
    categoria: "",
    nivel: "",
    anio: "",
  });

  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const filtrados = cursosMock.filter((c) => {
    return (
      c.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) &&
      (filtros.tipo ? c.tipo === filtros.tipo : true) &&
      (filtros.categoria ? c.categoria === filtros.categoria : true) &&
      (filtros.nivel ? c.nivel === filtros.nivel : true) &&
      (filtros.anio ? String(c.anio) === filtros.anio : true)
    );
  });

  return (
    <section className="admin-catalog">
      <header className="admin-catalog-header">
        <h1>Gestión del catálogo de cursos</h1>
        <p>
          Administra tipos de contenido, categorías temáticas, niveles de
          dificultad y cursos registrados. [file:9]
        </p>
      </header>

      {/* Gestión de catálogos */}
      <div className="admin-catalog-grid">
        <div className="admin-catalog-panel">
          <h2>Tipos de contenido</h2>
          <ul>
            {tiposMock.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <button className="btn-small">Agregar tipo</button>
        </div>

        <div className="admin-catalog-panel">
          <h2>Categorías temáticas</h2>
          <ul>
            {categoriasMock.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <button className="btn-small">Agregar categoría</button>
        </div>

        <div className="admin-catalog-panel">
          <h2>Niveles de dificultad</h2>
          <ul>
            {nivelesMock.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <button className="btn-small">Agregar nivel</button>
        </div>
      </div>

      {/* Búsqueda y filtros de cursos */}
      <div className="admin-catalog-search">
        <h2>Búsqueda de cursos</h2>
        <p>
          Busca cursos por título y aplica filtros cruzados por tipo, categoría,
          dificultad o año de lanzamiento. [file:9]
        </p>

        <div className="admin-catalog-filters">
          <input
            type="text"
            name="titulo"
            placeholder="Buscar por título de curso..."
            value={filtros.titulo}
            onChange={handleChangeFiltro}
          />
          <select
            name="tipo"
            value={filtros.tipo}
            onChange={handleChangeFiltro}
          >
            <option value="">Tipo</option>
            {tiposMock.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={handleChangeFiltro}
          >
            <option value="">Categoría</option>
            {categoriasMock.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            name="nivel"
            value={filtros.nivel}
            onChange={handleChangeFiltro}
          >
            <option value="">Nivel</option>
            {nivelesMock.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="anio"
            placeholder="Año"
            value={filtros.anio}
            onChange={handleChangeFiltro}
          />
        </div>

        <div className="admin-catalog-results">
          {filtrados.map((c) => (
            <article key={c.id} className="admin-course-card">
              <h3>{c.titulo}</h3>
              <p>
                {c.tipo} · {c.categoria}
              </p>
              <span className="badge-level">{c.nivel}</span>
              <small>Año {c.anio}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminCatalogView;