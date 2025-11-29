import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async ()=>{
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {!stats ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Users</div>
            <div className="text-2xl font-semibold">{stats.users}</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Mechanics</div>
            <div className="text-2xl font-semibold">{stats.mechanics}</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Active Requests</div>
            <div className="text-2xl font-semibold">{stats.activeRequests}</div>
          </div>
        </div>
      )}
    </div>
  );
}
