// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute wrapper
 * Checks for admin auth in localStorage.
 * Expects either:
 *   localStorage.getItem('adminToken') OR
 *   localStorage.getItem('role') === 'admin'
 *
 * If not found, redirects to /admin/login
 *
 * Usage:
 * <Route path="/admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>} >
 *   <Route index element={<AdminDashboard/>}/>
 * </Route>
 *
 * or with nested <Outlet />: Route element={<ProtectedRoute/>} and nested routes use Outlet.
 */

export default function ProtectedRoute({ children, requireRole = "admin" }) {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = Boolean(token) && (role === "admin" || token?.startsWith?.("admin") || localStorage.getItem("isAdmin") === "true");

  if (!isAdmin) {
    // not authenticated - send to admin login
    return <Navigate to="/admin/login" replace />;
  }

  // if children provided, render them; otherwise use Outlet for nested routes
  return children ? children : <Outlet />;
}
