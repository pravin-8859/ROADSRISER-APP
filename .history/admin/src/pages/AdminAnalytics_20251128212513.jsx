// src/pages/AdminAnalytics.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/*
 AdminAnalytics.jsx
 - self-contained admin analytics UI
 - Replace dummy fetch functions with real API calls when ready
*/

function formatNumber(n) {
  return n?.toLocaleString?.() ?? n;
}

// Dummy data generator (replace with API calls)
function generateDummySeries(days = 14) {
  const series = [];
  const types = ["Towing", "Flat Tyre", "Battery", "Key Unlock", "Fuel Delivery"];
  const mechanics = ["Rakesh", "FastFix", "Sharma", "Arjun", "Nitin"];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString();
    const count = Math.floor(20 + Math.random() * 80);
    const avgResponse = +(5 + Math.random() * 20).toFixed(1); // minutes
    const breakdown = types.reduce((acc, t) => {
      acc[t] = Math.floor(Math.random() * 10);
      return acc;
    }, {});
    series.push({
      date: label,
      count,
      avgResponse,
      breakdown,
      mechanics: mechanics.map((m) => ({ name: m, jobs: Math.floor(Math.random() * 10) })),
    });
  }
  return series;
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [rangeDays, setRangeDays] = useState(14);

  // Simulate fetch
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setSeries(generateDummySeries(rangeDays));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [rangeDays]);

  // COMPUTED METRICS
  const totals = useMemo(() => {
    const totalRequests = series.reduce((s, d) => s + (d.count || 0), 0);
    const avgResponse =
      series.length > 0
        ? (series.reduce((s, d) => s + (d.avgResponse || 0), 0) / series.length).toFixed(1)
        : 0;
    const completed = Math.floor(totalRequests * (0.65 + Math.random() * 0.25));
    const active = Math.max(0, totalRequests - completed);
    return { totalRequests, completed, active, avgResponse };
  }, [series]);

  // Requests over time (line)
  const lineData = useMemo(() => {
    return {
      labels: series.map((s) => s.date),
      datasets: [
        {
          label: "Requests",
          data: series.map((s) => s.count),
          tension: 0.25,
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(99,102,241,0.08)",
          borderColor: "rgba(99,102,241,1)",
          pointRadius: 3,
        },
      ],
    };
  }, [series]);

  // Mechanics performance (aggregate)
  const mechanicsPerformance = useMemo(() => {
    const map = {};
    series.forEach((d) => {
      (d.mechanics || []).forEach((m) => {
        map[m.name] = (map[m.name] || 0) + m.jobs;
      });
    });
    const names = Object.keys(map);
    return { labels: names, data: names.map((n) => map[n]) };
  }, [series]);

  const barData = {
    labels: mechanicsPerformance.labels,
    datasets: [
      {
        label: "Jobs completed",
        data: mechanicsPerformance.data,
        backgroundColor: mechanicsPerformance.labels.map((_, i) => `rgba(${50 + i * 30},120,200,0.85)`),
      },
    ],
  };

  // Request type distribution (pie)
  const pieData = useMemo(() => {
    const agg = {};
    series.forEach((d) => {
      Object.entries(d.breakdown || {}).forEach(([k, v]) => {
        agg[k] = (agg[k] || 0) + v;
      });
    });
    const labels = Object.keys(agg);
    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => agg[l]),
          backgroundColor: labels.map((_, i) => `hsl(${(i * 70) % 360} 70% 55% / 0.9)`),
        },
      ],
    };
  }, [series]);

  // CSV export for time-series
  function downloadCSV() {
    const rows = [["date", "requests", "avg_response_minutes"]];
    series.forEach((d) => rows.push([d.date, d.count, d.avgResponse]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests_series_${rangeDays}d.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="p-6 text-gray-300">Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-gray-400">Overview of requests, mechanics & trends</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>

          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
          >
            Export CSV
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400">Total Requests</div>
          <div className="text-2xl font-semibold mt-1">{formatNumber(totals.totalRequests)}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400">Active</div>
          <div className="text-2xl font-semibold mt-1">{formatNumber(totals.active)}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400">Completed</div>
          <div className="text-2xl font-semibold mt-1">{formatNumber(totals.completed)}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <div className="text-xs text-gray-400">Avg Response (min)</div>
          <div className="text-2xl font-semibold mt-1">{totals.avgResponse}</div>
        </div>
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm text-gray-300 mb-2">Requests — last {rangeDays} days</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm text-gray-300 mb-2">Request Types</h3>
          <div className="h-52">
            <Pie data={pieData} options={{ plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 lg:col-span-2">
          <h3 className="text-sm text-gray-300 mb-2">Mechanics Performance</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm text-gray-300 mb-2">Top Mechanics</h3>
          <ul className="space-y-2">
            {mechanicsPerformance.labels.length === 0 ? (
              <li className="text-gray-400">No data</li>
            ) : (
              mechanicsPerformance.labels.map((name, i) => (
                <li key={name} className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-medium">{mechanicsPerformance.data[i]}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <footer className="text-xs text-gray-500">Tip: Replace dummy generator with your analytics endpoints for real insights.</footer>
    </div>
  );
}
