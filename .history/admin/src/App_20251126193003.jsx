import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./pages/UsersPage";
import MechanicsPage from "./pages/MechanicsPage";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes wrapped in layout */}
      <Route path="/admin" element={
        <ProtectedRoute>
  
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        {/* more nested routes later: users, mechanics, requests */}
      </Route>
      <Route path="/users" element={<UsersPage/>} />
      <Route path="/mechanics" element={<MechanicsPage />} />

      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  );
}
