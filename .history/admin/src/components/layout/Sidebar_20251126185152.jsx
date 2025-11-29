import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Mechanics", path: "/mechanics" },
    { name: "Requests", path: "/requests" },
    { name: "Analytics", path: "/analytics" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r dark:bg-gray-900 dark:border-gray-700 h-screen fixed top-0 left-0">
      <h1 className="text-2xl font-bold p-5">RoadsRiser Admin</h1>

      <nav className="mt-4">
        {menu.map((m) => (
          <NavLink
            key={m.name}
            to={m.path}
            className={({ isActive }) =>
              `block px-6 py-3 text-sm ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300"
              }`
            }
          >
            {m.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
