// src/pages/DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTool, FiFileText, FiLogOut } from "react-icons/fi";
import {
  getAdminStats, getUsers, getMechanics, getRequests,
  adminToggleUser, adminToggleMechanic, adminAssignRequest
} from "../api/adminApi";

function StatCard({ icon, title, value, change }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
        <div className="text-indigo-600 dark:text-indigo-300 text-2xl">{icon}</div>
      </div>
      {change && <div className="text-xs text-gray-500 mt-2">{change}</div>}
    </div>
  );
}

export default function DashboardAdmin() {
  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") nav("/admin/login");
  }, [nav]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("overview");
  const [page, setPage] = useState(1);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      setLoading(true);
      const s = await getAdminStats();
      const u = await getUsers({ q: "", limit: 10, page: 1 });
      const m = await getMechanics({ q: "", limit: 10, page: 1 });
      const r = await getRequests({ q: "", limit: 10, page: 1 });
      setStats(s || {});
      setUsers(u.users || u || []);
      setMechanics(m.mechanics || m || []);
      setRequests(r.requests || r || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data");
    } finally { setLoading(false); }
  }

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    nav("/admin/login");
  };

  const toggleUser = async (id, action) => {
    try {
      await adminToggleUser(id, action);
      alert(`${action} successful`);
      loadAll();
    } catch (e) { alert("Action failed"); }
  };
  const toggleMechanic = async (id, action) => {
    try {
      await adminToggleMechanic(id, action);
      alert(`${action} successful`);
      loadAll();
    } catch (e) { alert("Action failed"); }
  };
  const assignRequest = async (reqId) => {
    const mechId = prompt("Enter mechanic id to assign");
    if (!mechId) return;
    try {
      await adminAssignRequest(reqId, mechId);
      alert("Assigned");
      loadAll();
    } catch (e) { alert("Assign failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">RoadsRiser • Admin</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stats.uptime?.note || ""}</div>
          </div>
          <div className="flex items-center gap-3">
            <input placeholder="Search users/requests..." value={query} onChange={(e)=>setQuery(e.target.value)}
              className="hidden sm:block px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-700" />
            <button onClick={logout} className="px-3 py-2 rounded-md bg-red-600 text-white flex items-center gap-2">
              <FiLogOut/> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          {/* Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 sticky top-20">
            <nav className="space-y-2">
              <button onClick={()=>setTab("overview")} className={`w-full text-left px-3 py-2 rounded-md ${tab==="overview" ? "bg-indigo-600 text-white": "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>Overview</button>
              <button onClick={()=>setTab("users")} className={`w-full text-left px-3 py-2 rounded-md ${tab==="users" ? "bg-indigo-600 text-white": "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>Users</button>
              <button onClick={()=>setTab("mechanics")} className={`w-full text-left px-3 py-2 rounded-md ${tab==="mechanics" ? "bg-indigo-600 text-white": "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>Mechanics</button>
              <button onClick={()=>setTab("requests")} className={`w-full text-left px-3 py-2 rounded-md ${tab==="requests" ? "bg-indigo-600 text-white": "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>Requests</button>
              <button onClick={()=>setTab("reports")} className={`w-full text-left px-3 py-2 rounded-md ${tab==="reports" ? "bg-indigo-600 text-white": "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>Reports</button>
            </nav>
            <div className="mt-4 text-xs text-gray-500">Admin controls | live data</div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<FiUsers/>} title="Total Users" value={stats.totalUsers ?? 0}/>
                <StatCard icon={<FiTool/>} title="Total Mechanics" value={stats.totalMechanics ?? 0}/>
                <StatCard icon={<FiFileText/>} title="Open Requests" value={stats.openRequests ?? 0}/>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <ul className="space-y-2 text-sm">
                  {(stats.recentActivity || []).map((a, i) => (
                    <li key={i} className="flex justify-between">
                      <div>{a.text}</div>
                      <div className="text-gray-400 text-xs">{new Date(a.time).toLocaleString()}</div>
                    </li>
                  ))}
                  {!(stats.recentActivity || []).length && <li className="text-gray-500">No activity yet</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Users</h3>
                <div className="text-sm text-gray-500">Total: {users.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500">
                    <tr><th className="text-left py-2">Name</th><th>Email</th><th>Phone</th><th>Requests</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t dark:border-gray-700">
                        <td className="py-2">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>{u.requestCount ?? 0}</td>
                        <td>
                          <button onClick={()=>toggleUser(u._id, u.blocked ? "unblock" : "block")} className="px-2 py-1 mr-2 rounded-md border dark:border-gray-700">{u.blocked ? "Unblock":"Block"}</button>
                          <button onClick={()=>toggleUser(u._id,"delete")} className="px-2 py-1 rounded-md border dark:border-gray-700">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mechanics */}
          {tab === "mechanics" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Mechanics</h3>
                <div className="text-sm text-gray-500">Total: {mechanics.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500">
                    <tr><th className="text-left py-2">Name</th><th>Garage</th><th>Phone</th><th>Verified</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {mechanics.map(m => (
                      <tr key={m._id} className="border-t dark:border-gray-700">
                        <td className="py-2">{m.name}</td>
                        <td>{m.garageName}</td>
                        <td>{m.phone}</td>
                        <td>{m.verified ? "Yes" : "No"}</td>
                        <td>
                          <button onClick={()=>toggleMechanic(m._id, m.blocked ? "unblock":"block")} className="px-2 py-1 mr-2 rounded-md border dark:border-gray-700">{m.blocked ? "Unblock" : "Block"}</button>
                          {!m.verified && <button onClick={()=>toggleMechanic(m._id,"verify")} className="px-2 py-1 rounded-md border dark:border-gray-700">Verify</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requests */}
          {tab === "requests" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Requests</h3>
                <div className="text-sm text-gray-500">Total: {requests.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500">
                    <tr><th>Id</th><th>User</th><th>Issue</th><th>Location</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r._id} className="border-t dark:border-gray-700">
                        <td className="py-2">{r._id}</td>
                        <td>{r.user?.name || r.userEmail}</td>
                        <td>{r.issue}</td>
                        <td>{r.address}</td>
                        <td>{r.status}</td>
                        <td>
                          <button onClick={()=>assignRequest(r._id)} className="px-2 py-1 mr-2 rounded-md border dark:border-gray-700">Assign</button>
                          <button onClick={()=>alert("Open details (not implemented)")} className="px-2 py-1 rounded-md border dark:border-gray-700">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports (chart mock) */}
          {tab === "reports" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
              <h3 className="font-semibold mb-4">Revenue & Requests (last 7 days)</h3>
              <MiniAreaChart data={stats.revenue7 || []} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* --- small svg area chart component --- */
function MiniAreaChart({ data = [] }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data</div>;
  const w = 700, h = 160, pad = 12;
  const max = Math.max(...data.map(d => d.value)), min = Math.min(...data.map(d=>d.value));
  const scaleX = (i) => pad + (i / (data.length - 1)) * (w - pad*2);
  const scaleY = (v) => h - pad - ((v - min)/(max-min||1))*(h-pad*2);
  const path = data.map((p,i)=>`${i===0?"M":"L"} ${scaleX(i)} ${scaleY(p.value)}`).join(" ");
  const area = `${path} L ${w-pad} ${h-pad} L ${pad} ${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <path d={area} fill="rgba(99,102,241,0.12)" stroke="transparent" />
      <path d={path} stroke="currentColor" strokeWidth="2" fill="none" className="text-indigo-500" />
    </svg>
  );
}
