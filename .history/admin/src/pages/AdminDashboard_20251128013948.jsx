import { useEffect, useState } from "react";
import api from "../services/api";
import LineChart from "../components/LineChart";
import BarChart from "../components/charts/BarChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    mechanics: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/overview");
      setStats(res.data.stats);
      setRecentRequests(res.data.recentRequests);
      setLoading(false);
    } catch (e) {
      console.log("Dashboard error:", e);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="ml-64 mt-20 p-6">

      {/* -------- TOP STATS -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.users}
          color="bg-blue-600"
        />

        <StatCard
          title="Total Mechanics"
          value={stats.mechanics}
          color="bg-green-600"
        />

        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          color="bg-indigo-600"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          color="bg-red-600"
        />

      </div>

      {/* -------- CHARTS -------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Daily Requests</h2>
          <LineChart />
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <BarChart />
        </div>

      </div>

      {/* -------- RECENT REQUESTS TABLE -------- */}
      <div className="bg-white dark:bg-gray-900 p-6 mt-8 rounded-lg shadow border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="p-2">Customer</th>
              <th className="p-2">Issue</th>
              <th className="p-2">Location</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Time</th>
            </tr>
          </thead>

          <tbody>
            {recentRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No recent requests found.
                </td>
              </tr>
            )}

            {recentRequests.map((r) => (
              <tr key={r._id} className="border-b dark:border-gray-800">
                <td className="p-2">{r.userName}</td>
                <td className="p-2">{r.issue}</td>
                <td className="p-2">{r.location}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2 text-right">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ---- Reusable Stat Card Component ---- */
function StatCard({ title, value, color }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-lg shadow hover:scale-105 transition`}
    >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
