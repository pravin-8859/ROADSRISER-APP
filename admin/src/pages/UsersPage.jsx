import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiX,
  FiUsers,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

import { getAdminUsers } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] =
    useState(null);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminUsers();

      setUsers(
        Array.isArray(data?.users)
          ? data.users
          : []
      );
    } catch (err) {
      console.error(
        "Users loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user.phone
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [users, search]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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
            Loading users...
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
          Unable to load users
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>

        <button
          onClick={() => loadUsers()}
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
            User Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Users
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            View and manage registered RoadsRiser users.
          </p>
        </div>

        <button
          onClick={() => loadUsers(true)}
          disabled={refreshing}
          className="w-fit flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium transition"
        >
          <FiRefreshCw
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </section>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <SummaryCard
          icon={<FiUsers />}
          title="Total Users"
          value={users.length}
        />

        <SummaryCard
          icon={<FiMail />}
          title="Users With Email"
          value={
            users.filter(
              (user) => user.email
            ).length
          }
        />

        <SummaryCard
          icon={<FiPhone />}
          title="Users With Phone"
          value={
            users.filter(
              (user) => user.phone
            ).length
          }
        />

      </section>

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="relative w-full md:max-w-lg">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email or phone..."
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />

          </div>

          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-300 font-medium">
              {users.length}
            </span>{" "}
            users
          </p>

        </div>

      </section>

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-[#0b1220] border-b border-white/10">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (
                <tr>

                  <td
                    colSpan="4"
                    className="px-5 py-16 text-center"
                  >

                    <div className="text-4xl mb-3">
                      👥
                    </div>

                    <p className="text-gray-300 font-medium">
                      No users found
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      Try a different search.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </div>

                          <div>

                            <p className="text-sm font-medium text-white">
                              {user.name ||
                                "Unknown User"}
                            </p>

                            <p className="text-[11px] text-gray-600 mt-0.5">
                              ID:{" "}
                              {user._id?.slice(
                                -8
                              ) || "—"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-300">
                          {user.email ||
                            "No email"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {user.phone ||
                            "No phone"}
                        </p>

                      </td>

                      {/* JOINED */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-400">

                          <FiCalendar className="text-gray-600" />

                          {formatDate(
                            user.createdAt
                          )}

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            setSelectedUser(
                              user
                            )
                          }
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-gray-300 hover:text-white text-xs font-medium transition"
                        >

                          <FiEye />

                          View

                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          formatDate={formatDate}
        />
      )}

    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// USER MODAL
// =====================================================

function UserModal({
  user,
  onClose,
  formatDate,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-5 border-b border-white/10">

          <div>

            <p className="text-xs text-indigo-400 font-medium">
              User Details
            </p>

            <h2 className="text-lg font-semibold text-white mt-1">
              {user.name ||
                "Unknown User"}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <FiX />
          </button>

        </div>

        {/* BODY */}

        <div className="p-5 space-y-4">

          <DetailRow
            icon={<FiUserIcon />}
            label="Name"
            value={user.name}
          />

          <DetailRow
            icon={<FiMail />}
            label="Email"
            value={user.email}
          />

          <DetailRow
            icon={<FiPhone />}
            label="Phone"
            value={
              user.phone || "Not provided"
            }
          />

          <DetailRow
            icon={<FiCalendar />}
            label="Joined"
            value={formatDate(
              user.createdAt
            )}
          />

          <div className="pt-3 border-t border-white/10">

            <p className="text-[11px] text-gray-600 break-all">
              User ID: {user._id}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
        {icon}
      </div>

      <div>
        <p className="text-[11px] text-gray-500">
          {label}
        </p>

        <p className="text-sm text-gray-200 mt-0.5">
          {value || "—"}
        </p>
      </div>

    </div>
  );
}

// =====================================================
// USER ICON
// =====================================================

function FiUserIcon() {
  return (
    <span className="text-sm">
      👤
    </span>
  );
}