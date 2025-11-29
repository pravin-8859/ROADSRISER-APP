import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FiHome, FiUsers, FiTool, FiPieChart,
  FiList, FiFileText, FiSettings
} from "react-icons/fi";

export default function Sidebar() {

  const menu = [
    { title: "Dashboard", icon: <FiHome />, path: "/admin" },
    { title: "Users", icon: <FiUsers />, path: "/admin/users" },
    { title: "Mechanics", icon: <FiTool />, path: "/admin/mechanics" },
    { title: "Requests", icon: <FiList />, path: "/admin/requests" },
    { title: "Analytics", icon: <FiPieChart />, path: "/admin/analytics" },
    { title: "Reports", icon: <FiFileText />, path: "/admin/reports" },
    { title: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">

      <div className="px-6 py-4 text-2xl font-bold border-b border-gray-700">
        RoadsRiser Admin
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((m, i) => (
          <NavLink
            key={i}
            to={m.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition 
              ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"}`
            }
          >
            {m.icon}
            {m.title}
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
