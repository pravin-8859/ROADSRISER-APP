import React, { useEffect, useState } from "react";
import Layout from "../components/AdminLayout";
import api from "../services/api";

export default function Requests(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ load(); }, []);
  const load = async ()=> {
    try { const res = await api.get("/requests"); setItems(res.data.requests || res.data); }
    catch(e){ console.error(e) }
  };

  const changeStatus = async (id, status) => {
    try { await api.post(`/requests/${id}/status`, { status }); load(); }
    catch(e){ alert("Failed"); }
  };

  return (
    <Layout>
      <div className="bg-white rounded p-4 shadow">
        <h3 className="mb-3 font-semibold">Requests</h3>
        <div className="space-y-2">
          {items.map(r=>(
            <div key={r._id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">{r.userName} • {r.issue}</div>
                <div className="text-xs text-gray-500">{r.address}</div>
              </div>
              <div className="flex gap-2">
                <select defaultValue={r.status} onChange={(e)=>changeStatus(r._id,e.target.value)} className="px-2 py-1 border rounded">
                  <option>Open</option><option>Assigned</option><option>Completed</option><option>Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
