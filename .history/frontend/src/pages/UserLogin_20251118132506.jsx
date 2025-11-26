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
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "user");
      alert(res.data.message);
      navigate("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500 px-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl dark:shadow-[0_0_25px_rgba(0,0,0,0.6)] w-full max-w-md transform hover:scale-[1.01] transition-transform duration-300">
        
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-100 tracking-tight">
          User Login
        </h2>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />

          {/* Forgot Password */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-500 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        {/* CREATE ACCOUNT SECTION */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/user/signup"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
