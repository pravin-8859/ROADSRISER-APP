// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaTools,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaTimes
} from "react-icons/fa";

export default function Sidebar({ closeSidebar }) {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Mechanics", icon: <FaTools />, path: "/admin/mechanics" },
    { name: "Requests", icon: <FaFileAlt />, path: "/admin/requests" },
    { name: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
    { name: "Reports", icon: <FaFileAlt />, path: "/admin/reports" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="h-full w-64 bg-gray-800 p-4">

      {/* MOBILE CLOSE BUTTON */}
      <div className="flex justify-end md:hidden mb-4">
        <button className="text-white text-xl" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>

      <h1 className="text-xl font-bold mb-6 text-white">RoadsRiser Admin</h1>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                pathname === item.path
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
