// src/components/dashboard-admin/views/AdminAnalyticsView.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../../../styles/DashboardAdmin/views/admin-analytics.css";

const topCategoriasMock = [
  { nombre: "Programación", reproducciones: 1200 },
  { nombre: "Diseño", reproducciones: 800 },
  { nombre: "Negocios", reproducciones: 650 },
];

const topNivelesMock = [
  { nombre: "Principiante", cursados: 900 },
  { nombre: "Intermedio", cursados: 700 },
  { nombre: "Avanzado", cursados: 300 },
];

// const topCursosMock = [
//   "Python para principiantes",
//   "Fundamentos de Bases de Datos",
//   "Introducción a Machine Learning",
// ];

const suscripcionesMock = [
  { tipo: "Mensual", estudiantes: 130 },
  { tipo: "Trimestral", estudiantes: 45 },
  { tipo: "Anual", estudiantes: 60 },
];

const topCursosMock = [
  { titulo: "Python para principiantes", reproducciones: 1100 },
  { titulo: "Fundamentos de Bases de Datos", reproducciones: 980 },
  { titulo: "Introducción a Machine Learning", reproducciones: 870 },
  { titulo: "JavaScript Moderno", reproducciones: 760 },
  { titulo: "Diseño UX/UI desde cero", reproducciones: 690 },
  { titulo: "React para principiantes", reproducciones: 610 },
  { titulo: "SQL Avanzado", reproducciones: 540 },
  { titulo: "Marketing Digital", reproducciones: 470 },
  { titulo: "Excel para análisis de datos", reproducciones: 400 },
  { titulo: "Introducción a la Ciberseguridad", reproducciones: 350 },
];

// Paleta de colores para las gráficas (puedes ajustarla a tus --ea-* tokens)
const COLORES_NIVELES = ["#4F46E5", "#22C55E", "#F59E0B"];
const COLORES_SUSCRIPCIONES = ["#0EA5E9", "#A855F7", "#EC4899"];

const AdminAnalyticsView = () => {

  // De más oscuro a más claro, mismo tono base (índigo, como tu #4F46E5)
  const COLORES_CATEGORIAS = ["#4F46E5", "#7C76ED", "#A8A4F4"];
  const COLORES_CURSOS = ["#330A7A", "#5C0A87", "#860B91", "#A30E72", "#C01155", "#D6184F", "#DE4843", "#E67838", "#EE9F3F", "#F4B942"];

  return (
    <section className="admin-analytics">
      <header className="admin-analytics-header">
        <h1>Analíticas de contenido</h1>
        <p>
          Este panel muestra las métricas de reproducción y distribución de
          suscripciones de la plataforma.
        </p>
      </header>

      <div className="admin-analytics-grid">
        {/* Top 3 categorías -> Gráfica de barras */}
        <div className="analytics-card">
          <h2>Top 3 categorías por reproducciones</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCategoriasMock} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={false}
               />
              <Bar dataKey="reproducciones" radius={[6, 6, 0, 0]}>
                {topCategoriasMock.map((entry, index) => (
                  <Cell
                    key={entry.nombre}
                    fill={COLORES_CATEGORIAS[index % COLORES_CATEGORIAS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 3 niveles -> Gráfica de dona */}
        <div className="analytics-card">
          <h2>Top 3 niveles más cursados</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={topNivelesMock}
                dataKey="cursados"
                nameKey="nombre"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {topNivelesMock.map((entry, index) => (
                  <Cell key={entry.nombre} fill={COLORES_NIVELES[index % COLORES_NIVELES.length]} />
                ))}
              </Pie>
              <Tooltip 
              cursor={false}
               
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 cursos -> Gráfica de barras horizontales */}
        <div className="analytics-card analytics-card--wide">
          <h2>Top 10 cursos más visualizados</h2>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={topCursosMock}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="titulo"
                tick={{ fontSize: 11 }}
                width={160}
              />
              <Tooltip cursor={false} />
              <Bar dataKey="reproducciones" radius={[0, 6, 6, 0]}>
                {topCursosMock.map((entry, index) => (
                  <Cell key={entry.titulo} fill={COLORES_CURSOS[index % COLORES_CURSOS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de estudiantes por suscripción -> Gráfica de barras horizontales */}
        <div className="analytics-card">
          <h2>Distribución de estudiantes por suscripción</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={suscripcionesMock}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="tipo" tick={{ fontSize: 12 }} width={80} />
              <Tooltip cursor={false} />
              <Bar dataKey="estudiantes" radius={[0, 6, 6, 0]}>
                {suscripcionesMock.map((entry, index) => (
                  <Cell key={entry.tipo} fill={COLORES_SUSCRIPCIONES[index % COLORES_SUSCRIPCIONES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalyticsView;