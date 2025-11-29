import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { FaBars, FaUsers, FaTools, FaHome, FaSignOutAlt, FaClipboardList } from "react-icons/fa";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ------------------------- */}
      {/* SIDEBAR (Desktop + Mobile) */}
      {/* ------------------------- */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50 
          w-64 p-5 transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-bold mb-8 text-indigo-600">RoadsRiser Admin</h2>

        <nav className="space-y-3">

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <FaHome /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <FaUsers /> Users
          </NavLink>

          <NavLink
            to="/admin/mechanics"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <FaTools /> Mechanics
          </NavLink>

          <NavLink
            to="/admin/requests"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <FaClipboardList /> Requests
          </NavLink>

        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full flex items-center gap-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* ------------------------- */}
      {/* TOP NAVBAR */}
      {/* ------------------------- */}
      <header className="w-full md:ml-64 bg-white shadow p-4 flex items-center justify-between fixed top-0 left-0 z-40">
        <button
          className="md:hidden p-2 bg-indigo-600 text-white rounded-lg"
          onClick={() => setOpen(!open)}
        >
          <FaBars size={20} />
        </button>

        <h1 className="text-lg font-semibold">Admin Dashboard</h1>

        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Admin</span>
        </div>
      </header>

      {/* ------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------- */}
      <main className="flex-1 md:ml-64 mt-20 p-6">
        <Outlet />
      </main>
    </div>
  );
}
