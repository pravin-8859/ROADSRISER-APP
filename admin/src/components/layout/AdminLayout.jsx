// src/components/layout/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [open, setOpen] = useState(false); // Sidebar toggle for mobile

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">

      {/* SIDEBAR for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* SIDEBAR DRAWER for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)}></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform md:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* Topbar (contains mobile menu button) */}
        <Topbar openSidebar={() => setOpen(true)} />

        {/* Content Page */}
        <div className="p-6 mt-3 md:mt-0">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
