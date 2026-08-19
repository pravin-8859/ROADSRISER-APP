import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

import {
  getAdminRequests,
} from "../services/api";

import {
  exportCSV,
  exportRequestsPDF,
} from "../utils/reportExporter";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD REAL REQUESTS
  // =====================================================

  const loadReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getAdminRequests();

      setReports(
        Array.isArray(data?.requests)
          ? data.requests
          : []
      );
    } catch (err) {
      console.error(
        "Reports loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // =====================================================
  // FORMAT DATA FOR REPORT
  // =====================================================

  const formattedReports = useMemo(() => {
    return reports.map((request) => ({
      id: request._id,

      customer:
        request.user?.name ||
        "Unknown User",

      phone:
        request.user?.phone ||
        "—",

      email:
        request.user?.email ||
        "—",

      mechanic:
        request.mechanic?.name ||
        "Not Assigned",

      garage:
        request.mechanic?.garageName ||
        "—",

      issue:
        request.problem ||
        "—",

      service:
        request.serviceType ||
        "—",

      vehicle:
        request.vehicleType ||
        "—",

      status:
        request.status ||
        "unknown",

      amount:
        Number(request.fare || 0),

      address:
        request.address ||
        "—",

      date:
        request.createdAt
          ? new Date(
              request.createdAt
            ).toLocaleDateString(
              "en-IN"
            )
          : "—",

      createdAt:
        request.createdAt,
    }));
  }, [reports]);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return formattedReports.filter(
      (report) => {
        const matchesSearch =
          !query ||
          report.customer
            .toLowerCase()
            .includes(query) ||
          report.phone
            .toLowerCase()
            .includes(query) ||
          report.email
            .toLowerCase()
            .includes(query) ||
          report.mechanic
            .toLowerCase()
            .includes(query) ||
          report.issue
            .toLowerCase()
            .includes(query) ||
          report.service
            .toLowerCase()
            .includes(query) ||
          report.vehicle
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          report.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    formattedReports,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const completedCount =
    formattedReports.filter(
      (r) => r.status === "completed"
    ).length;

  const pendingCount =
    formattedReports.filter(
      (r) => r.status === "pending"
    ).length;

  const acceptedCount =
    formattedReports.filter(
      (r) => r.status === "accepted"
    ).length;

  const totalFare =
    formattedReports.reduce(
      (sum, r) =>
        sum + Number(r.amount || 0),
      0
    );

  // =====================================================
  // CSV
  // =====================================================

  const handleCSV = () => {
    if (!filteredReports.length) return;

    exportCSV(
      filteredReports.map((r) => ({
        ID: r.id,
        Customer: r.customer,
        Phone: r.phone,
        Email: r.email,
        Mechanic: r.mechanic,
        Garage: r.garage,
        Service: r.service,
        Issue: r.issue,
        Vehicle: r.vehicle,
        Status: r.status,
        Amount: r.amount,
        Address: r.address,
        Date: r.date,
      }))
    );
  };

  // =====================================================
  // PDF
  // =====================================================

  const handlePDF = () => {
    if (!filteredReports.length) return;

    exportRequestsPDF({
      title:
        "RoadsRiser Service Requests Report",

      requests:
        filteredReports.map((r) => ({
          id: r.id,
          date: r.date,
          customer: r.customer,
          phone: r.phone,
          mechanic: r.mechanic,
          issue: r.issue,
          service: r.service,
          vehicle: r.vehicle,
          status: r.status,
          amount: r.amount,
          location: r.address,
        })),
    });
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
            Loading reports...
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
          Unable to load reports
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>

        <button
          onClick={() => loadReports()}
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
            Reports & Downloads
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Reports
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Export and review RoadsRiser service requests.
          </p>

        </div>

        <button
          onClick={() =>
            loadReports(true)
          }
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

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <SummaryCard
          title="Total Reports"
          value={formattedReports.length}
          icon="📊"
        />

        <SummaryCard
          title="Completed"
          value={completedCount}
          icon="✅"
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon="⏳"
        />

        <SummaryCard
          title="Total Fare"
          value={`₹${totalFare.toLocaleString(
            "en-IN"
          )}`}
          icon="₹"
        />

      </section>

      {/* =================================================
          SEARCH + FILTER + EXPORT
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-xl">

        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

          <div className="relative w-full xl:max-w-xl">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              placeholder="Search customer, mechanic, issue, vehicle..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500"
            />

          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-indigo-500"
            >

              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="enroute">
                Enroute
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

            <button
              onClick={handleCSV}
              disabled={
                filteredReports.length ===
                0
              }
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-medium transition"
            >

              <FiDownload />

              CSV

            </button>

            <button
              onClick={handlePDF}
              disabled={
                filteredReports.length ===
                0
              }
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-sm font-medium transition"
            >

              <FiFileText />

              PDF

            </button>

          </div>

        </div>

        <p className="text-xs text-gray-500 mt-3">
          Showing{" "}
          <span className="text-gray-300">
            {filteredReports.length}
          </span>{" "}
          of{" "}
          <span className="text-gray-300">
            {formattedReports.length}
          </span>{" "}
          reports
        </p>

      </section>

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-[#0b1220] border-b border-white/10">

              <tr>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Mechanic
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Fare
                </th>

                <th className="px-5 py-4 text-left text-xs text-gray-400 uppercase">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.length === 0 ? (
                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center"
                  >

                    <div className="text-4xl mb-3">
                      📄
                    </div>

                    <p className="text-gray-300 font-medium">
                      No reports found
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredReports.map(
                  (report) => (
                    <tr
                      key={report.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition"
                    >

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-white">
                          {report.customer}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {report.phone}
                        </p>

                      </td>

                      {/* MECHANIC */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-300">
                          {report.mechanic}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {report.garage}
                        </p>

                      </td>

                      {/* SERVICE */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-300">
                          {report.service}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {report.issue}
                        </p>

                      </td>

                      {/* VEHICLE */}

                      <td className="px-5 py-4">

                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 capitalize">
                          {report.vehicle}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            report.status
                          }
                        />

                      </td>

                      {/* FARE */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-white">
                          ₹
                          {report.amount.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-gray-400">
                          {report.date}
                        </span>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
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

          <p className="text-2xl font-bold text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    accepted:
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",

    enroute:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    completed:
      "bg-green-500/10 text-green-400 border-green-500/20",

    cancelled:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
        styles[status] ||
        "bg-gray-500/10 text-gray-400 border-gray-500/20"
      }`}
    >

      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      {status
        ? status.charAt(0).toUpperCase() +
          status.slice(1)
        : "Unknown"}

    </span>
  );
}