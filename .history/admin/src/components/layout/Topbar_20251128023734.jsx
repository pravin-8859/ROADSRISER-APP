import React from "react";
import { FiBell, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      
      <div className="text-lg font-semibold">
        Admin Panel
      </div>

      <div className="flex items-center gap-4">
        <FiBell className="text-xl cursor-pointer" />

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <FiLogOut /> Logout
        </button>
      </div>

    </div>
  );
}
