// src/pages/DashboardStudent.jsx
import React, { useState } from "react";
import "../styles/DashboardStudent/layout-student.css";
import SidebarStudent from "../components/dashboard-student/SidebarStudent.jsx";
import StudentHomeView from "../components/dashboard-student/views/StudentHomeView.jsx";
import StudentCoursesView from "../components/dashboard-student/views/StudentCoursesView.jsx";
import StudentMyCoursesView from "../components/dashboard-student/views/StudentMyCoursesView.jsx";
import StudentProfileView from "../components/dashboard-student/views/StudentProfileView.jsx";

const DashboardStudent = () => {
  const [vistaActiva, setVistaActiva] = useState("inicio");

  const renderVista = () => {
    switch (vistaActiva) {
      case "cursos":
        return <StudentCoursesView />;
      case "mis-cursos":
        return <StudentMyCoursesView />;
      case "perfil":
        return <StudentProfileView />;
      default:
        return <StudentHomeView />;
    }
  };

  return (
    <div className="student-dashboard">
      <SidebarStudent vistaActiva={vistaActiva} setVista={setVistaActiva} />
      <main className="student-dashboard-main">{renderVista()}</main>
    </div>
  );
};

export default DashboardStudent;