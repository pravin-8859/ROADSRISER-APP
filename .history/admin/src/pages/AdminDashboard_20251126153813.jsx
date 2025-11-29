import React from "react";

export default function AdminDashboard(){
  const logout = ()=> { localStorage.removeItem("adminToken"); window.location.href="/admin/login"; }
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-4 bg-white rounded shadow">Total Users: —</div>
         <div className="p-4 bg-white rounded shadow">Total Mechanics: —</div>
         <div className="p-4 bg-white rounded shadow">Today Requests: —</div>
      </section>

      <section className="mt-6">
         <div className="bg-white p-4 rounded shadow">Requests table (fetch from /api/admin/requests)</div>
      </section>
    </div>
  );
}
