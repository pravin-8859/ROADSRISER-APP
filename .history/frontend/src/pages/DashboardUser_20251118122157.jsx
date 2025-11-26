import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardUser() {
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if(!token || role!=="user") navigate("/user/login");
  },[navigate]);

  const handleLogout = ()=>{ localStorage.clear(); navigate("/user/login"); }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <h2 className="text-3xl font-bold mb-6">Welcome, User!</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
    </div>
  )
}
