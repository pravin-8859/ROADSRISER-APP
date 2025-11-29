import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/mechanics", label: "Mechanics" },
    { to: "/admin/requests", label: "Requests" },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/admin"}
            className={({ isActive }) =>
              `slink ${isActive ? "slink-active" : ""}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
