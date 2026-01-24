// src/pages/MechanicSignup.jsx
import React, { useState } from "react";
import { sendOtp, registerMechanic } from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

export default function MechanicSignup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gst: "",
    garageName: "",
    address: "",
    otp: "",
  });
  const [error, setError] = useState("");

  const handle = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (form.gst && !/^[0-9A-Z]{15}$/.test(form.gst.trim())) return "GST should be 15 characters";
    return null;
  };

  const handleSendOtp = async () => {
    const errMsg = validateStep1();
    if (errMsg) return setError(errMsg);

    try {
      setLoading(true);
      const res = await sendOtp({ email: form.email.trim() });
      setServerOtp(res?.data?.debugOtp || null);
      setStep(2);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!form.otp.trim()) return setError("Enter OTP");

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        gst: form.gst.trim(),
        garageName: form.garageName.trim(),
        address: form.address.trim(),
        otp: form.otp.trim(),
      };

      if (/^\d{10}$/.test(form.phone.trim())) {
        payload.phone = form.phone.trim();
      }

      const res = await registerMechanic(payload);

      const token = res.data?.token || res.data?.accessToken;
      if (token) localStorage.setItem("accessToken", token);
      localStorage.setItem("role", "mechanic");

      nav("/mechanic/dashboard");
    } catch (e) {
      setError(e?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4 py-10">

      {/* CARD */}
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT SIDE - BRAND PANEL */}
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-700 to-blue-500 text-white p-10 rounded-l-2xl">

            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RoadsRiser" className="w-12 h-12 rounded-xl shadow-lg" />
              <h2 className="text-3xl font-bold tracking-wide">RoadsRiser</h2>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mt-4 mb-3">Grow with RoadsRiser</h3>
              <p className="text-sm opacity-95 mb-6">
                Join India's trusted roadside assistance network & get more business.
              </p>

              <ul className="space-y-2 text-sm opacity-95">
                <li>✔ Priority Repair Requests</li>
                <li>✔ GST Billing Support</li>
                <li>✔ Secure Online Payments</li>
                <li>✔ Build Customer Trust</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="p-8 md:p-10">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Mechanic Signup</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start receiving service requests instantly.</p>

            {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Full Name" value={form.name} onChange={(e)=>handle("name", e.target.value)} />
                  <input className="input" placeholder="Garage Name" value={form.garageName} onChange={(e)=>handle("garageName", e.target.value)} />
                </div>

                <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e)=>handle("email", e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={(e)=>handle("phone", e.target.value)} />
                  <input className="input" placeholder="GST (optional)" value={form.gst} onChange={(e)=>handle("gst", e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e)=>handle("password", e.target.value)} />
                  <input className="input" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e)=>handle("confirmPassword", e.target.value)} />
                </div>

                <textarea className="input h-24 resize-none" placeholder="Complete Garage Address" value={form.address} onChange={(e)=>handle("address", e.target.value)} />

                <button onClick={handleSendOtp} disabled={loading} className="btn w-full mt-4">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <p className="text-sm text-gray-500 text-center mt-3">
                  Already have an account?{" "}
                  <span onClick={()=>nav("/auth/mechanic/login")} className="text-indigo-600 font-medium cursor-pointer">
                    Login
                  </span>
                </p>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">

                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  OTP sent to <strong>{form.email}</strong>
                </p>

                <div className="flex gap-3">
                  <input className="input" placeholder="Enter OTP" value={form.otp} onChange={(e)=>handle("otp", e.target.value)} />
                  <button onClick={()=>setStep(1)} className="px-4 py-2 border rounded-lg dark:border-gray-600">
                    Edit
                  </button>
                </div>

                <button className="btn w-full" onClick={handleVerifyAndRegister}>
                  {loading ? "Creating Account..." : "Verify & Create Account"}
                </button>

                <button onClick={handleSendOtp} className="w-full text-sm mt-2 text-indigo-500">
                  Resend OTP
                </button>

                {serverOtp && (
                  <p className="text-xs text-gray-500 mt-2">DEBUG OTP: {serverOtp}</p>
                )}

                <p className="text-sm text-gray-500 text-center mt-3">
                  Already registered?{" "}
                  <span onClick={()=>nav("/auth/mechanic/login")} className="text-indigo-600 font-medium cursor-pointer">
                    Login
                  </span>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: transparent;
          color: inherit;
        }
        .input:focus {
          border-color: #6366f1;
          outline: none;
        }
        .btn {
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          padding: 12px 14px;
          border-radius: 10px;
          font-weight: 600;
          color: white;
        }
      `}</style>
    </div>
  );
}
