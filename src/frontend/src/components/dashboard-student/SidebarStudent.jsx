// src/components/dashboard-student/SidebarStudent.jsx
import React from "react";
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
    navigate("/");
  }

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
        <div className="avatar-student">STU</div>
        <div className="sidebar-student-user">
          <span className="user-name">Juan Pérez</span>
          <span className="user-plan">Plan Mensual</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarStudent;