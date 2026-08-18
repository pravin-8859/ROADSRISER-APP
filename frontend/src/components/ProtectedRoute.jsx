import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "mechanic") {
    return <Navigate to="/auth/mechanic/login" replace />;
  }

  return children;
}
//export default ProtectedRoute;