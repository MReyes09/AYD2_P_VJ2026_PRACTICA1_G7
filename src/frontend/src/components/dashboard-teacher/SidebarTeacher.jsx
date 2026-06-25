// src/components/dashboard-teacher/SidebarTeacher.jsx
import React from "react";
import "../../styles/DashboardTeacher/sidebar-teacher.css";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

const SidebarTeacher = ({ vistaActiva, setVista }) => {
  return (
    <aside className="sidebar-teacher">
      <div className="sidebar-teacher-header">
        <div className="sidebar-teacher-logo">
          <MenuBookIcon className="sidebar-teacher-logo-icon" />
          <span className="sidebar-teacher-logo-text">LearnFlow Instructor</span>
        </div>
      </div>

      <nav className="sidebar-teacher-nav">
        <ul>
          <li
            className={vistaActiva === "inicio" ? "active" : ""}
            onClick={() => setVista("inicio")}
          >
            <HomeIcon />
            <span>Dashboard</span>
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
          <li onClick={() => console.log("Salir instructor")}>
            <LogoutIcon />
            <span>Salir</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-teacher-footer">
        <div className="avatar-teacher">INS</div>
        <div className="sidebar-teacher-user">
          <span className="user-name">Ana Instructora</span>
          <span className="user-role">Creadora de contenido</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarTeacher;