import { useState } from "react";
import api from "../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/admin/login", form); // proxied
      localStorage.setItem("adminToken", res.data.accessToken);
      window.location.href = "/admin";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="mb-3 w-full p-2 border rounded"/>
        <input name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type="password" className="mb-3 w-full p-2 border rounded"/>
        <button className="w-full py-2 bg-indigo-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
