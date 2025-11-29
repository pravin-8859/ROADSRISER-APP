import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="*" element={<AdminLogin/>} />
    </Routes>
  </BrowserRouter>
);
