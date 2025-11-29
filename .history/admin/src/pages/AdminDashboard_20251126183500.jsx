import React, { useEffect, useState } from "react";
import Layout from "../components/AdminLayout";
import api from "../services/api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, mechanics: 0, activeRequests: 0, revenue: 0 });
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/stats"); // backend: GET /api/admin/stats
      setStats(res.data);
      setSales(res.data.sales || []);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: sales.map(s=>s.date),
    datasets: [{ label: "Revenue", data: sales.map(s=>s.value), fill:false, borderColor: "#4f46e5" }]
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded p-4 shadow">Users<br/><div className="text-2xl font-semibold">{stats.users}</div></div>
          <div className="bg-white rounded p-4 shadow">Mechanics<br/><div className="text-2xl font-semibold">{stats.mechanics}</div></div>
          <div className="bg-white rounded p-4 shadow">Active Requests<br/><div className="text-2xl font-semibold">{stats.activeRequests}</div></div>
          <div className="bg-white rounded p-4 shadow">Revenue<br/><div className="text-2xl font-semibold">₹{stats.revenue}</div></div>
        </div>

        <div className="bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-2">Revenue (Last days)</h3>
          <Line data={chartData} />
        </div>
      </div>
    </Layout>
  );
}
