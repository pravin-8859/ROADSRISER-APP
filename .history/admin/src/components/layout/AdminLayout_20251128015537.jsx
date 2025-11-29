import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

/**
 * AdminLayout: topbar + sidebar + content (Outlet)
 */
export default function AdminLayout() {
  return (
    <div className="admin-root">
      <Topbar />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
