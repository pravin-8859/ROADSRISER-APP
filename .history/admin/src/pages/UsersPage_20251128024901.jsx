import React, { useEffect, useState } from "react";
import { FiSearch, FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Load users (API baad me connect kar denge)
  useEffect(() => {
    loadDummyUsers();
  }, []);

  function loadDummyUsers() {
    const dummy = [
      { id: 1, name: "Rahul Sharma", email: "rahul@mail.com", status: "active" },
      { id: 2, name: "Neha Gupta", email: "neha@mail.com", status: "blocked" },
      { id: 3, name: "Amit Kumar", email: "amit@mail.com", status: "active" },
      { id: 4, name: "Pooja Singh", email: "pooja@mail.com", status: "active" },
      { id: 5, name: "Rohan Das", email: "rohan@mail.com", status: "blocked" },
    ];
    setUsers(dummy);
    setFiltered(dummy);
  }

  // Search Handler
  useEffect(() => {
    let data = [...users];

    if (search.trim() !== "") {
      data = data.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "all") {
      data = data.filter((u) => u.status === filterType);
    }

    setFiltered(data);
  }, [search, filterType, users]);

  // Ban / Unban User
  function toggleStatus(id) {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u
    );
    setUsers(updated);
  }

  // Delete User
  function deleteUser(id) {
    setUsers(users.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users Management</h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl w-full sm:w-1/2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="blocked">Blocked Users</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  {user.status === "active" ? (
                    <span className="text-green-400">Active</span>
                  ) : (
                    <span className="text-red-400">Blocked</span>
                  )}
                </td>

                <td className="p-4 text-right flex items-center justify-end gap-3">

                  {/* Block / Unblock */}
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    {user.status === "active" ? (
                      <FiUserX className="text-red-400" />
                    ) : (
                      <FiUserCheck className="text-green-400" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 transition"
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
