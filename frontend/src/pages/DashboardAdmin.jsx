import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin(){
  const navigate = useNavigate();
  const [pending,setPending] = useState([]);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if(!token || role!=="admin") navigate("/admin/login");
    fetchPending();
  },[]);

  const fetchPending = async ()=>{
    try{
      const res = await API.get("/admin/pending-mechanics");
      setPending(res.data);
    }catch(err){
      alert("Error fetching mechanics");
    }
  }

  const handleApprove = async (id)=>{
    try{
      await API.post(`/admin/approve/${id}`);
      alert("Approved!");
      fetchPending();
    }catch(err){ alert("Error approving"); }
  }

  const handleReject = async (id)=>{
    try{
      await API.post(`/admin/reject/${id}`);
      alert("Rejected!");
      fetchPending();
    }catch(err){ alert("Error rejecting"); }
  }

  const handleLogout = ()=>{ localStorage.clear(); navigate("/admin/login"); }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg mb-4 hover:bg-red-600 transition">Logout</button>
      <h3 className="text-xl font-semibold mb-2">Pending Mechanics:</h3>
      <div className="space-y-2">
        {pending.length===0?"No pending mechanics":pending.map(m=>(
          <div key={m._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <span>{m.name} - {m.shopName} ({m.email})</span>
            <div className="space-x-2">
              <button onClick={()=>handleApprove(m._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Approve</button>
              <button onClick={()=>handleReject(m._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
