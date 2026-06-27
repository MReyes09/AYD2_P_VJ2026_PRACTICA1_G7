// src/components/dashboard-admin/SidebarAdmin.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/DashboardAdmin/sidebar-admin.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import StorageIcon from "@mui/icons-material/Storage";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";

const SidebarAdmin = ({ vistaActiva, setVista }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar cualquier dato de sesión si es necesario
    localStorage.removeItem("userId");
    navigate("/");
  }

  return (
    <aside className="sidebar-admin">
      <div className="sidebar-admin-header">
        <div className="sidebar-admin-logo">
          <StorageIcon className="sidebar-admin-logo-icon" />
          <span className="sidebar-admin-logo-text">
            LearnFlow Admin Contenido
          </span>
        </div>
      </div>

      <nav className="sidebar-admin-nav">
        <ul>
          <li
            className={vistaActiva === "inicio" ? "active" : ""}
            onClick={() => setVista("inicio")}
          >
            <DashboardIcon />
            <span>Inicio</span>
          </li>
          <li
            className={vistaActiva === "catalogo" ? "active" : ""}
            onClick={() => setVista("catalogo")}
          >
            <CategoryIcon />
            <span>Catálogo de cursos</span>
          </li>
          <li
            className={vistaActiva === "cursos" ? "active" : ""}
            onClick={() => setVista("cursos")}
          >
            <LibraryAddIcon />
            <span>Mis cursos</span>
          </li>
          <li
            className={vistaActiva === "contenido" ? "active" : ""}
            onClick={() => setVista("contenido")}
          >
            <PlaylistPlayIcon />
            <span>Contenido de curso</span>
          </li>
          <li
            className={vistaActiva === "analiticas" ? "active" : ""}
            onClick={() => setVista("analiticas")}
          >
            <BarChartIcon />
            <span>Analíticas de uso</span>
          </li>
          <li onClick={() => handleLogout()}>
            <LogoutIcon />
            <span>Salir</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-admin-footer">
        <div className="avatar-admin">ADM</div>
        <div className="sidebar-admin-user">
          <span className="user-name">Administrador</span>
          <span className="user-role">Gestión de contenido</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;