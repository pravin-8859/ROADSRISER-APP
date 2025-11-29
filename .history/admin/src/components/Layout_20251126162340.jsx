import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Topbar />
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10">{children}</main>
      </div>
    </div>
  );
}
