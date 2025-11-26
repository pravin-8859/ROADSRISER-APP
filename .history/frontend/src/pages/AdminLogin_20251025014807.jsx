import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form,setForm]=useState({email:"",password:""});

  const handleChange = e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      const res = await API.post("/admin/login",form);
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role","admin");
      alert(res.data.message);
      navigate("/admin/dashboard");
    }catch(err){
      alert(err.response?.data?.error||"Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" type="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400" required/>
          <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400" required/>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Login</button>
        </form>
      </div>
    </div>
  )
}
