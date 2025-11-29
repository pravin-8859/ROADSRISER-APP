// src/components/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaWrench, FaChartLine, FaFileExport, FaSignOutAlt } from "react-icons/fa";

/**
 * Simple Admin layout (header + sidebar + content area)
 * Put this at src/components/AdminLayout.jsx and import in App.jsx
 *
 * This layout does NOT depend on Tailwind plugin specifics beyond classes used in your project.
 * Adjust classNames to fit your CSS/Tailwind config.
 */

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear admin session keys (adjust to your app)
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 hidden md:block">
        <div className="mb-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/admin")}>
          <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">R</div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-100">RoadsRiser Admin</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Control Panel</div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaTachometerAlt /> <span className="ml-2">Dashboard</span>
          </Link>

          <Link to="/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaUsers /> <span className="ml-2">Users</span>
          </Link>

          <Link to="/mechanics" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaWrench /> <span className="ml-2">Mechanics</span>
          </Link>

          <Link to="/admin/requests" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaFileExport /> <span className="ml-2">Requests</span>
          </Link>

          <Link to="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaChartLine /> <span className="ml-2">Analytics</span>
          </Link>

          <div className="mt-4 border-t pt-3">
            <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
              <FaSignOutAlt /> <span className="ml-2">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MOBILE SIDEBAR TOPBAR */}
      <div className="md:hidden w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">R</div>
          <div className="font-semibold text-gray-800 dark:text-gray-100">RoadsRiser Admin</div>
        </div>
        <div>
          <button onClick={() => window.location.reload()} className="px-3 py-1 rounded border">Refresh</button>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
