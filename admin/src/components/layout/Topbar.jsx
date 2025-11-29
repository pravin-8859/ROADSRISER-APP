// src/components/layout/Topbar.jsx
import React from "react";
import { FaBell, FaBars, FaSignOutAlt } from "react-icons/fa";

export default function Topbar({ openSidebar }) {

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-full bg-gray-800 px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-30">

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-white text-xl mr-3"
        onClick={openSidebar}
      >
        <FaBars />
      </button>

      <h2 className="text-lg font-semibold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <FaBell className="text-gray-300 text-xl" />
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-2 rounded-lg flex items-center gap-2 text-white text-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </div>
  );
}
