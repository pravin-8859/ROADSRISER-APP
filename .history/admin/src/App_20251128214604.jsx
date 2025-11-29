import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import MechanicsPage from "./pages/MechanicsPage";
import RequestsPage from "./pages/RequestsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

import { exportCSV, exportRequestsPDF } from "../utils/reportExporter";


export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/admin/login" />} />

      {/* PUBLIC LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* PROTECTED ADMIN PANEL */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mechanics" element={<MechanicsPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="analytics" element={<AdminAnalytics/>} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path=""
        
      </Route>
      

      <Route path="*" element={<div className="p-6">Page not found</div>} />

    </Routes>
  );
}
