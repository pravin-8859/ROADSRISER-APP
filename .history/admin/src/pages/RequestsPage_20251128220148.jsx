import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiTool,
  FiMapPin,
  FiXCircle,
  FiClock,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [mechanics] = useState([
    { id: 1, name: "Rakesh Auto Garage" },
    { id: 2, name: "FastFix Mechanic" },
    { id: 3, name: "Sharma Motors" },
  ]);

  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState("");

  useEffect(() => {
    loadDummyRequests();
  }, []);

  function loadDummyRequests() {
    const dummy = [
      {
        id: 1001,
        user: "Pravin Kumar",
        issue: "Bike not starting",
        location: "Near MG Road",
        status: "pending",
        mechanic: null,
        time: "10 mins ago",
      },
      {
        id: 1002,
        user: "Rahul Sharma",
        issue: "Flat tire",
        location: "Sector 12 Noida",
        status: "assigned",
        mechanic: "Rakesh Auto Garage",
        time: "25 mins ago",
      },
      {
        id: 1003,
        user: "Amit Verma",
        issue: "Engine overheating",
        location: "Connaught Place",
        status: "onroute",
        mechanic: "FastFix Mechanic",
        time: "40 mins ago",
      },
      {
        id: 1004,
        user: "Ravi Singh",
        issue: "Battery issue",
        location: "Bhopal Square",
        status: "completed",
        mechanic: "Sharma Motors",
        time: "1 hour ago",
      },
    ];

    setRequests(dummy);
    setFiltered(dummy);
  }

  // Filtering
  useEffect(() => {
    let data = [...requests];

    if (search.trim()) {
      data = data.filter(
        (r) =>
          r.user.toLowerCase().includes(search.toLowerCase()) ||
          r.issue.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((r) => r.status === filterStatus);
    }

    setFiltered(data);
  }, [search, filterStatus, requests]);

  // Assign Mechanic → updates request
  function assignMechanic() {
    if (!selectedMechanic) return;

    const updated = requests.map((r) =>
      r.id === selectedRequestId
        ? { ...r, status: "assigned", mechanic: selectedMechanic }
        : r
    );
    setRequests(updated);

    setAssignModalOpen(false);
    setSelectedMechanic("");
  }

  // Change status
  function updateStatus(id, newStatus) {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setRequests(updated);
  }

  // Delete request
  function deleteRequest(id) {
    setRequests(requests.filter((r) => r.id !== id));
  }

  // STATUS BADGES
  function StatusBadge({ status }) {
    const map = {
      pending: "text-yellow-400",
      assigned: "text-blue-400",
      onroute: "text-purple-400",
      completed: "text-green-400",
      cancelled: "text-red-400",
    };
    return (
      <span className={`${map[status]} font-medium capitalize`}>
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Requests Management</h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* SEARCH */}
        <div className="flex items-center bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl w-full sm:w-1/2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm ml-2 w-full"
          />
        </div>

        {/* FILTER */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-sm"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="onroute">On Route</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Mechanic</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-4 flex items-center gap-2">
                  <FiUser className="text-gray-400" /> {r.user}
                </td>

                <td className="p-4">{r.issue}</td>

                <td className="p-4 flex items-center gap-2">
                  <FiMapPin className="text-gray-400" /> {r.location}
                </td>

                <td className="p-4">
                  {r.mechanic ? r.mechanic : <span className="text-gray-500">—</span>}
                </td>

                <td className="p-4">
                  <StatusBadge status={r.status} />
                </td>

                <td className="p-4 text-right flex items-center justify-end gap-3">

                  {/* ASSIGN MECHANIC */}
                  {r.status === "pending" && (
                    <button
                      onClick={() => {
                        setSelectedRequestId(r.id);
                        setAssignModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500"
                    >
                      Assign
                    </button>
                  )}

                  {/* START ON ROUTE */}
                  {r.status === "assigned" && (
                    <button
                      onClick={() => updateStatus(r.id, "onroute")}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-500"
                    >
                      Start Route
                    </button>
                  )}

                  {/* COMPLETE */}
                  {r.status === "onroute" && (
                    <button
                      onClick={() => updateStatus(r.id, "completed")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-500"
                    >
                      Completed
                    </button>
                  )}

                  {/* DELETE */}
                  <button
                    onClick={() => deleteRequest(r.id)}
                    className="p-2 bg-gray-700 hover:bg-red-700 rounded-lg"
                  >
                    <FiTrash2 className="text-red-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ASSIGN MODAL */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Assign Mechanic</h2>

            <select
              value={selectedMechanic}
              onChange={(e) => setSelectedMechanic(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg mb-4"
            >
              <option value="">Select mechanic</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={assignMechanic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
