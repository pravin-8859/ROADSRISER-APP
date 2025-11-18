import React, { useState, useEffect, useRef } from "react";

/*
DashboardMechanicFull.jsx
Mechanic Dashboard (FULL VERSION)
Navbar/Header COMPLETELY REMOVED as per your request
NO OTHER CHANGES DONE
*/

export default function DashboardMechanicFull() {
  const [dark, setDark] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [requests, setRequests] = useState(sampleRequests());
  const [assignedJobs, setAssignedJobs] = useState(sampleAssigned());
  const [inventory, setInventory] = useState(sampleInventory());
  const [earnings, setEarnings] = useState(sampleEarnings());
  const [profile, setProfile] = useState(sampleProfile());
  const [reviews, setReviews] = useState(sampleReviews());
  const [available, setAvailable] = useState(true);

  const [mechanicPos, setMechanicPos] = useState({ lat: 18.5204, lng: 73.8567 });

  const [toasts, setToasts] = useState([]);
  const [chats, setChats] = useState({});

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const id = setInterval(() => {
      const r = makeRandomRequest();
      setRequests((p) => [r, ...p]);
      notify(`New request: ${r.issue} • ${r.distance}`, r.sos ? "high" : "normal");
      if (r.sos) playBeep(880, 0.3);
    }, 25000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setMechanicPos((pos) => {
        if (assignedJobs.length === 0) return pos;
        const target = geoFromAddress(assignedJobs[0].location);
        const next = moveTowards(pos, target, 0.01);
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [assignedJobs]);

  useEffect(() => {
    const limit = 6;
    if (assignedJobs.length >= limit && available) {
      setAvailable(false);
      notify("You have too many active jobs — auto switched to Unavailable", "warn");
    }
  }, [assignedJobs]);

  function acceptRequest(id) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;

    setRequests((p) => p.filter((x) => x.id !== id));

    const job = {
      ...req,
      status: "Assigned",
      assignedAt: new Date().toISOString(),
      timeline: [{ status: "Assigned", time: new Date().toISOString() }],
    };

    setAssignedJobs((p) => [job, ...p]);
    notify(`Accepted ${req.customer} — ${req.issue}`);

    setChats((c) => ({
      ...c,
      [job.id]: [
        { from: "customer", text: "Please hurry!", time: new Date().toISOString() },
      ],
    }));

    playBeep(600, 0.12);
  }

  function updateJobStatus(jobId, status) {
    setAssignedJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              timeline: [...j.timeline, { status, time: new Date().toISOString() }],
            }
          : j
      )
    );
    notify(`Job ${jobId} updated: ${status}`);
  }

  function completeJob(jobId) {
    const job = assignedJobs.find((j) => j.id === jobId);
    if (!job) return;

    setEarnings((e) => [
      { date: new Date().toISOString().slice(0, 10), value: job.estimatedCharge || 1200 },
      ...e,
    ]);

    setAssignedJobs((p) => p.filter((j) => j.id !== jobId));
    notify(`Completed job for ${job.customer}`);
  }

  function sendMessage(jobId, text, from = "mechanic") {
    setChats((c) => {
      const prev = c[jobId] || [];
      return {
        ...c,
        [jobId]: [...prev, { from, text, time: new Date().toISOString() }],
      };
    });
  }

  function addInventory(part) {
    setInventory((p) => [{ ...part, id: nextId(p) }, ...p]);
    notify(`Added part ${part.name}`);
  }

  function editInventory(id, data) {
    setInventory((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  }

  function removeInventory(id) {
    setInventory((p) => p.filter((x) => x.id !== id));
  }

  function saveProfile(data) {
    setProfile(data);
    notify("Profile updated");
  }

  function addReview(r) {
    setReviews((p) => [r, ...p]);
    notify("Review added!");
  }

  function openInvoice(job) {
    const html = buildInvoiceHtml(profile, job);
    const w = window.open("", "_blank");
    if (!w) {
      notify("Popup blocked — enable popups", "warn");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  function notify(text, level = "normal") {
    const id = Date.now();
    setToasts((t) => [{ id, text, level }, ...t].slice(0, 6));
  }

  function lowStockCount() {
    return inventory.filter((i) => i.qty < 3).length;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-200">

      {/* MAIN GRID LAYOUT WITHOUT NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="space-y-3 sticky top-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border dark:border-gray-700 shadow">

              {[
                "Dashboard",
                "Active Requests",
                "Assigned Jobs",
                "Parts Inventory",
                "Earnings",
                "Profile & Settings",
                "Ratings & Reviews",
                "Help",
              ].map((it) => (
                <div
                  key={it}
                  onClick={() => setActiveMenu(it)}
                  className={`px-3 py-2 rounded-md text-sm mb-1 cursor-pointer ${
                    activeMenu === it
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-400 font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{it}</span>
                    {it === "Parts Inventory" && lowStockCount() > 0 && (
                      <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                        {lowStockCount()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border dark:border-gray-700 shadow">
              <div className="text-xs text-gray-500">Garage Status</div>
              <div className="mt-2 font-medium">
                {available ? "Open" : "Unavailable"} •{" "}
                <span
                  className={`${
                    available
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {available ? "Accepting requests" : "Not accepting"}
                </span>
              </div>
              <button
                onClick={() => setAvailable((s) => !s)}
                className="mt-3 w-full py-2 rounded-md border dark:border-gray-700 text-sm"
              >
                Toggle Availability
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">

          {activeMenu === "Dashboard" && (
            <PageDashboard
              requests={requests}
              assignedJobs={assignedJobs}
              mechanicPos={mechanicPos}
            />
          )}

          {activeMenu === "Active Requests" && (
            <PageActiveRequests
              requests={requests}
              onAccept={acceptRequest}
              onIgnore={(id) => setRequests((p) => p.filter((r) => r.id !== id))}
            />
          )}

          {activeMenu === "Assigned Jobs" && (
            <PageAssignedJobs
              jobs={assignedJobs}
              updateStatus={updateJobStatus}
              completeJob={completeJob}
              chats={chats}
              sendMessage={sendMessage}
              openInvoice={openInvoice}
            />
          )}

          {activeMenu === "Parts Inventory" && (
            <PageInventory
              items={inventory}
              addItem={addInventory}
              editItem={editInventory}
              deleteItem={removeInventory}
            />
          )}

          {activeMenu === "Earnings" && <PageEarnings earnings={earnings} />}

          {activeMenu === "Profile & Settings" && (
            <PageProfile profile={profile} onSave={saveProfile} />
          )}

          {activeMenu === "Ratings & Reviews" && (
            <PageReviews reviews={reviews} addReview={addReview} />
          )}

          {activeMenu === "Help" && <PageHelp />}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* NOTIFICATIONS */}
      <Toasts
        toasts={toasts}
        onClose={(id) =>
          setToasts((t) => t.filter((x) => x.id !== id))
        }
      />
    </div>
  );
}

// -------- ALL SUBCOMPONENTS BELOW (UNCHANGED) --------
// (Same as your original file — no editing done)

function PageDashboard({ requests, assignedJobs, mechanicPos }) {
  const stats = [
    { title: "Today Requests", value: requests.length },
    { title: "Assigned", value: assignedJobs.length },
    { title: "Rating", value: "4.7/5" },
    {
      title: "Tyre/Battery Issues",
      value: inventoryLowCountFromRequests(requests),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700"
          >
            <div className="text-xs text-gray-500">{s.title}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Nearby Requests</h3>
            <div className="text-sm text-gray-500">Sort: Priority</div>
          </div>

          <ul className="space-y-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className={`p-3 border rounded-md flex justify-between dark:border-gray-700 ${
                  r.sos ? "border-red-500 bg-red-50 dark:bg-red-900/30" : ""
                }`}
              >
                <div>
                  <div className="font-medium">
                    {r.customer}{" "}
                    <span className="text-xs text-gray-500">• {r.location}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {r.issue} • {r.distance}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      r.sos
                        ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    }`}
                  >
                    {r.sos ? "SOS" : "Open"}
                  </div>
                  <button className="px-3 py-1 rounded-md border dark:border-gray-700">
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
          <h4 className="text-sm text-gray-500">Live Map (simulated)</h4>
          <div className="mt-2 h-40 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-400">
            Mechanic at {mechanicPos.lat.toFixed(3)}, {mechanicPos.lng.toFixed(3)}
            <div className="text-xs mt-2">
              Use Google Maps / Mapbox API for real tracking
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PageActiveRequests({ requests, onAccept, onIgnore }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Active Requests</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <ul className="space-y-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className={`p-3 border rounded-md flex justify-between items-center dark:border-gray-700 ${
                r.sos ? "bg-red-50 dark:bg-red-900/30" : ""
              }`}
            >
              <div>
                <div className="font-medium">
                  {r.customer} <span className="text-xs text-gray-500">({r.phone})</span>
                </div>
                <div className="text-sm text-gray-500">
                  {r.issue} • {r.location} • {r.distance}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded-md border dark:border-gray-700"
                  onClick={() => onAccept(r.id)}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 rounded-md border dark:border-gray-700"
                  onClick={() => onIgnore(r.id)}
                >
                  Ignore
                </button>
              </div>
            </li>
          ))}

          {requests.length === 0 && (
            <div className="text-gray-500">No active requests.</div>
          )}
        </ul>
      </div>
    </div>
  );
}

function PageAssignedJobs({
  jobs,
  updateStatus,
  completeJob,
  chats,
  sendMessage,
  openInvoice,
}) {
  const [activeJob, setActiveJob] = useState(jobs[0]?.id || null);

  useEffect(() => {
    if (!activeJob && jobs[0]) setActiveJob(jobs[0].id);
  }, [jobs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <h3 className="font-semibold mb-3">Assigned Jobs</h3>

        <ul className="space-y-3">
          {jobs.map((j) => (
            <li
              key={j.id}
              className={`p-3 border rounded-md cursor-pointer dark:border-gray-700 ${
                activeJob === j.id ? "ring-2 ring-indigo-400" : ""
              }`}
              onClick={() => setActiveJob(j.id)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{j.customer}</div>
                  <div className="text-sm text-gray-500">
                    {j.issue} • {j.location} • {j.distance}
                  </div>
                </div>
                <div className="text-sm">{j.status}</div>
              </div>
            </li>
          ))}

          {jobs.length === 0 && (
            <div className="text-gray-500">No assigned jobs.</div>
          )}
        </ul>
      </div>

      <aside className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        {activeJob ? (
          <JobDetail
            job={jobs.find((x) => x.id === activeJob)}
            updateStatus={updateStatus}
            completeJob={completeJob}
            chat={chats[activeJob] || []}
            sendMessage={(txt) => sendMessage(activeJob, txt)}
            openInvoice={() =>
              openInvoice(jobs.find((x) => x.id === activeJob))
            }
          />
        ) : (
          <div className="text-gray-500">Select a job to view details</div>
        )}
      </aside>
    </div>
  );
}

function JobDetail({
  job,
  updateStatus,
  completeJob,
  chat,
  sendMessage,
  openInvoice,
}) {
  const [msg, setMsg] = useState("");

  if (!job) return null;

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{job.customer}</div>
          <div className="text-sm text-gray-500">{job.issue} • {job.location}</div>
        </div>
        <div className="text-sm">
          Status: <strong>{job.status}</strong>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {job.status !== "On my way" && (
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={() => updateStatus(job.id, "On my way")}
          >
            On my way
          </button>
        )}
        {job.status !== "Reached" && (
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={() => updateStatus(job.id, "Reached")}
          >
            Reached
          </button>
        )}
        {job.status !== "Fixing" && (
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={() => updateStatus(job.id, "Fixing")}
          >
            Fixing
          </button>
        )}

        <button
          className="px-3 py-1 rounded-md border dark:border-gray-700"
          onClick={() => completeJob(job.id)}
        >
          Complete
        </button>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium">Chat</div>
        <div className="mt-2 border rounded-md p-2 h-36 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`mb-2 ${m.from === "mechanic" ? "text-right" : ""}`}
            >
              <div
                className={`inline-block px-3 py-1 rounded ${
                  m.from === "mechanic"
                    ? "bg-indigo-200 dark:bg-indigo-700"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 px-2 py-1 rounded-md border dark:border-gray-700"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type..."
          />
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={() => {
              if (msg.trim()) {
                sendMessage(msg.trim());
                setMsg("");
              }
            }}
          >
            Send
          </button>
        </div>

        <div className="mt-3 text-right">
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={openInvoice}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function PageInventory({ items, addItem, editItem, deleteItem }) {
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Parts Inventory</h2>
        <button
          className="px-3 py-1 rounded-md border dark:border-gray-700"
          onClick={() => {
            setEditing(null);
            setShow(true);
          }}
        >
          Add Part
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-2">Name</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t dark:border-gray-700">
                <td className="py-2">{it.name}</td>
                <td>{it.sku}</td>
                <td>
                  {it.qty}{" "}
                  {it.qty < 3 && (
                    <span className="text-xs text-red-500 ml-2">Low</span>
                  )}
                </td>
                <td>₹{it.price}</td>
                <td className="text-right">
                  <button
                    className="px-2 py-1 mr-2 rounded-md border dark:border-gray-700"
                    onClick={() => {
                      setEditing(it);
                      setShow(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-2 py-1 rounded-md border dark:border-gray-700"
                    onClick={() => deleteItem(it.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <InventoryModal
          initial={editing}
          onClose={() => setShow(false)}
          onSave={(data) => {
            if (editing) editItem(editing.id, data);
            else addItem(data);
            setShow(false);
          }}
        />
      )}
    </div>
  );
}

function InventoryModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || { name: "", sku: "", qty: 1, price: 0 }
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-md border dark:border-gray-700">
        <h3 className="font-semibold mb-2">
          {initial ? "Edit Part" : "Add Part"}
        </h3>

        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />

          <div className="flex gap-2">
            <input
              type="number"
              className="flex-1 px-3 py-2 rounded-md border dark:border-gray-700"
              placeholder="Qty"
              value={form.qty}
              onChange={(e) =>
                setForm({ ...form, qty: Number(e.target.value) })
              }
            />

            <input
              type="number"
              className="flex-1 px-3 py-2 rounded-md border dark:border-gray-700"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded-md border dark:border-gray-700"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function PageEarnings({ earnings }) {
  const total = earnings.reduce((s, e) => s + e.value, 0);
  const avg = Math.round(total / (earnings.length || 1));

  const points = earnings.slice(0, 7).reverse();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Earnings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3">
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-semibold text-lg">₹{total}</div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3">
            <div className="text-xs text-gray-500">Avg</div>
            <div className="font-semibold text-lg">₹{avg}</div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-3">
            <div className="text-xs text-gray-500">Count</div>
            <div className="font-semibold text-lg">{earnings.length}</div>
          </div>
        </div>

        <div className="mt-4">
          <MiniLineChart data={points} />
        </div>
      </div>
    </div>
  );
}

function MiniLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const w = 300,
    h = 80,
    pad = 8;
  const max = Math.max(...values),
    min = Math.min(...values);

  const scaleX = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const scaleY = (v) =>
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);

  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="w-full">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-indigo-500"
      />
    </svg>
  );
}

function PageProfile({ profile, onSave }) {
  const [form, setForm] = useState(profile);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Profile & Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Name</label>
          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700 mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm">Garage</label>
          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700 mt-1"
            value={form.garage}
            onChange={(e) => setForm({ ...form, garage: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm">Phone</label>
          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700 mt-1"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm">Address</label>
          <input
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700 mt-1"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 rounded-md border dark:border-gray-700"
          onClick={() => setForm(profile)}
        >
          Reset
        </button>

        <button
          className="px-3 py-1 rounded-md border dark:border-gray-700"
          onClick={() => onSave(form)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function PageReviews({ reviews, addReview }) {
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ratings & Reviews</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input
            className="px-3 py-2 rounded-md border dark:border-gray-700"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="px-3 py-2 rounded-md border dark:border-gray-700"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r}>{r} stars</option>
            ))}
          </select>

          <button
            className="px-4 py-2 rounded-md border dark:border-gray-700"
            onClick={() => {
              if (form.name && form.text) {
                addReview({ ...form, date: new Date().toISOString() });
                setForm({ name: "", rating: 5, text: "" });
              }
            }}
          >
            Submit
          </button>
        </div>

        <textarea
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700"
          placeholder="Write review..."
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />

        <ul className="mt-4 space-y-3">
          {reviews.map((r, i) => (
            <li
              key={i}
              className="border rounded-md p-3 dark:border-gray-700"
            >
              <div className="flex justify-between">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-gray-500">
                  {r.rating}★ • {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">{r.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PageHelp() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Help & FAQ</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border dark:border-gray-700">
        <p className="mb-2">
          <strong>How to accept requests?</strong>
          <br />
          Open Active Requests and click Accept.
        </p>

        <p className="mb-2">
          <strong>How to invoice?</strong>
          <br />
          Open Assigned Jobs → Generate Invoice.
        </p>

        <p className="mb-2">
          <strong>How to chat?</strong>
          <br />
          Use the chat panel inside each job.
        </p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-3 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} RoadsRiser • Mechanic Dashboard
    </footer>
  );
}

function Toasts({ toasts, onClose }) {
  return (
    <div className="fixed right-4 bottom-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3 shadow"
        >
          <div className="flex justify-between gap-2">
            <div className="text-sm">{t.text}</div>
            <button
              className="text-xs text-gray-500"
              onClick={() => onClose(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------- UTILITIES -----------------

function playBeep(freq = 440, duration = 0.2) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();

    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    setTimeout(() => o.stop(), duration * 1000);
  } catch (e) {}
}

function geoFromAddress(addr) {
  const hash = Array.from(addr).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return { lat: 18.5 + ((hash % 100) / 100), lng: 73.8 + ((hash % 100) / 100) };
}

function moveTowards(from, to, step = 0.01) {
  const dx = to.lng - from.lng;
  const dy = to.lat - from.lat;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < step) return to;
  return {
    lng: from.lng + (dx / dist) * step,
    lat: from.lat + (dy / dist) * step,
  };
}

function nextId(arr) {
  return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
}

function inventoryLowCountFromRequests(reqs) {
  return reqs.filter((r) =>
    ["battery", "tyre"].some((w) => r.issue.toLowerCase().includes(w))
  ).length;
}

function buildInvoiceHtml(profile, job) {
  const items = [
    { name: "Service charge", qty: 1, price: 500 },
    { name: "Parts", qty: 1, price: job.estimatedCharge || 700 },
  ];

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

  return `
  <html>
    <head>
      <title>Invoice - ${job.customer}</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #ccc; padding: 8px; }
      </style>
    </head>
    <body>
      <h2>RoadsRiser - Invoice</h2>

      <p><b>Garage:</b> ${profile.garage}</p>
      <p><b>Customer:</b> ${job.customer}</p>
      <p><b>Location:</b> ${job.location}</p>

      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${items
            .map(
              (it) =>
                `<tr><td>${it.name}</td><td>${it.qty}</td><td>₹${it.price}</td><td>₹${
                  it.qty * it.price
                }</td></tr>`
            )
            .join("")}
          <tr><td colspan="3" align="right"><b>Total</b></td><td><b>₹${total}</b></td></tr>
        </tbody>
      </table>

      <p style="margin-top:20px;">Generated: ${new Date().toLocaleString()}</p>

      <button onclick="window.print()">Print / Save as PDF</button>
    </body>
  </html>`;
}

// ---------------- SAMPLE DATA ----------------

function sampleRequests() {
  return [
    {
      id: 1,
      customer: "Rahul Sharma",
      phone: "+91-98765",
      issue: "Flat tyre",
      distance: "2.4 km",
      status: "Open",
      location: "MG Road, Pune",
      requestedAt: new Date().toISOString(),
      sos: false,
      estimatedCharge: 900,
    },
    {
      id: 2,
      customer: "Sonal Gupta",
      phone: "+91-91234",
      issue: "Battery dead",
      distance: "4.1 km",
      status: "Open",
      location: "Kothrud, Pune",
      requestedAt: new Date().toISOString(),
      sos: true,
      estimatedCharge: 1200,
    },
  ];
}

function sampleAssigned() {
  return [
    {
      id: 201,
      customer: "Aman Verma",
      phone: "+91-99887",
      issue: "Engine overheating",
      distance: "6.8 km",
      status: "On my way",
      location: "Baner, Pune",
      assignedAt: new Date().toISOString(),
      timeline: [{ status: "Assigned", time: new Date().toISOString() }],
      estimatedCharge: 1500,
    },
  ];
}

function sampleInventory() {
  return [
    { id: 1, name: "Tyre (Basic)", sku: "TYR-B", qty: 12, price: 1200 },
    { id: 2, name: "Car Battery 12V", sku: "BAT-12V", qty: 2, price: 3500 },
    { id: 3, name: "Brake Pad", sku: "BRK-P", qty: 1, price: 400 },
  ];
}

function sampleEarnings() {
  return [
    { date: "2025-11-09", value: 1200 },
    { date: "2025-11-10", value: 2200 },
    { date: "2025-11-11", value: 900 },
    { date: "2025-11-12", value: 1600 },
    { date: "2025-11-13", value: 2000 },
    { date: "2025-11-14", value: 800 },
    { date: "2025-11-15", value: 1500 },
  ];
}

function sampleProfile() {
  return {
    name: "Arjun Mech",
    garage: "QuickFix Garage",
    phone: "+91-98765",
    address: "MG Road, Pune",
  };
}

function sampleReviews() {
  return [
    {
      name: "Sonal",
      rating: 5,
      text: "Quick and professional!",
      date: new Date().toISOString(),
    },
  ];
}

function makeRandomRequest() {
  const customers = ["Vikas", "Neha", "Karan", "Meena", "Pooja"];
  const issues = ["Flat tyre", "Battery dead", "Overheating", "Brake issue", "Fuel leak"];
  const locs = ["Wakad", "Kharadi", "Baner", "Kothrud", "MG Road"];

  const i = Math.floor(Math.random() * customers.length);
  const sos = Math.random() < 0.15;

  return {
    id: Date.now(),
    customer: customers[i],
    phone: "+91-" + Math.floor(900000000 + Math.random() * 99999999),
    issue: issues[Math.floor(Math.random() * issues.length)],
    distance: (Math.random() * 10).toFixed(1) + " km",
    status: "Open",
    location: locs[Math.floor(Math.random() * locs.length)] + ", Pune",
    requestedAt: new Date().toISOString(),
    sos,
    estimatedCharge: Math.floor(500 + Math.random() * 2000),
  };
}
