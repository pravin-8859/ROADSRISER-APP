import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function UsersList(){
  const [users, setUsers] = useState([]);
  useEffect(()=>{ load(); }, []);
  const load = async ()=> {
    try { const res = await api.get("/users"); setUsers(res.data.users || res.data); }
    catch(e){ console.error(e) }
  };

  const blockUnblock = async (id, blocked) => {
    try {
      await api.post(`/users/${id}/block`, { blocked: !blocked });
      load();
    } catch(e){ alert("Action failed") }
  };

  return (
    <Layout>
      <div className="bg-white rounded p-4 shadow">
        <h3 className="mb-3 font-semibold">Users</h3>
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id} className="border-t">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="text-right">
                  <button onClick={()=>blockUnblock(u._id,u.blocked)} className="px-3 py-1 bg-indigo-600 text-white rounded"> {u.blocked ? "Unblock":"Block"} </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
