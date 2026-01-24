import React, { useState } from "react";
import { sendOtp, registerMechanic, loginMechanic } from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

export default function MechanicSignup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gst: "",
    garageName: "",
    address: "",
    otp: ""
  });

  const [error, setError] = useState("");

  const handle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  // ---------------- VALIDATION ----------------
  const validateStep1 = () => {
  if (!form.name.trim()) return "Enter your name";

  if (!/^\S+@\S+\.\S+$/.test(form.email))
    return "Enter a valid email";

  // PHONE IS OPTIONAL — only validate if filled
  if (form.phone.trim() && !/^\d{10}$/.test(form.phone))
    return "Invalid phone number (must be 10 digits)";

  if (form.password.length < 6)
    return "Password must be at least 6 characters";

  if (form.password !== form.confirmPassword)
    return "Passwords do not match";

  if (form.gst && !/^[0-9A-Z]{15}$/.test(form.gst.trim()))
    return "GST should be 15 characters";

  return null;  // No error
};


  // ---------------- SEND OTP (EMAIL ONLY) ----------------
const handleSendOtp = async () => {
  const errMsg = validateStep1();
  if (errMsg) return setError(errMsg);

  try {
    setLoading(true);

    const res = await sendOtp({ email: form.email });

    setServerOtp(res.data.debugOtp || null);
    setStep(2);
  } catch (e) {
    setError(e.response?.data?.message || "Failed to send OTP");
  }

  setLoading(false);
};


  // ---------------- VERIFY OTP + REGISTER ----------------
  const handleVerifyAndRegister = async () => {
    if (!form.otp.trim()) return setError("Enter OTP");

    try {
      setLoading(true);

      await registerMechanic({
        name: form.name,
        email: form.email,
        password: form.password,
        gst: form.gst,
        garageName: form.garageName,
        address: form.address,
        otp: form.otp
      });

      // Auto Login
      const loginRes = await loginMechanic({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.accessToken);
      localStorage.setItem("role", "mechanic");

      nav("/mechanic/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Signup failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT BANNER */}
          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-10 rounded-l-2xl">
            <h2 className="text-3xl font-bold mb-4">Join RoadsRiser</h2>
            <p className="text-sm opacity-90 mb-8">
              Get more jobs, manage customers professionally and grow your garage.
            </p>

            <ul className="space-y-2 text-sm opacity-95">
              <li>✔ Priority Requests</li>
              <li>✔ GST Billing Support</li>
              <li>✔ Secure Payments</li>
              <li>✔ Ratings & Reviews Boost</li>
            </ul>
          </div>

          {/* RIGHT FORM */}
          <div className="p-8 md:p-10">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Mechanic Signup
            </h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Full Name" className="input"
                    value={form.name} onChange={(e) => handle("name", e.target.value)} />
                  <input placeholder="Garage Name" className="input"
                    value={form.garageName} onChange={(e) => handle("garageName", e.target.value)} />
                </div>

                <input placeholder="Email" type="email" className="input"
                  value={form.email} onChange={(e) => handle("email", e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Phone Number (optional)" className="input"
                    value={form.phone} onChange={(e) => handle("phone", e.target.value)} />
                  <input placeholder="GST Number (optional)" className="input"
                    value={form.gst} onChange={(e) => handle("gst", e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Password" type="password" className="input"
                    value={form.password} onChange={(e) => handle("password", e.target.value)} />
                  <input placeholder="Confirm Password" type="password" className="input"
                    value={form.confirmPassword} onChange={(e) => handle("confirmPassword", e.target.value)} />
                </div>

                <textarea placeholder="Complete Garage Address" className="input h-24 resize-none"
                  value={form.address} onChange={(e) => handle("address", e.target.value)} />

                <button onClick={handleSendOtp}
                  className="btn w-full">{loading ? "Sending OTP..." : "Send OTP"}</button>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600">OTP sent to <strong>{form.email}</strong></p>

                <div className="flex gap-3">
                  <input placeholder="Enter OTP" className="input"
                    value={form.otp} onChange={(e) => handle("otp", e.target.value)} />
                  <button onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded-lg">Edit</button>
                </div>

                <button className="btn w-full" onClick={handleVerifyAndRegister}>
                  {loading ? "Creating Account..." : "Verify & Create Account"}
                </button>

                <button
                  onClick={() => sendOtp({ email: form.email })}
                  className="text-indigo-500 text-sm"
                >
                  Resend OTP
                </button>
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
        }
        .btn {
          background: linear-gradient(90deg,#6366f1,#06b6d4);
          padding: 12px 14px;
          border-radius: 10px;
          font-weight: 600;
          color: white;
        }
      `}</style>
    </div>
  );
}
