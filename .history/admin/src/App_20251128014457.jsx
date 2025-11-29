import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import MechanicsPage from "./pages/MechanicsPage";
import RequestsPage from "./pages/RequestsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

export default function App() {
  return (
    <Routes>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Public Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Layout */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mechanics" element={<MechanicsPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />

      </Route>

      <Route path="*" element={<div className="p-6">Page not found</div>} />

    </Routes>
  );
}
