// src/components/dashboard-student/SidebarStudent.jsx
import React, { useState, useEffect } from "react";
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

  const namePersona = localStorage.getItem("userName") ?? "Estudiante";
  const iniciales = namePersona
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((palabra) => palabra[0].toUpperCase())
    .join("");

  const [planActual, setPlanActual] = useState(
    localStorage.getItem("userPlan") ?? "Sin plan"
    );
  const [planEstado, setPlanEstado] = useState(
      localStorage.getItem("userPlanEstado") ?? ""
    );


  // Esto cubre el caso de que el usuario actualice su plan en la vista de perfil
  useEffect(() => {
    const actualizarPlan = () => {
      setPlanActual(localStorage.getItem("userPlan") ?? "Sin plan");
      setPlanEstado(localStorage.getItem("userPlanEstado") ?? "");
    };

    actualizarPlan();
    window.addEventListener("userPlanUpdated", actualizarPlan);
    return () => window.removeEventListener("userPlanUpdated", actualizarPlan);
  }, [vistaActiva]);


  useEffect(() => {
    const actualizarPlan = () => {
      setPlanActual(localStorage.getItem("userPlan") ?? "Sin plan");
    };

    // Refresca al cambiar de vista
    actualizarPlan();

    // Refresca cuando el perfil dispara el evento
    window.addEventListener("userPlanUpdated", actualizarPlan);

    return () => {
      window.removeEventListener("userPlanUpdated", actualizarPlan);
    };
  }, [vistaActiva]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPlan"); 
    localStorage.removeItem("user_username");
    localStorage.removeItem("username");
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user_cognito_id");
    localStorage.removeItem("userPlanEstado");
    navigate("/");
  };

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
          <li onClick={handleLogout}>
            <LogoutIcon />
            <span>Salir</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-student-footer">
        <div className="avatar-student">{iniciales}</div>
        <div className="sidebar-student-user">
          <span className="user-name">{namePersona}</span>
          <span className="user-plan">
            {planEstado === "Cancelada" ? "Cancelada" : planActual}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarStudent;