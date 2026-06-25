// src/pages/Home.jsx
import React from "react";
import "../styles/Home/Home.css";
import NavbarHome from "../components/home/NavbarHome.jsx";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Home = () => {
  return (
    <div className="home-page">
      <NavbarHome />

      <main className="home-container">
        <section className="home-hero">
          <div className="home-text">
            <span className="home-badge">
              Plataforma de cursos en video para aprender a tu ritmo
            </span>

            <h1 className="home-title serif-text">
              Aprende <span className="home-highlight">cuando quieras</span>,
              <br />
              con cursos en video de alta calidad.
            </h1>

            <p className="home-description">
              LearnFlow te permite suscribirte, explorar un catálogo de cursos
              organizados por temáticas y niveles de dificultad, y llevar un
              registro claro de tu progreso.
            </p>

            <div className="home-feature">
              <div className="feature-item">
                <PlayCircleFilledWhiteIcon className="feature-icon" />
                <span>Reproducción fluida de video</span>
              </div>
              <div className="feature-item">
                <SchoolIcon className="feature-icon" />
                <span>Cursos organizados por nivel</span>
              </div>
              <div className="feature-item">
                <TrendingUpIcon className="feature-icon" />
                <span>Panel de métricas para instructores</span>
              </div>
            </div>
          </div>

          <div className="home-visual">
            <div className="home-card">
              <div className="home-card-header">
                <span className="badge-pill">Curso destacado</span>
                <span className="home-card-pill">Programación</span>
              </div>

              <div className="home-card-video">
                <PlayCircleFilledWhiteIcon className="home-card-play" />
              </div>

              <h3 className="home-card-title serif-text">
                Introducción a React con LearnFlow
              </h3>
              <p className="home-card-subtitle">
                Más de 1200 estudiantes inscritos este mes.
              </p>

              <div className="home-card-footer">
                <div>
                  <span className="home-card-label">Nivel</span>
                  <span className="home-card-value">Intermedio</span>
                </div>
                <div>
                  <span className="home-card-label">Duración</span>
                  <span className="home-card-value">8 horas</span>
                </div>
                <div>
                  <span className="home-card-label">Suscripción</span>
                  <span className="home-card-value">Mensual / Anual</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Aquí irían los modales de Login / Registro si los usas como en tu ejemplo */}
    </div>
  );
};

export default Home;