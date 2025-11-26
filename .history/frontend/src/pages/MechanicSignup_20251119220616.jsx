import { useState } from "react";
import { registerMechanic } from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

export default function MechanicSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    garageName: "",
    address: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerMechanic(form);
      alert(res.message || "Signup successful!");
      navigate("/mechanic/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Mechanic Signup
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name", "email", "password", "phone", "garageName", "address"].map((f) => (
            <input
              key={f}
              type={f === "password" ? "password" : f === "email" ? "email" : "text"}
              name={f}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                         bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg 
                       font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-md"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
