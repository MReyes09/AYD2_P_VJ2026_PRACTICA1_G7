// src/components/dashboard-student/SidebarStudent.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/DashboardStudent/sidebar-student.css";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const SidebarStudent = ({ vistaActiva, setVista }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar cualquier dato de sesión si es necesario
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  }

// Obtener nombre del localStorage
const namePersona = localStorage.getItem("userName") ?? "Estudiante";

// Generar iniciales: toma la primera letra de cada palabra, máximo 3
const iniciales = namePersona
  .split(" ")
  .filter(Boolean)
  .slice(0, 3)
  .map((palabra) => palabra[0].toUpperCase())
  .join("");


// ── Subscription state (mock) ─────────────────────────────────────────────
const [suscripcion] = useState({
  tipo: "Mensual",
  fechaFin: "",
  estado: "Activa",
});

  return (
    <aside className="sidebar-student">
      <div className="sidebar-student-header">
        <div className="sidebar-student-logo">
          <SchoolIcon className="sidebar-student-logo-icon" />
          <span className="sidebar-student-logo-text">LearnFlow Alumno</span>
        </div>
      </div>

      <nav className="sidebar-student-nav">
        <ul>
          <li
            className={vistaActiva === "inicio" ? "active" : ""}
            onClick={() => setVista("inicio")}
          >
            <HomeIcon />
            <span>Inicio</span>
          </li>
          <li
            className={vistaActiva === "cursos" ? "active" : ""}
            onClick={() => setVista("cursos")}
          >
            <SearchIcon />
            <span>Buscar cursos</span>
          </li>
          <li
            className={vistaActiva === "mis-cursos" ? "active" : ""}
            onClick={() => setVista("mis-cursos")}
          >
            <LibraryBooksIcon />
            <span>Mis cursos</span>
          </li>
          <li
            className={vistaActiva === "perfil" ? "active" : ""}
            onClick={() => setVista("perfil")}
          >
            <AccountCircleIcon />
            <span>Perfil y suscripción</span>
          </li>
          <li onClick={() => handleLogout()}>
            <LogoutIcon />
            <span>Salir</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-student-footer">
        <div className="avatar-student">{iniciales}</div>
        <div className="sidebar-student-user">
          <span className="user-name">{namePersona}</span>
          <span className="user-plan">{suscripcion.tipo}</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarStudent;