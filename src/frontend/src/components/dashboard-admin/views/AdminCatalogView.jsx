// src/components/dashboard-admin/views/AdminCatalogView.jsx
import { useState, useEffect } from "react";
import AgregarCatalogoModal from "../modals/AgregarCatalogomodal";
import EditarCatalogoModal from "../modals/EditarCatalogomodal";
import EliminarCatalogoModal from "../modals/EliminarCatalogoModal";
import "../../../styles/DashboardAdmin/views/admin-catalog.css";

// CRUD TIPO CONTENIDO
import { listarTipoContenido, crearTipoContenido, editarTipoContenido, eliminarTipoContenido } from "../../../controllers/Contenido/Tipo_Contenido";

// CRUD TEMATICAS CURSOS
import { listarTematicas, crearTematica, editarTematica, eliminarTematica } from "../../../controllers/Contenido/Tematica_Contenido";

// CRUD DIFICULTADES CURSOS
import { listarDificultades, crearDificultad, editarDificultad, eliminarDificultad } from "../../../controllers/Contenido/Dificultad_Contenido";

// Obtener cursos filtrados o sin filtros
import { listarCursos } from "../../../controllers/Cursos/Cursos_controller";

const AdminCatalogView = () => {
  const [tipos, setTipos] = useState([]);
  const [tematicas, setTematicas] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Estado para controlar qué modal está abierto - Modal de crear catalogo
  const [modalConfig, setModalConfig] = useState({ visible: false, tipo: null, crearFn: null });
  const abrirModal = (tipo, crearFn) => setModalConfig({ visible: true, tipo, crearFn });
  const cerrarModal = () => setModalConfig({ visible: false, tipo: null, crearFn: null });

  // Estado para controlar qué modal está abierto - Modal de editar el catalogo
  const [modalEditarConfig, setModalEditarConfig] = useState({ visible: false, tipo: null, items: [], editarFn: null });
  const abrirModalEditar = (tipo, items, editarFn) => setModalEditarConfig({ visible: true, tipo, items, editarFn });
  const cerrarModalEditar = () => setModalEditarConfig({ visible: false, tipo: null, items: [], editarFn: null });

  // Estado para controlar qué modal está abierto - Modal de eliminar del catalogo
  const [modalEliminarConfig, setModalEliminarConfig] = useState({ visible: false, tipo: null, items: [], eliminarFn: null });
  const abrirModalEliminar = (tipo, items, eliminarFn) => setModalEliminarConfig({ visible: true, tipo, items, eliminarFn });
  const cerrarModalEliminar = () => setModalEliminarConfig({ visible: false, tipo: null, items: [], eliminarFn: null });

  const [filtros, setFiltros] = useState({
    titulo: "",
    idTematica: "",
    idDificultad: "",
    anio: "",
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [tiposData, tematicasData, dificultadesData] = await Promise.all([
        listarTipoContenido(),
        listarTematicas(),
        listarDificultades(),
      ]);
      setTipos(tiposData);
      setTematicas(tematicasData);
      setDificultades(dificultadesData);
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
    }
  };

  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // Carga cursos al montar y cada vez que cambian los filtros
  useEffect(() => {
    cargarCursos();
  }, [filtros]);

  const cargarCursos = async () => {
    try {
      const data = await listarCursos(
        filtros.titulo || undefined,
        filtros.idTematica || undefined,
        filtros.idDificultad || undefined
      );
      setCursos(data.data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  const cursosFiltrados = cursos.filter((c) =>
    filtros.anio ? String(c.anioProduccion) === filtros.anio : true
  );

  return (
    <section className="admin-catalog">
      <header className="admin-catalog-header">
        <h1>Gestión del catálogo de cursos</h1>
        <p>
          Administra tipos de contenido, categorías temáticas, niveles de
          dificultad y cursos registrados.
        </p>
      </header>

      {/* Gestión de catálogos */}
      <div className="admin-catalog-grid">
        <div className="admin-catalog-panel">
          <h2>Tipos de contenido</h2>
          <ul>
            {tipos.map((t) => (
              <li key={t.idTipoContenido}>{t.tipoContenido}</li>
            ))}
          </ul>
          <div className="admin-catalog-panel-actions">
            <button className="btn-small" onClick={() => abrirModal("tipo", crearTipoContenido)}>Agregar tipo</button>
            <button className="btn-small" onClick={() => abrirModalEditar("tipo", tipos, editarTipoContenido)}>
              Editar tipo
            </button>
            <button className="btn-small" onClick={() => abrirModalEliminar("tipo", tipos, eliminarTipoContenido)}>
              Eliminar tipo
            </button>
          </div>
        </div>

        <div className="admin-catalog-panel">
          <h2>Categorías temáticas</h2>
          <ul>
            {tematicas.map((t) => (
              <li key={t.idTematica}>{t.tipoTematica}</li>
            ))}
          </ul>
          <div className="admin-catalog-panel-actions">
            <button className="btn-small" onClick={() => abrirModal("tematica", crearTematica)}>Agregar categoría</button>
            <button className="btn-small" onClick={() => abrirModalEditar("tematica", tematicas, editarTematica)}>
              Editar categoría
            </button>
            <button className="btn-small" onClick={() => abrirModalEliminar("tematica", tematicas, eliminarTematica)}>
              Eliminar categoría
            </button>
          </div>
        </div>

        <div className="admin-catalog-panel">
          <h2>Niveles de dificultad</h2>
          <ul>
            {dificultades.map((d) => (
              <li key={d.idDificultad}>{d.tipoDificultad}</li>
            ))}
          </ul>
          <div className="admin-catalog-panel-actions">
            <button className="btn-small" onClick={() => abrirModal("dificultad", crearDificultad)}>Agregar nivel</button>
            <button className="btn-small" onClick={() => abrirModalEditar("dificultad", dificultades, editarDificultad)}>
              Editar nivel
            </button>
            <button className="btn-small" onClick={() => abrirModalEliminar("dificultad", dificultades, eliminarDificultad)}>
              Eliminar nivel
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda y filtros de cursos */}
      <div className="admin-catalog-search">
        <h2>Búsqueda de cursos</h2>
        <p>
          Busca cursos por título y aplica filtros cruzados por tipo, categoría,
          dificultad o año de lanzamiento.
        </p>

        {/* Filtros — usar idTematica e idDificultad como value */}
        <div className="admin-catalog-filters">
          <input
            type="text"
            name="titulo"
            placeholder="Buscar por título de curso..."
            value={filtros.titulo}
            onChange={handleChangeFiltro}
          />
          <select name="idTematica" value={filtros.idTematica} onChange={handleChangeFiltro}>
            <option value="">Categoría</option>
            {tematicas.map((t) => (
              <option key={t.idTematica} value={t.idTematica}>
                {t.tipoTematica}
              </option>
            ))}
          </select>
          <select name="idDificultad" value={filtros.idDificultad} onChange={handleChangeFiltro}>
            <option value="">Nivel</option>
            {dificultades.map((d) => (
              <option key={d.idDificultad} value={d.idDificultad}>
                {d.tipoDificultad}
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

        {/* Tarjetas con campos reales del endpoint */}
        <div className="admin-catalog-results">
          {cursosFiltrados.map((c) => (
            <article key={c.idCurso} className="admin-course-card">
              <h3>{c.nombreCurso}</h3>
              <p>{c.tipoTematica}</p>
              <span className="badge-level">{c.tipoDificultad}</span>
              <small>Año {c.anioProduccion}</small>
            </article>
          ))}
        </div>
      </div>

      <AgregarCatalogoModal
        visible={modalConfig.visible}
        tipo={modalConfig.tipo}
        crearFn={modalConfig.crearFn}
        onClose={cerrarModal}
        onSuccess={cargarCatalogos}  // recarga la lista automáticamente
      />

      <EditarCatalogoModal
        visible={modalEditarConfig.visible}
        tipo={modalEditarConfig.tipo}
        items={modalEditarConfig.items}
        editarFn={modalEditarConfig.editarFn}
        onClose={cerrarModalEditar}
        onSuccess={cargarCatalogos}
      />

      <EliminarCatalogoModal
        visible={modalEliminarConfig.visible}
        tipo={modalEliminarConfig.tipo}
        items={modalEliminarConfig.items}
        eliminarFn={modalEliminarConfig.eliminarFn}
        onClose={cerrarModalEliminar}
        onSuccess={cargarCatalogos}
      />

    </section >
  );
};

export default AdminCatalogView;