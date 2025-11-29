import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      const res = await api.post("/admin/login", { email, password });
      // backend earlier in sample returned accessToken
      const token = res.data?.accessToken || res.data?.token || res.data?.access_token;
      if (!token) throw new Error("No token in response");
      localStorage.setItem("adminToken", token);
      nav("/admin");
    } catch (error) {
      setErr(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {err && <div className="text-red-500 mb-2">{err}</div>}
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 px-3 py-2 border rounded" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full mb-4 px-3 py-2 border rounded" />
        <button className="w-full py-2 rounded bg-indigo-600 text-white">Login</button>
      </form>
    </div>
  );
}
