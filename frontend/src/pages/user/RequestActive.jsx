import React, { useEffect, useState } from "react";
import { getActiveRequestApi } from "../../api/userApi";
import {
  FaCheck,
  FaWrench,
  FaMapMarkerAlt,
  FaPhone,
  FaSyncAlt,
} from "react-icons/fa";

export default function RequestActive() {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async (initial = false) => {
    try {
      if (initial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const res = await getActiveRequestApi();

      setActive(res?.active || null);
    } catch (err) {
      console.error("Active request:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your active request."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(true);

    const interval = setInterval(() => {
      load(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">
          Loading your request...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="text-red-500 font-medium mb-4">
          {error}
        </div>

        <button
          onClick={() => load(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center text-2xl">
          <FaWrench />
        </div>

        <h3 className="text-xl font-bold mt-5">
          No Active Request
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          You don't have an ongoing roadside assistance request.
        </p>
      </div>
    );
  }

  const mechanic = active.mechanic;

  const steps = [
    {
      key: "pending",
      label: "Request Sent",
      description: "Your request has been submitted.",
    },
    {
      key: "accepted",
      label: "Mechanic Accepted",
      description: "A mechanic has accepted your request.",
    },
    {
      key: "enroute",
      label: "Mechanic On The Way",
      description: "The mechanic is coming to your location.",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === active.status
  );

  return (
    <div className="space-y-6">

      {/* TOP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Live Request
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Your Assistance Request
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Status automatically updates every 10 seconds.
          </p>
        </div>

        <button
          onClick={() => load(false)}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* STATUS */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-6">
          Request Progress
        </h3>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const completed = index <= currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={step.key}
                className="flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${
                    completed
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500"
                  }`}
                >
                  {completed ? <FaCheck /> : index + 1}
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      current
                        ? "text-indigo-600 dark:text-indigo-400"
                        : ""
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REQUEST INFO */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-5">
          Request Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Info
            label="Vehicle"
            value={active.vehicleType || "-"}
          />

          <Info
            label="Problem"
            value={
              active.problem ||
              active.serviceType ||
              "Roadside Assistance"
            }
          />

          <Info
            label="Location"
            value={active.address || "Location unavailable"}
            icon={<FaMapMarkerAlt />}
          />

          <Info
            label="Status"
            value={active.status}
          />
        </div>

        {active.description && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-1">
              Description
            </p>

            <p className="text-sm">
              {active.description}
            </p>
          </div>
        )}
      </div>

      {/* MECHANIC */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-5">
          Assigned Mechanic
        </h3>

        {!mechanic ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center text-xl">
              <FaWrench />
            </div>

            <div>
              <p className="font-semibold">
                Finding a mechanic...
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Nearby mechanics can see your request.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            <div className="flex items-center gap-4">
              {mechanic.profilePhoto ? (
                <img
                  src={mechanic.profilePhoto}
                  alt={mechanic.name || "Mechanic"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xl font-bold">
                  {(mechanic.name || "M")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <h4 className="text-lg font-bold">
                  {mechanic.name || "Mechanic"}
                </h4>

                <p className="text-sm text-gray-500">
                  {mechanic.garageName ||
                    "RoadsRiser Mechanic"}
                </p>
              </div>
            </div>

            {mechanic.phone && (
              <a
                href={`tel:${mechanic.phone}`}
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white flex items-center justify-center gap-2 font-semibold"
              >
                <FaPhone />
                Call Mechanic
              </a>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        Last checked automatically • updates every 10 seconds
      </p>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </p>

      <p className="font-semibold capitalize break-words">
        {value}
      </p>
    </div>
  );
}