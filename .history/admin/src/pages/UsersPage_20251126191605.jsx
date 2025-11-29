import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

/**
 * Admin Users Page
 * - Expects these backend endpoints:
 *    GET  /admin/users?search=&page=&limit=
 *    GET  /admin/users/:id
 *    PATCH /admin/users/:id (body: { banned: true/false })
 *    DELETE /admin/users/:id
 *
 * If your backend uses different routes, change api calls accordingly.
 */

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [bulkExportLoading, setBulkExportLoading] = useState(false);

  // Debounce search locally (very small)
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, refreshFlag]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const q = new URLSearchParams();
      if (debouncedSearch) q.set("search", debouncedSearch);
      q.set("page", page);
      q.set("limit", limit);

      const res = await api.get(`/admin/users?${q.toString()}`);
      // expected: { users: [...], totalPages: N }
      setRows(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const openDetails = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/${id}`);
      setSelected(res.data.user);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  const toggleBan = async (id, currentlyBanned) => {
    if (!confirm(`Are you sure to ${currentlyBanned ? "unban" : "ban"} this user?`)) return;
    try {
      await api.patch(`/admin/users/${id}`, { banned: !currentlyBanned });
      alert(`${currentlyBanned ? "Unbanned" : "Banned"} successfully`);
      setRefreshFlag((s) => s + 1);
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const removeUser = async (id) => {
    if (!confirm("This will permanently delete the user. Continue?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      alert("Deleted");
      setRefreshFlag((s) => s + 1);
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const exportCSV = async () => {
    try {
      setBulkExportLoading(true);
      // export current page only (client-side)
      const csv = toCsv(rows);
      downloadBlob(csv, `users-page-${page}.csv`);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    } finally {
      setBulkExportLoading(false);
    }
  };

  const quickStats = useMemo(() => {
    const total = rows.length;
    const banned = rows.filter((r) => r.banned).length;
    const verified = rows.filter((r) => r.emailVerified).length;
    return { total, banned, verified };
  }, [rows]);

  return (
    <div className="ml-64 mt-20 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-500">Manage platform users — search, ban, delete & export.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 hidden sm:block">
            Page {page} / {totalPages}
          </div>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone..."
            className="px-3 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800"
          />
          <button
            onClick={() => { setSearch(""); setPage(1); }}
            className="px-3 py-2 rounded-md border dark:border-gray-700"
          >
            Clear
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white"
            disabled={bulkExportLoading}
          >
            {bulkExportLoading ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* quick mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Stat title="Shown" value={quickStats.total} />
        <Stat title="Banned" value={quickStats.banned} color="bg-red-600" />
        <Stat title="Verified" value={quickStats.verified} color="bg-green-600" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border dark:border-gray-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="7" className="p-6 text-center text-gray-500">Loading...</td></tr>
            )}

            {!loading && rows.length === 0 && (
              <tr><td colSpan="7" className="p-6 text-center text-gray-500">No users found.</td></tr>
            )}

            {!loading && rows.map((u, idx) => (
              <tr key={u._id} className="border-b dark:border-gray-800">
                <td className="px-4 py-3">{(page - 1) * limit + idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl(u)} alt="avatar" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium">{u.name || "—"}</div>
                      <div className="text-xs text-gray-500">{u.role || "user"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{u.email || "—"}</td>
                <td className="px-4 py-3">{u.phone || "—"}</td>
                <td className="px-4 py-3">{new Date(u.createdAt || u.createdAt || Date.now()).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {u.banned ? 'Banned' : u.emailVerified ? 'Active' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openDetails(u._id)} className="px-3 py-1 rounded-md border dark:border-gray-700">View</button>
                    <button onClick={() => toggleBan(u._id, !!u.banned)} className={`px-3 py-1 rounded-md ${u.banned ? 'bg-green-600 text-white' : 'border dark:border-gray-700'}`}>
                      {u.banned ? 'Unban' : 'Ban'}
                    </button>
                    <button onClick={() => removeUser(u._id)} className="px-3 py-1 rounded-md border dark:border-gray-700 text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
          <button className="px-3 py-1 border rounded" disabled={page>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      </div>

      {/* error */}
      {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

      {/* Details modal */}
      {selected && <UserModal user={selected} onClose={closeModal} onRefresh={()=>setRefreshFlag(s=>s+1)} /> }
    </div>
  );
}

/* ----------------------- Helper components ----------------------- */

function Stat({ title, value, color = "bg-gray-200" }) {
  return (
    <div className={`p-4 rounded-md ${color === "bg-gray-200" ? "bg-gray-50 dark:bg-gray-800" : color}`}>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function UserModal({ user, onClose, onRefresh }) {
  const [saving, setSaving] = useState(false);

  const toggleBan = async () => {
    if (!confirm(`Confirm ${user.banned ? "unban" : "ban"} for ${user.name || user.email}?`)) return;
    try {
      setSaving(true);
      await api.patch(`/admin/users/${user._id}`, { banned: !user.banned });
      alert("Updated");
      onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed");
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async () => {
    if (!confirm(`Delete ${user.name || user.email} permanently?`)) return;
    try {
      setSaving(true);
      await api.delete(`/admin/users/${user._id}`);
      alert("Deleted");
      onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl p-6 border dark:border-gray-700">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">User Details</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="col-span-1">
            <img src={avatarUrl(user)} alt="avatar" className="w-28 h-28 rounded-full" />
            <div className="mt-3">
              <div className="font-semibold">{user.name || "—"}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="text-xs text-gray-500">{user.phone || "—"}</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              <div><b>Joined:</b> {new Date(user.createdAt || Date.now()).toLocaleString()}</div>
              <div><b>Role:</b> {user.role || 'user'}</div>
              <div><b>Verified:</b> {user.emailVerified ? 'Yes' : 'No'}</div>
              <div><b>Banned:</b> {user.banned ? 'Yes' : 'No'}</div>
            </div>

            <div className="mt-4">
              <b>Address</b>
              <div className="text-sm text-gray-500">{user.address || "—"}</div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={toggleBan} className="px-4 py-2 rounded-md border dark:border-gray-700">
                {saving ? "Saving..." : user.banned ? "Unban" : "Ban"}
              </button>
              <button onClick={removeUser} className="px-4 py-2 rounded-md border dark:border-gray-700 text-red-600">
                {saving ? "Deleting..." : "Delete"}
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-md border dark:border-gray-700">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Utilities ----------------------- */

function toCsv(arr) {
  if (!arr || arr.length === 0) return "";
  const cols = ["name","email","phone","createdAt","banned","emailVerified","role"];
  const header = cols.join(",") + "\n";
  const body = arr.map((r) => cols.map(c => csvSafe(r[c])).join(",")).join("\n");
  return header + body;
  function csvSafe(v) {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  }
}

function downloadBlob(text, filename) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function avatarUrl(user) {
  const seed = encodeURIComponent(user?.email || user?.name || Math.random().toString(36).slice(2,8));
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${seed}`;
}

function useDebounce(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
