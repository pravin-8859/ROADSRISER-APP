import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "user");
      alert(res.data.message);
      navigate("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Forgot Password link right aligned */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
