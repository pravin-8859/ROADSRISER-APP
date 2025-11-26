import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/user/signup", form);
      alert(res.data.message);
      navigate("/user/login");
    } catch(err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Signup</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name","email","password","phone"].map(f=>(
            <input key={f} type={f==="password"?"password":"text"} name={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} 
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" required/>
          ))}
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Signup</button>
        </form>
        
      </div>
    </div>
  )
}
