import React, { useEffect, useMemo, useState } from "react";
import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { getDashboardStats } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getDashboardStats();

      setStats(data?.stats || {});
    } catch (err) {
      console.error(
        "Analytics loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // =====================================================
  // REAL DATA
  // =====================================================

  const totalRequests =
    stats?.totalRequests || 0;

  const pending =
    stats?.pendingRequests || 0;

  const accepted =
    stats?.acceptedRequests || 0;

  const enroute =
    stats?.enrouteRequests || 0;

  const completed =
    stats?.completedRequests || 0;

  const cancelled =
    stats?.cancelledRequests || 0;

  const totalMechanics =
    stats?.totalMechanics || 0;

  const onlineMechanics =
    stats?.onlineMechanics || 0;

  const offlineMechanics =
    Math.max(
      totalMechanics - onlineMechanics,
      0
    );

  const totalUsers =
    stats?.totalUsers || 0;

  // =====================================================
  // RATES
  // =====================================================

  const completionRate =
    totalRequests > 0
      ? (
          (completed / totalRequests) *
          100
        ).toFixed(1)
      : "0.0";

  const cancellationRate =
    totalRequests > 0
      ? (
          (cancelled / totalRequests) *
          100
        ).toFixed(1)
      : "0.0";

  const activeRequests =
    pending + accepted + enroute;

  const mechanicAvailability =
    totalMechanics > 0
      ? (
          (onlineMechanics /
            totalMechanics) *
          100
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // REQUEST STATUS CHART
  // =====================================================

  const requestStatusData = useMemo(
    () => ({
      labels: [
        "Pending",
        "Accepted",
        "Enroute",
        "Completed",
        "Cancelled",
      ],

      datasets: [
        {
          data: [
            pending,
            accepted,
            enroute,
            completed,
            cancelled,
          ],

          backgroundColor: [
            "#f59e0b",
            "#6366f1",
            "#3b82f6",
            "#22c55e",
            "#ef4444",
          ],

          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    [
      pending,
      accepted,
      enroute,
      completed,
      cancelled,
    ]
  );

  // =====================================================
  // MECHANIC STATUS CHART
  // =====================================================

  const mechanicStatusData = useMemo(
    () => ({
      labels: [
        "Online",
        "Offline",
      ],

      datasets: [
        {
          data: [
            onlineMechanics,
            offlineMechanics,
          ],

          backgroundColor: [
            "#22c55e",
            "#6b7280",
          ],

          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    [
      onlineMechanics,
      offlineMechanics,
    ]
  );

  // =====================================================
  // REQUEST STATUS BAR
  // =====================================================

  const requestBarData = useMemo(
    () => ({
      labels: [
        "Pending",
        "Accepted",
        "Enroute",
        "Completed",
        "Cancelled",
      ],

      datasets: [
        {
          label: "Requests",

          data: [
            pending,
            accepted,
            enroute,
            completed,
            cancelled,
          ],

          backgroundColor: [
            "#f59e0b",
            "#6366f1",
            "#3b82f6",
            "#22c55e",
            "#ef4444",
          ],

          borderRadius: 8,
          maxBarThickness: 55,
        },
      ],
    }),
    [
      pending,
      accepted,
      enroute,
      completed,
      cancelled,
    ]
  );

  // =====================================================
  // CHART OPTIONS
  // =====================================================

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#9ca3af",
          padding: 18,
          usePointStyle: true,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#9ca3af",
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color:
            "rgba(255,255,255,0.05)",
        },

        ticks: {
          color: "#9ca3af",
          precision: 0,
        },
      },
    },
  };

  // =====================================================
  // CSV EXPORT
  // =====================================================

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],

      ["Total Users", totalUsers],

      [
        "Total Mechanics",
        totalMechanics,
      ],

      [
        "Online Mechanics",
        onlineMechanics,
      ],

      [
        "Total Requests",
        totalRequests,
      ],

      ["Pending", pending],

      ["Accepted", accepted],

      ["Enroute", enroute],

      ["Completed", completed],

      ["Cancelled", cancelled],

      [
        "Completion Rate",
        `${completionRate}%`,
      ],

      [
        "Cancellation Rate",
        `${cancellationRate}%`,
      ],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "roadsriser-analytics.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />

          <p className="text-gray-400 mt-4 text-sm">
            Loading analytics...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-8 text-center">

        <div className="text-red-400 text-3xl mb-3">
          !
        </div>

        <h2 className="text-white font-semibold">
          Unable to load analytics
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>

        <button
          onClick={() => loadAnalytics()}
          className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <p className="text-sm text-indigo-400 font-medium">
            Platform Insights
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Analytics
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Real-time overview based on your RoadsRiser data.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium transition"
          >
            Export CSV
          </button>

          <button
            onClick={() =>
              loadAnalytics(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium transition"
          >
            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </section>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <MetricCard
          title="Total Requests"
          value={totalRequests}
          icon="🚗"
        />

        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon="✅"
        />

        <MetricCard
          title="Active Requests"
          value={activeRequests}
          icon="⚡"
        />

        <MetricCard
          title="Cancellation Rate"
          value={`${cancellationRate}%`}
          icon="✕"
        />

      </section>

      {/* =================================================
          PLATFORM HEALTH
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <HealthCard
          title="Users"
          value={totalUsers}
          description="Registered users"
          icon="👥"
        />

        <HealthCard
          title="Mechanics"
          value={totalMechanics}
          description={`${onlineMechanics} currently online`}
          icon="🔧"
        />

        <HealthCard
          title="Availability"
          value={`${mechanicAvailability}%`}
          description="Mechanics online"
          icon="🟢"
        />

      </section>

      {/* =================================================
          REQUEST STATUS
      ================================================= */}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-white">
              Request Distribution
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Current requests grouped by status.
            </p>

          </div>

          <div className="h-[330px]">

            <Bar
              data={requestBarData}
              options={barOptions}
            />

          </div>

        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-white">
              Request Status
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Overall request breakdown.
            </p>

          </div>

          <div className="h-[300px]">

            <Doughnut
              data={requestStatusData}
              options={doughnutOptions}
            />

          </div>

        </div>

      </section>

      {/* =================================================
          MECHANIC ANALYTICS
      ================================================= */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-white">
              Mechanic Availability
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Current online and offline mechanics.
            </p>

          </div>

          <div className="h-[300px]">

            <Doughnut
              data={mechanicStatusData}
              options={doughnutOptions}
            />

          </div>

        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-white">
              Request Health
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Important operational metrics.
            </p>

          </div>

          <div className="space-y-4">

            <ProgressRow
              label="Completed"
              value={completed}
              total={totalRequests}
              color="bg-green-500"
            />

            <ProgressRow
              label="Pending"
              value={pending}
              total={totalRequests}
              color="bg-yellow-500"
            />

            <ProgressRow
              label="Accepted"
              value={accepted}
              total={totalRequests}
              color="bg-indigo-500"
            />

            <ProgressRow
              label="Enroute"
              value={enroute}
              total={totalRequests}
              color="bg-blue-500"
            />

            <ProgressRow
              label="Cancelled"
              value={cancelled}
              total={totalRequests}
              color="bg-red-500"
            />

          </div>

        </div>

      </section>

      {/* =================================================
          NOTE
      ================================================= */}

      <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4">

        <p className="text-xs text-gray-400">
          <span className="text-indigo-400 font-medium">
            Analytics note:
          </span>{" "}
          Current charts are based on the real aggregate
          statistics available from the admin dashboard API.
          Historical daily trends, average response time and
          per-mechanic performance will require dedicated
          analytics endpoints.
        </p>

      </div>

    </div>
  );
}

// =====================================================
// METRIC CARD
// =====================================================

function MetricCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// HEALTH CARD
// =====================================================

function HealthCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
          {icon}
        </div>

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-white">
            {value}
          </p>

        </div>

      </div>

      <p className="text-xs text-gray-500 mt-3">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// PROGRESS ROW
// =====================================================

function ProgressRow({
  label,
  value,
  total,
  color,
}) {
  const percentage =
    total > 0
      ? Math.min(
          100,
          (value / total) * 100
        )
      : 0;

  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <span className="text-sm text-gray-400">
          {label}
        </span>

        <span className="text-xs text-gray-500">
          {value}{" "}
          ({percentage.toFixed(1)}%)
        </span>

      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">

        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}