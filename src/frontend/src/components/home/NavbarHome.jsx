// src/components/home/NavbarHome.jsx
import React from "react";
import "../../styles/Home/nav-home.css";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlined";

import { Link } from "react-router-dom";

const NavbarHome = () => {
  return (
    <nav className="navbar-home">
      <div className="navbar-home-container">
        <div className="navbar-home-logo">
          <PlayCircleOutlineIcon className="navbar-home-icon" />
          <span className="serif-text navbar-home-text">LearnFlow</span>
        </div>

        <div className="navbar-home-links">
          <button className="navbar-link">Catálogo</button>
          <button className="navbar-link">Planes</button>
          <Link
            className="btn-outline"

            to="/login"
          >
            Iniciar sesión
          </Link>
          <Link
            className="btn-fill"
            to="/register"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;