// src/routes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage";
import RegisterPage from "./pages/RegisterPage"

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< MainPage />} />
        <Route path="/register" element={<RegisterPage />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
