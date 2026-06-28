// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ToastMessage from "./components/ToastMessage";

// Páginas
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardStudent from "./pages/DashboardStudent.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";

const App = () => {
  return (
    <Router>
      <ToastProvider>
        {/* Componente flotante global */}
        <ToastMessage />
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route path="/student" element={<DashboardStudent />} />
          <Route path="/admin" element={<DashboardAdmin />} />

          {/* Ruta por defecto: redirige a Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </ToastProvider>

    </Router>
  );
};

export default App;