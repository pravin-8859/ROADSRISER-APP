// src/pages/DashboardAdmin.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiTool,
  FiFileText,
  FiLogOut,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";

import {
  getAdminStats,
  getUsers,
  getMechanics,
  getRequests,
  getRequestById,
  adminToggleUser,
  adminToggleMechanic,
  adminAssignRequest,
} from "../api/adminApi";

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value ?? 0}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  let classes =
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";

  if (value === "pending") {
    classes =
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
  }

  if (value === "accepted") {
    classes =
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }

  if (value === "enroute") {
    classes =
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  }

  if (value === "completed") {
    classes =
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  }

  if (value === "cancelled") {
    classes =
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* =====================================================
   LOADING
===================================================== */

function LoadingBox() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-9 h-9 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY
===================================================== */

function EmptyState({ text }) {
  return (
    <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
      {text}
    </div>
  );
}

/* =====================================================
   DETAIL ROW
===================================================== */

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="col-span-2 text-sm font-medium break-words">
        {value || "N/A"}
      </span>
    </div>
  );
}

/* =====================================================
   REPORT BAR
===================================================== */

function ReportBar({ label, value, total }) {
  const percentage =
    total > 0
      ? Math.min(100, Math.round((value / total) * 100))
      : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span>{label}</span>

        <span className="font-medium">
          {value}
        </span>
      </div>

      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =====================================================
   MAIN DASHBOARD
===================================================== */

export default function DashboardAdmin() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({});

  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [requests, setRequests] = useState([]);

  const [tab, setTab] = useState("overview");

  const [query, setQuery] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  /* =====================================================
     AUTH CHECK
  ===================================================== */

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    const role =
      localStorage.getItem("role");

    if (!token || role !== "admin") {
      nav("/admin/login", {
        replace: true,
      });
    }
  }, [nav]);

  /* =====================================================
     LOAD ALL DATA
  ===================================================== */

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll(showLoader = true) {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [
        statsResponse,
        usersResponse,
        mechanicsResponse,
        requestsResponse,
      ] = await Promise.all([
        getAdminStats(),

        getUsers({
          limit: 200,
        }),

        getMechanics({
          limit: 200,
        }),

        getRequests({
          limit: 500,
        }),
      ]);

      setStats(
        statsResponse?.stats || {}
      );

      setUsers(
        Array.isArray(usersResponse?.users)
          ? usersResponse.users
          : []
      );

      setMechanics(
        Array.isArray(
          mechanicsResponse?.mechanics
        )
          ? mechanicsResponse.mechanics
          : []
      );

      setRequests(
        Array.isArray(
          requestsResponse?.requests
        )
          ? requestsResponse.requests
          : []
      );
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      if (
        error?.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "admin"
        );

        nav("/admin/login", {
          replace: true,
        });

        return;
      }

      alert(
        error?.response?.data?.message ||
          "Failed to load admin data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  async function logout() {
    try {
      await fetch(
        "http://localhost:5000/api/admin/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "admin"
      );

      nav("/admin/login", {
        replace: true,
      });
    }
  }

  /* =====================================================
     USER ACTION
  ===================================================== */

  async function toggleUser(
    id,
    action
  ) {
    const message =
      action === "delete"
        ? "Are you sure you want to delete this user?"
        : `Are you sure you want to ${action} this user?`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      await adminToggleUser(
        id,
        action
      );

      await loadAll(false);
    } catch (error) {
      console.error(
        "User action error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "User action failed."
      );
    }
  }

  /* =====================================================
     MECHANIC ACTION
  ===================================================== */

  async function toggleMechanic(
    id,
    action
  ) {
    if (
      !window.confirm(
        `Are you sure you want to ${action} this mechanic?`
      )
    ) {
      return;
    }

    try {
      await adminToggleMechanic(
        id,
        action
      );

      await loadAll(false);
    } catch (error) {
      console.error(
        "Mechanic action error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Mechanic action failed."
      );
    }
  }

  /* =====================================================
     ASSIGN REQUEST
  ===================================================== */

  async function assignRequest(
    requestId
  ) {
    const mechanicId =
      window.prompt(
        "Enter mechanic ID to assign this request:"
      );

    if (!mechanicId?.trim()) {
      return;
    }

    try {
      await adminAssignRequest(
        requestId,
        mechanicId.trim()
      );

      alert(
        "Request assigned successfully."
      );

      await loadAll(false);
    } catch (error) {
      console.error(
        "Assign request error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Request assignment failed."
      );
    }
  }

  /* =====================================================
     REQUEST DETAILS
  ===================================================== */

  async function openRequestDetails(
    id
  ) {
    try {
      setDetailsLoading(true);

      setSelectedRequest(null);

      const response =
        await getRequestById(id);

      setSelectedRequest(
        response?.request || null
      );
    } catch (error) {
      console.error(
        "Request details error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load request details."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  /* =====================================================
     SEARCH USERS
  ===================================================== */

  const filteredUsers =
    useMemo(() => {
      const q =
        query.trim().toLowerCase();

      if (!q) {
        return users;
      }

      return users.filter((user) =>
        [
          user?.name,
          user?.email,
          user?.phone,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(q)
          )
      );
    }, [users, query]);

  /* =====================================================
     SEARCH MECHANICS
  ===================================================== */

  const filteredMechanics =
    useMemo(() => {
      const q =
        query.trim().toLowerCase();

      if (!q) {
        return mechanics;
      }

      return mechanics.filter(
        (mechanic) =>
          [
            mechanic?.name,
            mechanic?.email,
            mechanic?.phone,
            mechanic?.garageName,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(q)
            )
      );
    }, [mechanics, query]);

  /* =====================================================
     SEARCH REQUESTS
  ===================================================== */

  const filteredRequests =
    useMemo(() => {
      const q =
        query.trim().toLowerCase();

      if (!q) {
        return requests;
      }

      return requests.filter(
        (request) =>
          [
            request?._id,
            request?.problem,
            request?.serviceType,
            request?.vehicleType,
            request?.address,
            request?.status,
            request?.user?.name,
            request?.user?.email,
            request?.mechanic?.name,
            request?.mechanic?.email,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(q)
            )
      );
    }, [requests, query]);

  /* =====================================================
     STATS
  ===================================================== */

  const totalUsers =
    stats?.totalUsers ?? 0;

  const totalMechanics =
    stats?.totalMechanics ?? 0;

  const onlineMechanics =
    stats?.onlineMechanics ?? 0;

  const totalRequests =
    stats?.totalRequests ?? 0;

  const pendingRequests =
    stats?.pendingRequests ?? 0;

  const acceptedRequests =
    stats?.acceptedRequests ?? 0;

  const enrouteRequests =
    stats?.enrouteRequests ?? 0;

  const completedRequests =
    stats?.completedRequests ?? 0;

  const cancelledRequests =
    stats?.cancelledRequests ?? 0;

  /* =====================================================
     LOADING SCREEN
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <LoadingBox />
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">
              RoadsRiser • Admin
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Admin Control Center
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* DESKTOP SEARCH */}

            <div className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
              <FiSearch className="text-gray-400" />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                placeholder="Search..."
                className="outline-none bg-transparent text-sm w-48"
              />
            </div>

            {/* REFRESH */}

            <button
              onClick={() =>
                loadAll(false)
              }
              disabled={refreshing}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Refresh"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm"
            >
              <FiLogOut />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* MOBILE SEARCH */}

        <div className="md:hidden mb-5">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
            <FiSearch className="text-gray-400" />

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search..."
              className="outline-none bg-transparent text-sm w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24">
              <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Management
              </p>

              <nav className="space-y-1">
                <button
                  onClick={() =>
                    setTab("overview")
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    tab === "overview"
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Overview
                </button>

                <button
                  onClick={() =>
                    setTab("users")
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    tab === "users"
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Users
                </button>

                <button
                  onClick={() =>
                    setTab("mechanics")
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    tab === "mechanics"
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Mechanics
                </button>

                <button
                  onClick={() =>
                    setTab("requests")
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    tab === "requests"
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Requests
                </button>

                <button
                  onClick={() =>
                    setTab("reports")
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    tab === "reports"
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Reports
                </button>
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 px-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live backend data
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN
          ================================================= */}

          <main className="lg:col-span-9 space-y-6">
            {/* =================================================
                OVERVIEW
            ================================================= */}

            {tab === "overview" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold">
                    Dashboard
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Monitor the RoadsRiser roadside assistance system.
                  </p>
                </div>

                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <StatCard
                    icon={<FiUsers />}
                    title="Total Users"
                    value={totalUsers}
                  />

                  <StatCard
                    icon={<FiTool />}
                    title="Total Mechanics"
                    value={totalMechanics}
                    subtitle={`${onlineMechanics} currently online`}
                  />

                  <StatCard
                    icon={<FiFileText />}
                    title="Total Requests"
                    value={totalRequests}
                  />

                  <StatCard
                    icon={<FiClock />}
                    title="Pending Requests"
                    value={pendingRequests}
                  />

                  <StatCard
                    icon={<FiActivity />}
                    title="Active Requests"
                    value={
                      acceptedRequests +
                      enrouteRequests
                    }
                  />

                  <StatCard
                    icon={<FiCheckCircle />}
                    title="Completed Requests"
                    value={completedRequests}
                  />

                  <StatCard
                    icon={<FiXCircle />}
                    title="Cancelled Requests"
                    value={cancelledRequests}
                  />
                </div>

                {/* REQUEST STATUS */}

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-semibold">
                        Request Status
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Current request distribution
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setTab("requests")
                      }
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      View Requests
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pending
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {pendingRequests}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Accepted
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {acceptedRequests}
                      </p>
                    </div>

                    <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enroute
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {enrouteRequests}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Completed
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {completedRequests}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS */}

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-4">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setTab("users")
                      }
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      <FiUsers className="text-indigo-600 mb-2" />

                      <p className="font-medium">
                        Manage Users
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        View and manage users
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setTab("mechanics")
                      }
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      <FiTool className="text-indigo-600 mb-2" />

                      <p className="font-medium">
                        Manage Mechanics
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        View registered mechanics
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setTab("requests")
                      }
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      <FiFileText className="text-indigo-600 mb-2" />

                      <p className="font-medium">
                        View Requests
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Monitor roadside requests
                      </p>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* =================================================
                USERS
            ================================================= */}

            {tab === "users" && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Users
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {filteredUsers.length} users found
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      loadAll(false)
                    }
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Refresh
                  </button>
                </div>

                {filteredUsers.length ===
                0 ? (
                  <EmptyState text="No users found." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500">
                        <tr>
                          <th className="text-left px-5 py-3">
                            Name
                          </th>

                          <th className="text-left px-5 py-3">
                            Email
                          </th>

                          <th className="text-left px-5 py-3">
                            Phone
                          </th>

                          <th className="text-left px-5 py-3">
                            Status
                          </th>

                          <th className="text-left px-5 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredUsers.map(
                          (user) => (
                            <tr
                              key={user._id}
                              className="border-t border-gray-200 dark:border-gray-700"
                            >
                              <td className="px-5 py-4 font-medium">
                                {user.name ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                {user.email ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                {user.phone ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    user.blocked
                                      ? "bg-red-100 text-red-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {user.blocked
                                    ? "Blocked"
                                    : "Active"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      toggleUser(
                                        user._id,
                                        user.blocked
                                          ? "unblock"
                                          : "block"
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                                  >
                                    {user.blocked
                                      ? "Unblock"
                                      : "Block"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      toggleUser(
                                        user._id,
                                        "delete"
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                MECHANICS
            ================================================= */}

            {tab === "mechanics" && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg">
                    Mechanics
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {filteredMechanics.length} mechanics found
                  </p>
                </div>

                {filteredMechanics.length ===
                0 ? (
                  <EmptyState text="No mechanics found." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500">
                        <tr>
                          <th className="text-left px-5 py-3">
                            Name
                          </th>

                          <th className="text-left px-5 py-3">
                            Garage
                          </th>

                          <th className="text-left px-5 py-3">
                            Phone
                          </th>

                          <th className="text-left px-5 py-3">
                            Online
                          </th>

                          <th className="text-left px-5 py-3">
                            Verified
                          </th>

                          <th className="text-left px-5 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredMechanics.map(
                          (mechanic) => (
                            <tr
                              key={mechanic._id}
                              className="border-t border-gray-200 dark:border-gray-700"
                            >
                              <td className="px-5 py-4 font-medium">
                                {mechanic.name ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                {mechanic.garageName ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                {mechanic.phone ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    mechanic.isOnline
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {mechanic.isOnline
                                    ? "Online"
                                    : "Offline"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    mechanic.verified
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {mechanic.verified
                                    ? "Verified"
                                    : "Pending"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      toggleMechanic(
                                        mechanic._id,
                                        mechanic.blocked
                                          ? "unblock"
                                          : "block"
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                                  >
                                    {mechanic.blocked
                                      ? "Unblock"
                                      : "Block"}
                                  </button>

                                  {!mechanic.verified && (
                                    <button
                                      onClick={() =>
                                        toggleMechanic(
                                          mechanic._id,
                                          "verify"
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                                    >
                                      Verify
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                REQUESTS
            ================================================= */}

            {tab === "requests" && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg">
                    Roadside Requests
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {filteredRequests.length} requests found
                  </p>
                </div>

                {filteredRequests.length ===
                0 ? (
                  <EmptyState text="No requests found." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500">
                        <tr>
                          <th className="text-left px-5 py-3">
                            Request
                          </th>

                          <th className="text-left px-5 py-3">
                            User
                          </th>

                          <th className="text-left px-5 py-3">
                            Problem
                          </th>

                          <th className="text-left px-5 py-3">
                            Location
                          </th>

                          <th className="text-left px-5 py-3">
                            Mechanic
                          </th>

                          <th className="text-left px-5 py-3">
                            Status
                          </th>

                          <th className="text-left px-5 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRequests.map(
                          (request) => (
                            <tr
                              key={request._id}
                              className="border-t border-gray-200 dark:border-gray-700"
                            >
                              <td className="px-5 py-4">
                                <span className="font-mono text-xs">
                                  {String(
                                    request._id
                                  ).slice(-8)}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div>
                                  <p className="font-medium">
                                    {request.user
                                      ?.name ||
                                      "Unknown"}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {request.user
                                      ?.phone ||
                                      request.user
                                        ?.email ||
                                      ""}
                                  </p>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                {request.problem ||
                                  request.serviceType ||
                                  "N/A"}
                              </td>

                              <td className="px-5 py-4 max-w-xs">
                                <p className="truncate">
                                  {request.address ||
                                    "Location available"}
                                </p>
                              </td>

                              <td className="px-5 py-4">
                                {request.mechanic
                                  ?.name ||
                                  "Unassigned"}
                              </td>

                              <td className="px-5 py-4">
                                <StatusBadge
                                  status={
                                    request.status
                                  }
                                />
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex gap-2">
                                  {request.status ===
                                    "pending" && (
                                    <button
                                      onClick={() =>
                                        assignRequest(
                                          request._id
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                                    >
                                      Assign
                                    </button>
                                  )}

                                  <button
                                    onClick={() =>
                                      openRequestDetails(
                                        request._id
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs flex items-center gap-1"
                                  >
                                    <FiEye />

                                    Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                REPORTS
            ================================================= */}

            {tab === "reports" && (
              <section className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold">
                    Reports
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Current platform and request statistics.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-5">
                    Request Distribution
                  </h3>

                  <div className="space-y-5">
                    <ReportBar
                      label="Pending"
                      value={pendingRequests}
                      total={totalRequests}
                    />

                    <ReportBar
                      label="Accepted"
                      value={acceptedRequests}
                      total={totalRequests}
                    />

                    <ReportBar
                      label="Enroute"
                      value={enrouteRequests}
                      total={totalRequests}
                    />

                    <ReportBar
                      label="Completed"
                      value={completedRequests}
                      total={totalRequests}
                    />

                    <ReportBar
                      label="Cancelled"
                      value={cancelledRequests}
                      total={totalRequests}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard
                    icon={<FiUsers />}
                    title="Total Users"
                    value={totalUsers}
                  />

                  <StatCard
                    icon={<FiTool />}
                    title="Online Mechanics"
                    value={onlineMechanics}
                    subtitle={`of ${totalMechanics} mechanics`}
                  />
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================
          REQUEST DETAILS MODAL
      ===================================================== */}

      {(detailsLoading ||
        selectedRequest) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* MODAL HEADER */}

            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  Request Details
                </h3>

                {selectedRequest?._id && (
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {selectedRequest._id}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY */}

            {detailsLoading ? (
              <LoadingBox />
            ) : selectedRequest ? (
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Current Status
                  </span>

                  <StatusBadge
                    status={
                      selectedRequest.status
                    }
                  />
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <DetailRow
                    label="User"
                    value={
                      selectedRequest.user
                        ?.name
                    }
                  />

                  <DetailRow
                    label="Phone"
                    value={
                      selectedRequest.user
                        ?.phone
                    }
                  />

                  <DetailRow
                    label="Email"
                    value={
                      selectedRequest.user
                        ?.email
                    }
                  />

                  <DetailRow
                    label="Vehicle"
                    value={
                      selectedRequest.vehicleType
                    }
                  />

                  <DetailRow
                    label="Problem"
                    value={
                      selectedRequest.problem
                    }
                  />

                  <DetailRow
                    label="Service"
                    value={
                      selectedRequest.serviceType
                    }
                  />

                  <DetailRow
                    label="Address"
                    value={
                      selectedRequest.address
                    }
                  />

                  <DetailRow
                    label="Description"
                    value={
                      selectedRequest.description
                    }
                  />

                  <DetailRow
                    label="Mechanic"
                    value={
                      selectedRequest
                        .mechanic?.name ||
                      "Unassigned"
                    }
                  />

                  <DetailRow
                    label="Fare"
                    value={
                      selectedRequest.fare !==
                      undefined
                        ? `₹${selectedRequest.fare}`
                        : "N/A"
                    }
                  />

                  <DetailRow
                    label="Created"
                    value={
                      selectedRequest.createdAt
                        ? new Date(
                            selectedRequest.createdAt
                          ).toLocaleString()
                        : "N/A"
                    }
                  />

                  <DetailRow
                    label="Updated"
                    value={
                      selectedRequest.updatedAt
                        ? new Date(
                            selectedRequest.updatedAt
                          ).toLocaleString()
                        : "N/A"
                    }
                  />
                </div>

                {/* CANCELLATION HISTORY */}

                {Array.isArray(
                  selectedRequest.cancellationHistory
                ) &&
                  selectedRequest
                    .cancellationHistory
                    .length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3">
                        Cancellation History
                      </h4>

                      <div className="space-y-3">
                        {selectedRequest.cancellationHistory.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={
                                item._id ||
                                index
                              }
                              className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium">
                                    Cancelled by{" "}
                                    {item.mechanic
                                      ?.name ||
                                      "Mechanic"}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.cancelledAt
                                      ? new Date(
                                          item.cancelledAt
                                        ).toLocaleString()
                                      : "Unknown time"}
                                  </p>
                                </div>

                                <FiXCircle className="text-red-500 mt-1" />
                              </div>

                              {item.reassignedTo && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                                  Reassigned to{" "}
                                  {item
                                    .reassignedTo
                                    ?.name ||
                                    "another mechanic"}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <EmptyState text="Request details unavailable." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}