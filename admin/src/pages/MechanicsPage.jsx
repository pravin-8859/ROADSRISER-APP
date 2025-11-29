import React, { useEffect, useState } from "react";
import { FiSearch, FiTrash2, FiCheckCircle, FiXCircle, FiShield } from "react-icons/fi";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Load mechanics (dummy)
  useEffect(() => {
    loadDummyMechanics();
  }, []);

  function loadDummyMechanics() {
    const dummy = [
      {
        id: 1,
        name: "Rakesh Auto Garage",
        phone: "9876543210",
        status: "verified",
        city: "Delhi",
      },
      {
        id: 2,
        name: "Sharma Motors",
        phone: "9988776655",
        status: "pending",
        city: "Mumbai",
      },
      {
        id: 3,
        name: "FastFix Mechanic",
        phone: "8877665544",
        status: "banned",
        city: "Noida",
      },
      {
        id: 4,
        name: "Speedy Auto Works",
        phone: "9012345678",
        status: "verified",
        city: "Bhopal",
      },
    ];

    setMechanics(dummy);
    setFiltered(dummy);
  }

  // Filtering logic
  useEffect(() => {
    let data = [...mechanics];

    if (search.trim() !== "") {
      data = data.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search)
      );
    }

    if (filterType !== "all") {
      data = data.filter((m) => m.status === filterType);
    }

    setFiltered(data);
  }, [search, filterType, mechanics]);

  // Verify / Unverify
  function toggleVerify(id) {
    const updated = mechanics.map((m) =>
      m.id === id
        ? {
            ...m,
            status: m.status === "verified" ? "pending" : "verified",
          }
        : m
    );
    setMechanics(updated);
  }

  // Ban / Unban
  function toggleBan(id) {
    const updated = mechanics.map((m) =>
      m.id === id
        ? {
            ...m,
            status: m.status === "banned" ? "pending" : "banned",
          }
        : m
    );
    setMechanics(updated);
  }

  // Delete mechanic
  function deleteMechanic(id) {
    setMechanics(mechanics.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mechanics Management</h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl w-full sm:w-1/2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search mechanics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* FILTER */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm"
        >
          <option value="all">All Mechanics</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No mechanics found.
                </td>
              </tr>
            )}

            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-gray-700">
                <td className="p-4">{m.name}</td>
                <td className="p-4">{m.phone}</td>
                <td className="p-4">{m.city}</td>

                <td className="p-4">
                  {m.status === "verified" && (
                    <span className="text-green-400 flex items-center gap-1">
                      <FiCheckCircle /> Verified
                    </span>
                  )}
                  {m.status === "pending" && (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <FiShield /> Pending
                    </span>
                  )}
                  {m.status === "banned" && (
                    <span className="text-red-400 flex items-center gap-1">
                      <FiXCircle /> Banned
                    </span>
                  )}
                </td>

                <td className="p-4 text-right flex items-center justify-end gap-3">

                  {/* VERIFY / UNVERIFY */}
                  <button
                    onClick={() => toggleVerify(m.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    <FiCheckCircle className="text-green-300" />
                  </button>

                  {/* BAN / UNBAN */}
                  <button
                    onClick={() => toggleBan(m.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 transition"
                  >
                    <FiXCircle className="text-red-300" />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteMechanic(m.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="text-red-300" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
