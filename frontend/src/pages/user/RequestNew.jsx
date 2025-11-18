import React, { useEffect, useState } from "react";
import { getHistoryApi } from "../../api/userApi";

export default function RequestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getHistoryApi();
      setHistory(res.history || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  if (loading) return <div>Loading history...</div>;
  if (!history.length) return <div className="text-gray-500">No service history yet.</div>;

  return (
    <div className="space-y-3">
      {history.map(h=>(
        <div key={h._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">{h.serviceType}</div>
              <div className="text-sm text-gray-500">{h.address}</div>
            </div>
            <div className="text-sm">{new Date(h.createdAt).toLocaleString()}</div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Status: {h.status} • Mechanic: {h.mechanicName || "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
