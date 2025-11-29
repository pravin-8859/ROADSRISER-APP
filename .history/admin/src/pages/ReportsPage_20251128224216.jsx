import React, { useState, useEffect } from "react";
import { exportCSV, exportRequestsPDF } from "../utils/reportExporter";

export default function ReportsPage() {
  // -------------------- SAMPLE DATA (Replace with API later) --------------------
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fake data (Rapido-style)
    const fakeData = [
      {
        id: 1,
        customer: "Rahul Sharma",
        phone: "9876543210",
        mechanic: "Aman Verma",
        issue: "Flat Tyre",
        status: "Completed",
        amount: 1200,
        date: "2025-11-25",
      },
      {
        id: 2,
        customer: "Pooja Singh",
        phone: "9123456780",
        mechanic: "Ravi Kumar",
        issue: "Battery Dead",
        status: "Completed",
        amount: 1500,
        date: "2025-11-26",
      },
    ];

    setReports(fakeData);
  }, []);

  // -------------------- FILTERS --------------------
  const [search, setSearch] = useState("");
  const filtered = reports.filter((r) =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.mechanic.toLowerCase().includes(search.toLowerCase()) ||
    r.issue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-4">📊 Reports & Downloads</h1>

      {/* SEARCH + BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search reports..."
          className="px-4 py-2 border rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download CSV
          </button>

          <button
            onClick={() => exportRequestsPDF(filtered)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Mechanic</th>
              <th className="p-3 text-left">Issue</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr className="border-t" key={r.id}>
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.customer}</td>
                  <td className="p-3">{r.mechanic}</td>
                  <td className="p-3">{r.issue}</td>
                  <td className="p-3 font-semibold">₹{r.amount}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">{r.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
