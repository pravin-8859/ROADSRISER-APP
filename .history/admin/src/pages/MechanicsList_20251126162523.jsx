import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function MechanicsList(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ load(); }, []);
  const load = async ()=> {
    try { const res = await api.get("/mechanics"); setItems(res.data.mechanics || res.data); }
    catch(e){ console.error(e) }
  };

  return (
    <Layout>
      <div className="bg-white rounded p-4 shadow">
        <h3 className="mb-3 font-semibold">Mechanics</h3>
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Phone</th><th>Garage</th><th>Status</th></tr></thead>
          <tbody>
            {items.map(u=>(
              <tr key={u._id} className="border-t">
                <td>{u.name}</td><td>{u.phone}</td><td>{u.garageName}</td><td>{u.isVerified ? "Verified":"Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
