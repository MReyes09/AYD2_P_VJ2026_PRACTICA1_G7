// src/components/dashboard-admin/SidebarAdmin.jsx
import React from "react";
import "../../styles/DashboardAdmin/sidebar-admin.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import StorageIcon from "@mui/icons-material/Storage";

const SidebarAdmin = ({ vistaActiva, setVista }) => {
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
            className={vistaActiva === "analiticas" ? "active" : ""}
            onClick={() => setVista("analiticas")}
          >
            <BarChartIcon />
            <span>Analíticas de uso</span>
          </li>
          <li onClick={() => console.log("Salir administrador")}>
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