import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/UsersList";
import MechanicsList from "./pages/MechanicsList";
import Requests from "./pages/Requests";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersList/></ProtectedRoute>} />
      <Route path="/mechanics" element={<ProtectedRoute><MechanicsList/></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
