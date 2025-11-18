import React, { useEffect, useState } from "react";
import { getActiveRequestApi, createRequestApi } from "../../api/userApi";

export default function RequestActive() {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getActiveRequestApi();
      setActive(res.active || null);
    } catch (err) {
      console.log(err);
      alert("Failed to load active request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const handleCancel = async () => {
    // If backend supports cancel endpoint use it; otherwise we simulate by calling createRequestApi with cancel flag
    try {
      // Example: await cancelRequestApi(active._id)
      alert("Request cancelled (frontend simulated). Refreshing...");
      setActive(null);
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  if (loading) return <div>Loading active request...</div>;

  if (!active) return <div className="text-gray-500">No active request. Create one from New Request.</div>;

  return (
    <div className="space-y-3">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{active.serviceType}</div>
            <div className="text-sm text-gray-500">{active.address}</div>
          </div>
          <div className="text-sm font-medium">{active.status}</div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Mechanic: {active.mechanic?.name || "Not assigned yet"} <br />
          Phone: {active.mechanic?.phone || "-"}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={handleCancel} className="px-3 py-2 rounded-lg border">Cancel Request</button>
          <button onClick={load} className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Refresh</button>
        </div>
      </div>
    </div>
  );
}
