import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiActivity,
} from "react-icons/fi";

import { getAdminMechanics } from "../services/api";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMechanic, setSelectedMechanic] =
    useState(null);

  // =====================================================
  // LOAD MECHANICS
  // =====================================================

  const loadMechanics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminMechanics();

      setMechanics(
        Array.isArray(data?.mechanics)
          ? data.mechanics
          : []
      );
    } catch (err) {
      console.error(
        "Mechanics loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load mechanics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMechanics();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredMechanics = useMemo(() => {
    let data = [...mechanics];

    const query =
      search.trim().toLowerCase();

    if (query) {
      data = data.filter((mechanic) => {
        return (
          mechanic.name
            ?.toLowerCase()
            .includes(query) ||
          mechanic.email
            ?.toLowerCase()
            .includes(query) ||
          mechanic.phone
            ?.toLowerCase()
            .includes(query) ||
          mechanic.garageName
            ?.toLowerCase()
            .includes(query) ||
          mechanic.address
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    if (filterType === "online") {
      data = data.filter(
        (mechanic) =>
          mechanic.isOnline === true
      );
    }

    if (filterType === "offline") {
      data = data.filter(
        (mechanic) =>
          mechanic.isOnline !== true
      );
    }

    if (filterType === "verified") {
      data = data.filter(
        (mechanic) =>
          mechanic.isVerified === true
      );
    }

    if (filterType === "unverified") {
      data = data.filter(
        (mechanic) =>
          mechanic.isVerified !== true
      );
    }

    return data;
  }, [
    mechanics,
    search,
    filterType,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const onlineCount = mechanics.filter(
    (mechanic) =>
      mechanic.isOnline === true
  ).length;

  const offlineCount =
    mechanics.length - onlineCount;

  const verifiedCount = mechanics.filter(
    (mechanic) =>
      mechanic.isVerified === true
  ).length;

  const unverifiedCount =
    mechanics.length - verifiedCount;

  // =====================================================
  // DATE
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

  const formatDateTime = (date) => {
    if (!date) return "No update";

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
  // LOCATION
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
            Loading mechanics...
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
          Unable to load mechanics
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>

        <button
          onClick={() => loadMechanics()}
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
            Mechanic Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Mechanics
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Monitor mechanic verification,
            availability and locations.
          </p>
        </div>

        <button
          onClick={() =>
            loadMechanics(true)
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
          icon="🔧"
          title="Total Mechanics"
          value={mechanics.length}
        />

        <SummaryCard
          icon="🟢"
          title="Online"
          value={onlineCount}
        />

        <SummaryCard
          icon="✓"
          title="Verified"
          value={verifiedCount}
        />

        <SummaryCard
          icon="⚠"
          title="Needs Verification"
          value={unverifiedCount}
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
              placeholder="Search by name, email, phone, garage or address..."
              className="w-full bg-[#0b1220] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />

          </div>

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
            className="w-full lg:w-auto bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-indigo-500"
          >
            <option value="all">
              All Mechanics
            </option>

            <option value="online">
              Online
            </option>

            <option value="offline">
              Offline
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="unverified">
              Needs Verification
            </option>
          </select>

        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing{" "}
          <span className="text-gray-300">
            {filteredMechanics.length}
          </span>{" "}
          of{" "}
          <span className="text-gray-300">
            {mechanics.length}
          </span>{" "}
          mechanics
        </div>

      </section>

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-[#0b1220] border-b border-white/10">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Mechanic
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Garage
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Location
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredMechanics.length === 0 ? (
                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center"
                  >

                    <div className="text-4xl mb-3">
                      🔧
                    </div>

                    <p className="text-gray-300 font-medium">
                      No mechanics found
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      Try another search or filter.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredMechanics.map(
                  (mechanic) => {
                    const mapUrl =
                      getMapUrl(
                        mechanic.currentLocation ||
                          mechanic.garageLocation
                      );

                    return (
                      <tr
                        key={mechanic._id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition"
                      >

                        {/* MECHANIC */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="relative w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">

                              {mechanic.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "M"}

                              <span
                                className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-[#111827] ${
                                  mechanic.isOnline
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }`}
                              />

                            </div>

                            <div>

                              <p className="text-sm font-medium text-white">
                                {mechanic.name ||
                                  "Unknown Mechanic"}
                              </p>

                              <p className="text-[11px] text-gray-600 mt-0.5">
                                ID:{" "}
                                {mechanic._id?.slice(
                                  -8
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* GARAGE */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-gray-300">
                            {mechanic.garageName ||
                              "Not provided"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1 max-w-[220px] truncate">
                            {mechanic.address ||
                              "No address"}
                          </p>

                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <FiPhone className="text-gray-600" />
                            {mechanic.phone ||
                              "No phone"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <FiMail className="text-gray-600" />
                            {mechanic.email ||
                              "No email"}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <div className="space-y-2">

                            <StatusBadge
                              active={
                                mechanic.isOnline
                              }
                              activeText="Online"
                              inactiveText="Offline"
                            />

                            <div className="flex items-center gap-1.5">

                              {mechanic.isVerified ? (
                                <>
                                  <FiShield className="text-green-400 text-xs" />

                                  <span className="text-xs text-green-400">
                                    Verified
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiShield className="text-yellow-400 text-xs" />

                                  <span className="text-xs text-yellow-400">
                                    Unverified
                                  </span>
                                </>
                              )}

                            </div>

                          </div>

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
                              setSelectedMechanic(
                                mechanic
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
          DETAILS MODAL
      ================================================= */}

      {selectedMechanic && (
        <MechanicModal
          mechanic={selectedMechanic}
          onClose={() =>
            setSelectedMechanic(null)
          }
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          getMapUrl={getMapUrl}
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

function StatusBadge({
  active,
  activeText,
  inactiveText,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
        active
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active
            ? "bg-green-400"
            : "bg-gray-500"
        }`}
      />

      {active
        ? activeText
        : inactiveText}
    </span>
  );
}

// =====================================================
// MECHANIC MODAL
// =====================================================

function MechanicModal({
  mechanic,
  onClose,
  formatDate,
  formatDateTime,
  getMapUrl,
}) {
  const currentMap =
    getMapUrl(
      mechanic.currentLocation
    );

  const garageMap =
    getMapUrl(
      mechanic.garageLocation
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

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
              {mechanic.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "M"}
            </div>

            <div>

              <p className="text-xs text-indigo-400">
                Mechanic Details
              </p>

              <h2 className="text-lg font-semibold text-white">
                {mechanic.name ||
                  "Unknown Mechanic"}
              </h2>

            </div>

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

          <div className="flex flex-wrap gap-2">

            <StatusBadge
              active={mechanic.isOnline}
              activeText="Online"
              inactiveText="Offline"
            />

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                mechanic.isVerified
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }`}
            >
              <FiShield />

              {mechanic.isVerified
                ? "Verified"
                : "Unverified"}
            </span>

          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Detail
              icon={<FiPhone />}
              label="Phone"
              value={
                mechanic.phone ||
                "Not provided"
              }
            />

            <Detail
              icon={<FiMail />}
              label="Email"
              value={
                mechanic.email ||
                "Not provided"
              }
            />

            <Detail
              icon={<FiActivity />}
              label="Last Location Update"
              value={formatDateTime(
                mechanic.lastLocationUpdate
              )}
            />

            <Detail
              icon={<FiCalendar />}
              label="Joined"
              value={formatDate(
                mechanic.createdAt
              )}
            />

          </div>

          {/* GARAGE */}

          <div className="rounded-xl bg-[#0b1220] border border-white/10 p-4">

            <div className="flex items-center gap-2 mb-3">

              <FiMapPin className="text-indigo-400" />

              <h3 className="text-sm font-semibold text-white">
                Garage Location
              </h3>

            </div>

            <p className="text-sm text-gray-300">
              {mechanic.garageName ||
                "Garage name not provided"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {mechanic.address ||
                "Address not provided"}
            </p>

            {garageMap && (
              <a
                href={garageMap}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <FiMapPin />
                Open garage location
              </a>
            )}

          </div>

          {/* CURRENT LOCATION */}

          <div className="rounded-xl bg-[#0b1220] border border-white/10 p-4">

            <div className="flex items-center gap-2 mb-3">

              <FiActivity className="text-green-400" />

              <h3 className="text-sm font-semibold text-white">
                Current Location
              </h3>

            </div>

            {mechanic.currentLocation?.coordinates ? (
              <>
                <p className="text-xs text-gray-500">
                  Longitude:{" "}
                  <span className="text-gray-300">
                    {
                      mechanic
                        .currentLocation
                        .coordinates[0]
                    }
                  </span>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Latitude:{" "}
                  <span className="text-gray-300">
                    {
                      mechanic
                        .currentLocation
                        .coordinates[1]
                    }
                  </span>
                </p>

                {currentMap && (
                  <a
                    href={currentMap}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    <FiMapPin />
                    Open current location
                  </a>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-600">
                Current location unavailable.
              </p>
            )}

          </div>

          {/* ID */}

          <div className="pt-2 border-t border-white/10">

            <p className="text-[11px] text-gray-600 break-all">
              Mechanic ID:{" "}
              {mechanic._id}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// DETAIL
// =====================================================

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">

      <div className="w-9 h-9 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-gray-500">
          {label}
        </p>

        <p className="text-sm text-gray-200 mt-0.5 break-words">
          {value}
        </p>

      </div>

    </div>
  );
}