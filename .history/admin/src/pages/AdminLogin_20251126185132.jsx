import { useState } from "react";
import api from "../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/admin/login", { email, password: pass });
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/dashboard";
    } catch (e) {
      setErr("Invalid admin credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-xl rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        <input
          className="border w-full p-2 rounded mb-3"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded mb-3"
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {err && <p className="text-red-500 text-sm mb-3">{err}</p>}

        <button
          onClick={login}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
