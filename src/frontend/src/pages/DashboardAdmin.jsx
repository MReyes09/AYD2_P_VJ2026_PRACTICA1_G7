// src/pages/DashboardAdmin.jsx
import React, { useState } from "react";
import "../styles/DashboardAdmin/layout-admin.css";
import SidebarAdmin from "../components/dashboard-admin/SidebarAdmin.jsx";
import AdminHomeView from "../components/dashboard-admin/views/AdminHomeView.jsx";
import AdminCatalogView from "../components/dashboard-admin/views/AdminCatalogView.jsx";
import AdminAnalyticsView from "../components/dashboard-admin/views/AdminAnalyticsView.jsx";
import AdminContentView from "../components/dashboard-admin/views/AdminContentView.jsx";
import AdminCoursesView from "../components/dashboard-admin/views/AdminCoursesView.jsx";

const DashboardAdmin = () => {
  const [vistaActiva, setVistaActiva] = useState("inicio");

  const renderVista = () => {
    switch (vistaActiva) {
      case "catalogo":
        return <AdminCatalogView />;
      case "analiticas":
        return <AdminAnalyticsView />;
      case "cursos":
        return <AdminCoursesView />;
      case "contenido":
        return <AdminContentView />;
      default:
        return <AdminHomeView />;
    }
  };

  return (
    <div className="admin-dashboard">
      <SidebarAdmin vistaActiva={vistaActiva} setVista={setVistaActiva} />
      <main className="admin-dashboard-main">{renderVista()}</main>
    </div>
  );
};

export default DashboardAdmin;