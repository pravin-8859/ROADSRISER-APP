import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r hidden md:block">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="text-lg font-bold">RoadsRiser Admin</div>
          <div className="text-xs text-gray-500">Control Panel</div>
        </div>

        <nav className="p-4 space-y-1 text-sm">
          <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
          <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Users</Link>
          <Link to="/admin/mechanics" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Mechanics</Link>
          <Link to="/admin/requests" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Requests</Link>
          <Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
        </nav>

        <div className="p-4 border-t absolute bottom-0 w-64 bg-white dark:bg-gray-800">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded bg-red-500 text-white">Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => window.alert('Use desktop for full UI')}>
              ☰
            </button>
            <div className="font-semibold">Admin Panel</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Signed in as Admin</span>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
