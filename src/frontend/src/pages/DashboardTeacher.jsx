// src/pages/DashboardTeacher.jsx
import React, { useState } from "react";
import "../styles/DashboardTeacher/layout-teacher.css";
import SidebarTeacher from "../components/dashboard-teacher/SidebarTeacher.jsx";
import TeacherHomeView from "../components/dashboard-teacher/views/TeacherHomeView.jsx";
import TeacherCoursesView from "../components/dashboard-teacher/views/TeacherCoursesView.jsx";
import TeacherContentView from "../components/dashboard-teacher/views/TeacherContentView.jsx";

const DashboardTeacher = () => {
  const [vistaActiva, setVistaActiva] = useState("inicio");

  const renderVista = () => {
    switch (vistaActiva) {
      case "cursos":
        return <TeacherCoursesView />;
      case "contenido":
        return <TeacherContentView />;
      default:
        return <TeacherHomeView />;
    }
  };

  return (
    <div className="teacher-dashboard">
      <SidebarTeacher vistaActiva={vistaActiva} setVista={setVistaActiva} />
      <main className="teacher-dashboard-main">{renderVista()}</main>
    </div>
  );
};

export default DashboardTeacher;