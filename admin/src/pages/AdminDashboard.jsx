import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  // Dummy stats (later API se aayenge)
  const stats = [
    { title: "Total Users", value: "1,245", change: "+12%", color: "bg-indigo-600" },
    { title: "Mechanics Active", value: "89", change: "+5%", color: "bg-green-600" },
    { title: "Today's Requests", value: "312", change: "+22%", color: "bg-yellow-600" },
    { title: "Resolved Today", value: "289", change: "+18%", color: "bg-blue-600" },
  ];

  // Chart example data
  const requestTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Requests",
        data: [45, 60, 75, 90, 120, 150, 170],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const mechanicStatus = {
    labels: ["Active", "Busy", "Offline"],
    datasets: [
      {
        data: [89, 43, 22],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const monthlyEarnings = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Earnings",
        data: [12000, 15000, 18000, 24000, 22000, 27000],
        backgroundColor: "#4ade80",
      },
    ],
  };

  return (
    <div className="space-y-8">

      {/* TOP CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-xl border border-gray-700 bg-gray-800 flex flex-col`}
          >
            <div className="text-gray-300 text-sm">{s.title}</div>
            <div className="text-3xl font-bold mt-2">{s.value}</div>
            <div className="mt-3 text-xs px-3 py-1 rounded-full bg-gray-900 w-fit">
              <span className="text-green-400">{s.change}</span> this week
            </div>
          </div>
        ))}
      </section>

      {/* TWO MAIN CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Line Chart */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl">
          <div className="text-lg font-semibold mb-3">Requests This Week</div>
          <Line data={requestTrend} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl">
          <div className="text-lg font-semibold mb-3">Mechanic Status</div>
          <Doughnut data={mechanicStatus} />
        </div>

      </section>

      {/* LOWER CHART */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl">
          <div className="text-lg font-semibold mb-3">Monthly Earnings</div>
          <Bar data={monthlyEarnings} />
        </div>

        {/* Activity Logs */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
          <div className="text-lg font-semibold mb-3">Recent Activity</div>

          <ul className="space-y-3 text-sm">
            <li className="border-b border-gray-700 pb-2">✔️ New mechanic registered</li>
            <li className="border-b border-gray-700 pb-2">🛠️ Request #102 assigned</li>
            <li className="border-b border-gray-700 pb-2">🚨 SOS case resolved</li>
            <li className="border-b border-gray-700 pb-2">💳 Payment received: ₹1200</li>
          </ul>
        </div>

      </section>
    </div>
  );
}
