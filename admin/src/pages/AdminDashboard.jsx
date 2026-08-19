import React, { useEffect, useState } from "react";
import {
  Bar,
  Line,
  Doughnut,
} from "react-chartjs-2";

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
  Filler,
} from "chart.js";

import { getDashboardStats } from "../services/api";

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      setStats(data?.stats || {});
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />

          <p className="text-gray-400 mt-4">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
        <p className="text-red-400 font-medium">
          {error}
        </p>

        <button
          onClick={loadDashboard}
          className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalUsers =
    stats?.totalUsers || 0;

  const totalMechanics =
    stats?.totalMechanics || 0;

  const onlineMechanics =
    stats?.onlineMechanics || 0;

  const totalRequests =
    stats?.totalRequests || 0;

  const pendingRequests =
    stats?.pendingRequests || 0;

  const acceptedRequests =
    stats?.acceptedRequests || 0;

  const enrouteRequests =
    stats?.enrouteRequests || 0;

  const completedRequests =
    stats?.completedRequests || 0;

  const cancelledRequests =
    stats?.cancelledRequests || 0;

  const offlineMechanics =
    Math.max(
      totalMechanics - onlineMechanics,
      0
    );

  // =====================================================
  // REAL REQUEST STATUS DATA
  // =====================================================

  const requestStatusData = {
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
          pendingRequests,
          acceptedRequests,
          enrouteRequests,
          completedRequests,
          cancelledRequests,
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
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#9ca3af",
          padding: 16,
          usePointStyle: true,
        },
      },
    },
  };

  // =====================================================
  // MECHANIC STATUS
  // =====================================================

  const mechanicStatusData = {
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
  };

  // =====================================================
  // STATS
  // =====================================================

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "indigo",
    },

    {
      title: "Total Mechanics",
      value: totalMechanics,
      icon: "🔧",
      color: "blue",
    },

    {
      title: "Online Mechanics",
      value: onlineMechanics,
      icon: "🟢",
      color: "green",
    },

    {
      title: "Total Requests",
      value: totalRequests,
      icon: "🚗",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-sm text-indigo-400 font-medium">
            Admin Overview
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Dashboard
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Live overview of your RoadsRiser platform.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="w-fit px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          ↻ Refresh
        </button>

      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {card.value.toLocaleString()}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                {card.icon}
              </div>

            </div>

          </div>
        ))}

      </section>

      {/* =================================================
          SECONDARY STATS
      ================================================= */}

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">

        <MiniStat
          title="Pending"
          value={pendingRequests}
          icon="⏳"
        />

        <MiniStat
          title="Accepted"
          value={acceptedRequests}
          icon="✓"
        />

        <MiniStat
          title="Enroute"
          value={enrouteRequests}
          icon="🚗"
        />

        <MiniStat
          title="Completed"
          value={completedRequests}
          icon="✅"
        />

        <MiniStat
          title="Cancelled"
          value={cancelledRequests}
          icon="✕"
        />

      </section>

      {/* =================================================
          CHARTS
      ================================================= */}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* REQUEST STATUS */}

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Request Status
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Current request distribution
            </p>
          </div>

          <div className="h-[320px]">
            <Doughnut
              data={requestStatusData}
              options={doughnutOptions}
            />
          </div>

        </div>

        {/* MECHANICS */}

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Mechanic Availability
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Current online/offline mechanics
            </p>
          </div>

          <div className="h-[320px]">
            <Doughnut
              data={mechanicStatusData}
              options={doughnutOptions}
            />
          </div>

        </div>

      </section>

      {/* =================================================
          PLATFORM SUMMARY
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

        <h2 className="text-lg font-semibold text-white">
          Platform Summary
        </h2>

        <p className="text-xs text-gray-500 mt-1 mb-5">
          Current RoadsRiser platform statistics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <SummaryCard
            title="Resolution Rate"
            value={
              totalRequests > 0
                ? `${Math.round(
                    (completedRequests /
                      totalRequests) *
                      100
                  )}%`
                : "0%"
            }
            description="Requests completed"
          />

          <SummaryCard
            title="Mechanic Availability"
            value={
              totalMechanics > 0
                ? `${Math.round(
                    (onlineMechanics /
                      totalMechanics) *
                      100
                  )}%`
                : "0%"
            }
            description="Mechanics currently online"
          />

          <SummaryCard
            title="Active Requests"
            value={
              pendingRequests +
              acceptedRequests +
              enrouteRequests
            }
            description="Currently in progress"
          />

        </div>

      </section>

    </div>
  );
}

// =====================================================
// MINI STAT
// =====================================================

function MiniStat({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <span>{icon}</span>

        <span className="text-xs text-gray-400">
          {title}
        </span>
      </div>

      <p className="text-xl font-bold text-white mt-2">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl bg-[#0b1220] border border-white/10 p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="text-3xl font-bold text-white mt-2">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {description}
      </p>

    </div>
  );
}