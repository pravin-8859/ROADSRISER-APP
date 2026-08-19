import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import UsersPage from "./pages/UsersPage";
import MechanicsPage from "./pages/MechanicsPage";
import RequestsPage from "./pages/RequestsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

      {/* LOGIN */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* PROTECTED ADMIN PANEL */}
      <Route
        path="/admin"
        element={<ProtectedRoute />}
      >
        <Route
          element={<AdminLayout />}
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<UsersPage />}
          />

          <Route
            path="mechanics"
            element={<MechanicsPage />}
          />

          <Route
            path="requests"
            element={<RequestsPage />}
          />

          <Route
            path="analytics"
            element={<AdminAnalytics />}
          />

          <Route
            path="reports"
            element={<ReportsPage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold">
                404
              </h1>

              <p className="text-gray-400 mt-3">
                Page not found
              </p>

              <a
                href="/admin"
                className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}