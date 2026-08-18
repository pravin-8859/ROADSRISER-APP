import React, { useEffect, useState } from "react";
import { getHistoryApi } from "../../api/userApi";
import {
  FaCheckCircle,
  FaHistory,
  FaSyncAlt,
} from "react-icons/fa";

export default function RequestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getHistoryApi();

      setHistory(res?.history || []);
    } catch (err) {
      console.error("History:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to load service history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">
          Loading service history...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Past Services
          </p>

          <h2 className="text-2xl font-bold">
            Service History
          </h2>
        </div>

        <button
          onClick={load}
          className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaSyncAlt />
        </button>
      </div>

      {!history.length ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
            <FaHistory />
          </div>

          <h3 className="font-bold text-xl mt-5">
            No Service History
          </h3>

          <p className="text-gray-500 mt-2">
            Your completed roadside assistance services will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div>
                  <h3 className="font-bold text-lg">
                    {item.problem ||
                      item.serviceType ||
                      "Roadside Assistance"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.address || "Location unavailable"}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-semibold">
                  <FaCheckCircle />
                  Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Vehicle
                  </p>

                  <p className="font-medium capitalize">
                    {item.vehicleType || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Mechanic
                  </p>

                  <p className="font-medium">
                    {item.mechanicName || "Assigned Mechanic"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="font-medium">
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}