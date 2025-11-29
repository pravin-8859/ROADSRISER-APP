import React from "react";
import { NavLink } from "react-router-dom";

function linkClass(isActive) {
  return `block px-3 py-2 rounded ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`;
}

export default function Sidebar() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded p-3 shadow">
      <div className="mb-4">
        <div className="text-sm text-gray-500">Admin Panel</div>
        <div className="font-bold text-lg">RoadsRiser</div>
      </div>

      <nav className="space-y-1">
        <NavLink to="/" className={({isActive}) => linkClass(isActive)}>Dashboard</NavLink>
        <NavLink to="/users" className={({isActive}) => linkClass(isActive)}>Users</NavLink>
        <NavLink to="/mechanics" className={({isActive}) => linkClass(isActive)}>Mechanics</NavLink>
        <NavLink to="/requests" className={({isActive}) => linkClass(isActive)}>Requests</NavLink>
      </nav>
    </div>
  );
}
