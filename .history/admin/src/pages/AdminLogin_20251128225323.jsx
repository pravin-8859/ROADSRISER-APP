import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Simple admin login that calls POST /admin/login
 * On success: stores admin_token + admin_name
 */
export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handle = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // your backend admin login endpoint (adjust as needed)
      const res = await api.post("/admin/login", form);
      // expected: res.data = { token, name }
      localStorage.setItem("admin_token", res.data.token || "demo-token");
      localStorage.setItem("admin_name", res.data.name || "Admin");
      nav("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed (server)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:900, margin:"50px auto", padding:20 }}>
      <h1 style={{ fontSize:28, marginBottom:12 }}>Admin Login</h1>
      <form onSubmit={submit} style={{ display:"flex", gap:8 }}>
        <input name="email" value={form.email} onChange={(e)=>handle("email", e.target.value)} placeholder="Admin Email" required style={{ padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"inherit", minWidth:240 }} />
        <input name="password" value={form.password} onChange={(e)=>handle("password", e.target.value)} placeholder="Password" type="password" required style={{ padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"transparent", color:"inherit", minWidth:240 }} />
        <button type="submit" disabled={loading} style={{ padding:"10px 18px", borderRadius:8, background:"#6d28d9", color:"#fff", border:"none", cursor:"pointer" }}>{loading ? "Logging..." : "Login"}</button>
      </form>
      <div style={{ marginTop:12, color:"#9aa4b2" }}>Use real backend /admin/login or the createAdmin script you ran earlier.</div>
    </div>
  );
}
