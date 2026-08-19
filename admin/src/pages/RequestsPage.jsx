import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMapPin,
  FiEye,
  FiX,
  FiPhone,
  FiMail,
  FiCalendar,
  FiTool,
} from "react-icons/fi";

import {
  getAdminRequests,
  getAdminMechanics,
} from "../services/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [requestData, mechanicData] =
        await Promise.all([
          getAdminRequests(),
          getAdminMechanics(),
        ]);

      setRequests(
        Array.isArray(requestData?.requests)
          ? requestData.requests
          : []
      );

      setMechanics(
        Array.isArray(mechanicData?.mechanics)
          ? mechanicData.mechanics
          : []
      );
    } catch (err) {
      console.error(
        "Requests loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRequests = useMemo(() => {
    let data = [...requests];

    const query =
      search.trim().toLowerCase();

    if (query) {
      data = data.filter((request) => {
        return (
          request.user?.name
            ?.toLowerCase()
            .includes(query) ||
          request.user?.email
            ?.toLowerCase()
            .includes(query) ||
          request.user?.phone
            ?.toLowerCase()
            .includes(query) ||
          request.problem
            ?.toLowerCase()
            .includes(query) ||
          request.serviceType
            ?.toLowerCase()
            .includes(query) ||
          request.vehicleType
            ?.toLowerCase()
            .includes(query) ||
          request.address
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    if (filterStatus !== "all") {
      data = data.filter(
        (request) =>
          request.status === filterStatus
      );
    }

    return data;
  }, [
    requests,
    search,
    filterStatus,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const acceptedCount = requests.filter(
    (r) => r.status === "accepted"
  ).length;

  const enrouteCount = requests.filter(
    (r) => r.status === "enroute"
  ).length;

  const completedCount = requests.filter(
    (r) => r.status === "completed"
  ).length;

  const cancelledCount = requests.filter(
    (r) => r.status === "cancelled"
  ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // MAP URL
  // =====================================================

  const getMapUrl = (location) => {
    const coordinates =
      location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return null;
    }

    const [lng, lat] = coordinates;

    return `https://www.google.com/maps?q=${lat},${lng}`;
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
            Loading requests...
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
          Unable to load requests
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>

        <button
          onClick={() => loadData()}
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
            Service Requests
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Requests
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Monitor all roadside assistance requests.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
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
          SUMMARY CARDS
      ================================================= */}

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">

        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon="⏳"
        />

        <SummaryCard
          title="Accepted"
          value={acceptedCount}
          icon="✓"
        />

        <SummaryCard
          title="Enroute"
          value={enrouteCount}
          icon="🚗"
        />

        <SummaryCard
          title="Completed"
          value={completedCount}
          icon="✅"
        />

        <SummaryCard
          title="Cancelled"
          value={cancelledCount}
          icon="✕"
        />

      </section>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="relative w-full lg:max-w-xl">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search user, issue, vehicle or address..."
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500"
            />

          </div>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="w-full lg:w-auto bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-indigo-500"
          >
            <option value="all">
              All Requests
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

        </div>

        <p className="text-xs text-gray-500 mt-3">
          Showing{" "}
          <span className="text-gray-300">
            {filteredRequests.length}
          </span>{" "}
          of{" "}
          <span className="text-gray-300">
            {requests.length}
          </span>{" "}
          requests
        </p>

      </section>

      {/* =================================================
          REQUEST TABLE
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-[#0b1220] border-b border-white/10">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Mechanic
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Location
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRequests.length === 0 ? (
                <tr>

                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >

                    <div className="text-4xl mb-3">
                      🚗
                    </div>

                    <p className="text-gray-300 font-medium">
                      No requests found
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      Try another search or filter.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredRequests.map(
                  (request) => {
                    const mapUrl =
                      getMapUrl(
                        request.location
                      );

                    return (
                      <tr
                        key={request._id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition"
                      >

                        {/* USER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                              <FiUser />
                            </div>

                            <div>

                              <p className="text-sm font-medium text-white">
                                {request.user?.name ||
                                  "Unknown User"}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {request.user?.phone ||
                                  request.user?.email ||
                                  "No contact"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* SERVICE */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-gray-300">
                            {request.serviceType ||
                              request.problem ||
                              "Roadside Assistance"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {request.problem ||
                              "No problem specified"}
                          </p>

                        </td>

                        {/* VEHICLE */}

                        <td className="px-5 py-4">

                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 capitalize">
                            {request.vehicleType ||
                              "—"}
                          </span>

                        </td>

                        {/* MECHANIC */}

                        <td className="px-5 py-4">

                          {request.mechanic ? (
                            <div>

                              <p className="text-sm text-gray-300">
                                {request.mechanic.name ||
                                  "Assigned"}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {request.mechanic.garageName ||
                                  request.mechanic.email ||
                                  ""}
                              </p>

                            </div>
                          ) : (
                            <span className="text-xs text-gray-600">
                              Not assigned
                            </span>
                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={
                              request.status
                            }
                          />

                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-4">

                          {mapUrl ? (
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs transition"
                            >
                              <FiMapPin />
                              Open Map
                            </a>
                          ) : (
                            <span className="text-xs text-gray-600">
                              No location
                            </span>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              setSelectedRequest(
                                request
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-gray-300 hover:text-white text-xs font-medium transition"
                          >
                            <FiEye />
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================================
          REQUEST DETAILS MODAL
      ================================================= */}

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() =>
            setSelectedRequest(null)
          }
          getMapUrl={getMapUrl}
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

      <p className="text-2xl font-bold text-white mt-2">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  const config = {
    pending: {
      text: "Pending",
      className:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },

    accepted: {
      text: "Accepted",
      className:
        "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },

    enroute: {
      text: "Enroute",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },

    completed: {
      text: "Completed",
      className:
        "bg-green-500/10 text-green-400 border-green-500/20",
    },

    cancelled: {
      text: "Cancelled",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  const current =
    config[status] || {
      text: status || "Unknown",
      className:
        "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${current.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      {current.text}
    </span>
  );
}

// =====================================================
// REQUEST MODAL
// =====================================================

function RequestModal({
  request,
  onClose,
  getMapUrl,
  formatDate,
}) {
  const mapUrl = getMapUrl(
    request.location
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#111827] border border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-5 border-b border-white/10">

          <div>

            <p className="text-xs text-indigo-400 font-medium">
              Request Details
            </p>

            <h2 className="text-lg font-semibold text-white mt-1">
              {request.serviceType ||
                request.problem ||
                "Roadside Assistance"}
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

        <div className="p-5 space-y-5">

          {/* STATUS */}

          <StatusBadge
            status={request.status}
          />

          {/* USER */}

          <InfoSection title="User">

            <InfoRow
              icon={<FiUser />}
              label="Name"
              value={
                request.user?.name
              }
            />

            <InfoRow
              icon={<FiMail />}
              label="Email"
              value={
                request.user?.email
              }
            />

            <InfoRow
              icon={<FiPhone />}
              label="Phone"
              value={
                request.user?.phone
              }
            />

          </InfoSection>

          {/* REQUEST */}

          <InfoSection title="Request">

            <InfoRow
              icon={<FiTool />}
              label="Service"
              value={
                request.serviceType
              }
            />

            <InfoRow
              icon="🚗"
              label="Vehicle"
              value={
                request.vehicleType
              }
            />

            <InfoRow
              icon="⚠"
              label="Problem"
              value={
                request.problem
              }
            />

            <InfoRow
              icon="📝"
              label="Description"
              value={
                request.description ||
                "No description"
              }
            />

          </InfoSection>

          {/* MECHANIC */}

          <InfoSection title="Mechanic">

            {request.mechanic ? (
              <>
                <InfoRow
                  icon="🔧"
                  label="Name"
                  value={
                    request.mechanic.name
                  }
                />

                <InfoRow
                  icon={<FiPhone />}
                  label="Phone"
                  value={
                    request.mechanic.phone
                  }
                />

                <InfoRow
                  icon="🏪"
                  label="Garage"
                  value={
                    request.mechanic.garageName
                  }
                />
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No mechanic assigned.
              </p>
            )}

          </InfoSection>

          {/* LOCATION */}

          <InfoSection title="Location">

            <InfoRow
              icon={<FiMapPin />}
              label="Address"
              value={
                request.address ||
                "Address unavailable"
              }
            />

            {request.location?.coordinates && (
              <div className="text-xs text-gray-500">

                Coordinates:{" "}

                <span className="text-gray-300">
                  {
                    request.location
                      .coordinates[1]
                  }
                  ,{" "}
                  {
                    request.location
                      .coordinates[0]
                  }
                </span>

              </div>
            )}

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs"
              >
                <FiMapPin />
                Open Location
              </a>
            )}

          </InfoSection>

          {/* FARE + DATE */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-[#0b1220] border border-white/10 p-4">

              <p className="text-xs text-gray-500">
                Fare
              </p>

              <p className="text-lg font-semibold text-white mt-1">
                ₹
                {Number(
                  request.fare || 0
                ).toLocaleString("en-IN")}
              </p>

            </div>

            <div className="rounded-xl bg-[#0b1220] border border-white/10 p-4">

              <p className="text-xs text-gray-500">
                Created
              </p>

              <p className="text-sm font-medium text-white mt-1">
                {formatDate(
                  request.createdAt
                )}
              </p>

            </div>

          </div>

          {/* ID */}

          <div className="pt-2 border-t border-white/10">

            <p className="text-[11px] text-gray-600 break-all">
              Request ID:{" "}
              {request._id}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// INFO SECTION
// =====================================================

function InfoSection({
  title,
  children,
}) {
  return (
    <div className="rounded-xl bg-[#0b1220] border border-white/10 p-4">

      <h3 className="text-sm font-semibold text-white mb-3">
        {title}
      </h3>

      <div className="space-y-3">
        {children}
      </div>

    </div>
  );
}

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">

      <div className="w-8 h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 text-sm">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-gray-500">
          {label}
        </p>

        <p className="text-sm text-gray-200 mt-0.5 break-words">
          {value || "—"}
        </p>

      </div>

    </div>
  );
}