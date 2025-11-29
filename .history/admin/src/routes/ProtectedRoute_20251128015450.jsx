import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protect routes: checks localStorage 'admin_token'
 * If not present -> redirect to /admin/login
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("admin_token") || null;

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}
