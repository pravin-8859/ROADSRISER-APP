import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

/**
 * Mechanics Management (Admin)
 *
 * Expected backend endpoints:
 *  GET  /admin/mechanics?search=&page=&limit=
 *  GET  /admin/mechanics/:id
 *  PATCH /admin/mechanics/:id    (body e.g. { approved: true } or { banned: true })
 *  DELETE /admin/mechanics/:id
 *
 * Adjust the API paths if your backend uses other routes.
 */

export default function MechanicsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [exporting, setExporting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    loadMechanics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, refreshFlag]);

  async function loadMechanics() {
    try {
      setLoading(true);
      setError("");
      const q = new URLSearchParams();
      if (debouncedSearch) q.set("search", debouncedSearch);
      q.set("page", page);
      q.set("limit", limit);
      const res = await api.get(`/admin/mechanics?${q.toString()}`);
      setRows(res.data.mechanics || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
      setError("Failed to load mechanics");
    } finally {
      setLoading(false);
    }
  }

  const openDetails = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/mechanics/${id}`);
      setSelected(res.data.mechanic);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch mechanic");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  const toggleBan = async (id, currentlyBanned) => {
    if (!confirm(`Are you sure to ${currentlyBanned ? "unban" : "ban"} this mechanic?`)) return;
    try {
      await api.patch(`/admin/mechanics/${id}`, { banned: !currentlyBanned });
      alert(`${currentlyBanned ? "Unbanned" : "Banned"} successfully`);
      setRefreshFlag((s) => s + 1);
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const toggleApprove = async (id, currentlyApproved) => {
    if (!confirm(`${currentlyApproved ? "Revoke approval?" : "Approve this mechanic?"}`)) return;
    try {
      await api.patch(`/admin/mechanics/${id}`, { approved: !currentlyApproved });
      alert(`${currentlyApproved ? "Approval revoked" : "Approved"} successfully`);
      setRefreshFlag((s) => s + 1);
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const removeMechanic = async (id) => {
    if (!confirm("This will permanently delete the mechanic. Continue?")) return;
    try {
      await api.delete(`/admin/mechanics/${id}`);
      alert("Deleted");
      setRefreshFlag((s) => s + 1);
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const exportCSV = async () => {
    try {
      setExporting(true);
      const csv = toCsv(rows);
      downloadBlob(csv, `mechanics-page-${page}.csv`);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const quickStats = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter((r) => r.approved).length;
    const banned = rows.filter((r) => r.banned).length;
    return { total, approved, banned };
  }, [rows]);

  return (
    <div className="ml-64 mt-20 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Mechanics</h1>
          <p className="text-sm text-gray-500">Approve, verify, ban or remove mechanics.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 hidden sm:block">Page {page} / {totalPages}</div>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, garage or GST..."
            className="px-3 py-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-800"
          />
          <button onClick={() => { setSearch(""); setPage(1); }} className="px-3 py-2 rounded-md border dark:border-gray-700">Clear</button>
          <button onClick={exportCSV} className="px-3 py-2 rounded-md bg-indigo-600 text-white" disabled={exporting}>
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SmallStat title="Shown" value={quickStats.total} />
        <SmallStat title="Approved" value={quickStats.approved} color="bg-green-600" />
        <SmallStat title="Banned" value={quickStats.banned} color="bg-red-600" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border dark:border-gray-700 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Mechanic</th>
              <th className="px-4 py-3">Garage</th>
              <th className="px-4 py-3">Phone / GST</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="7" className="p-6 text-center text-gray-500">Loading...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-gray-500">No mechanics found.</td></tr>}
            {!loading && rows.map((m, idx) => (
              <tr key={m._id} className="border-b dark:border-gray-800">
                <td className="px-4 py-3">{(page - 1) * limit + idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl(m)} alt="avatar" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium">{m.name || "—"}</div>
                      <div className="text-xs text-gray-500">{m.email || "—"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{m.garageName || "—"}</td>
                <td className="px-4 py-3">{m.phone || "—"} <div className="text-xs text-gray-500">{m.gst || "-"}</div></td>
                <td className="px-4 py-3">{new Date(m.createdAt || Date.now()).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${m.banned ? 'bg-red-100 text-red-700' : m.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {m.banned ? 'Banned' : m.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openDetails(m._id)} className="px-3 py-1 rounded-md border dark:border-gray-700">View</button>
                    <button onClick={() => toggleApprove(m._id, !!m.approved)} className={`px-3 py-1 rounded-md ${m.approved ? 'bg-gray-200' : 'bg-green-600 text-white'}`}>
                      {m.approved ? 'Revoke' : 'Approve'}
                    </button>
                    <button onClick={() => toggleBan(m._id, !!m.banned)} className={`px-3 py-1 rounded-md ${m.banned ? 'bg-green-600 text-white' : 'border dark:border-gray-700'}`}>
                      {m.banned ? 'Unban' : 'Ban'}
                    </button>
                    <button onClick={() => removeMechanic(m._id)} className="px-3 py-1 rounded-md border dark:border-gray-700 text-red-600">Delete</button>
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

      {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

      {selected && <MechanicModal mechanic={selected} onClose={closeModal} onRefresh={() => setRefreshFlag(s => s + 1)} />}
    </div>
  );
}

/* ------------------ small components ------------------ */

function SmallStat({ title, value, color = "bg-gray-50" }) {
  return (
    <div className={`p-4 rounded-md ${color === "bg-gray-50" ? "bg-gray-50 dark:bg-gray-800" : color}`}>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function MechanicModal({ mechanic, onClose, onRefresh }) {
  const [saving, setSaving] = useState(false);

  const toggleApprove = async () => {
    if (!confirm(`${mechanic.approved ? "Revoke approval?" : "Approve mechanic?"}`)) return;
    try {
      setSaving(true);
      await api.patch(`/admin/mechanics/${mechanic._id}`, { approved: !mechanic.approved });
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

  const toggleBan = async () => {
    if (!confirm(`${mechanic.banned ? "Unban mechanic?" : "Ban mechanic?"}`)) return;
    try {
      setSaving(true);
      await api.patch(`/admin/mechanics/${mechanic._id}`, { banned: !mechanic.banned });
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

  const remove = async () => {
    if (!confirm("Delete permanently?")) return;
    try {
      setSaving(true);
      await api.delete(`/admin/mechanics/${mechanic._id}`);
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
          <h3 className="text-xl font-semibold">{mechanic.name || "Mechanic"}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <img src={avatarUrl(mechanic)} alt="avatar" className="w-28 h-28 rounded-full" />
            <div className="mt-3">
              <div className="font-semibold">{mechanic.garageName || "-"}</div>
              <div className="text-xs text-gray-500">{mechanic.phone || "-"}</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              <div><b>GST:</b> {mechanic.gst || "-"}</div>
              <div><b>Approved:</b> {mechanic.approved ? "Yes" : "No"}</div>
              <div><b>Banned:</b> {mechanic.banned ? "Yes" : "No"}</div>
              <div><b>Joined:</b> {new Date(mechanic.createdAt || Date.now()).toLocaleString()}</div>
            </div>

            <div className="mt-3">
              <b>Address</b>
              <div className="text-sm text-gray-500">{mechanic.address || "-"}</div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button onClick={toggleApprove} className="px-4 py-2 rounded-md border dark:border-gray-700">
                {saving ? "Saving..." : mechanic.approved ? "Revoke" : "Approve"}
              </button>
              <button onClick={toggleBan} className="px-4 py-2 rounded-md border dark:border-gray-700">
                {saving ? "Saving..." : mechanic.banned ? "Unban" : "Ban"}
              </button>
              <button onClick={remove} className="px-4 py-2 rounded-md border dark:border-gray-700 text-red-600">
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- utilities ----------------- */

function toCsv(arr) {
  if (!arr || arr.length === 0) return "";
  const cols = ["name","email","phone","garageName","gst","createdAt","approved","banned"];
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

function avatarUrl(u) {
  const seed = encodeURIComponent(u?.email || u?.name || Math.random().toString(36).slice(2,8));
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
