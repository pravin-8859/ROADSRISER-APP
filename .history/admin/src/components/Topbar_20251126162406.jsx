import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();
  const email = localStorage.getItem("adminEmail") || "admin@roadsriser.local";

  const logout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminEmail");
    nav("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-semibold text-lg">RoadsRiser Admin</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 hidden md:block">{email}</div>
          <button onClick={() => nav("/")} className="px-3 py-1 border rounded">Dashboard</button>
          <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}
