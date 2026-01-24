import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = details, Step 2 = OTP
  const [serverOtp, setServerOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: ""
  });

  const handle = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const sendOtpToUser = async () => {
    if (!form.name || !form.email || !form.phone || !form.password)
      return alert("Please fill all details");

    try {
      setLoading(true);
      const res = await API.post("/users/send-otp", { phone: form.phone });

      // Debug OTP from backend
      setServerOtp(res.data.otp);

      alert(`OTP Sent! (Debug Mode): ${res.data.otp}`);

      setStep(2);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };


  const handleSignup = async () => {
    if (form.otp !== serverOtp) {
      return alert("Invalid OTP");
    }

    try {
      setLoading(true);

      await API.post("/users/register", form);

      alert("Signup Successful!");
      navigate("/user/login");

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          User Signup
        </h2>

        {/* STEP 1 — USER DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <input className="input" placeholder="Name"
              onChange={(e) => handle("name", e.target.value)} />
            <input className="input" placeholder="Email" type="email"
              onChange={(e) => handle("email", e.target.value)} />
            <input className="input" placeholder="Phone (10 digits)"
              onChange={(e) => handle("phone", e.target.value)} />
            <input className="input" placeholder="Password" type="password"
              onChange={(e) => handle("password", e.target.value)} />

            <button onClick={sendOtpToUser}
              className="btn-primary w-full">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 — OTP VERIFY */}
        {step === 2 && (
          <div className="space-y-4">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              OTP sent to <b>{form.phone}</b>
            </p>

            <input className="input" placeholder="Enter OTP"
              onChange={(e) => handle("otp", e.target.value)} />

            <button onClick={handleSignup} className="btn-primary w-full">
              {loading ? "Creating..." : "Verify & Create Account"}
            </button>

            <button className="w-full mt-2 py-2 rounded-lg border dark:border-gray-600"
              onClick={() => setStep(1)}>
              Edit Details
            </button>
          </div>
        )}

        <style>{`
          .input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            background: transparent;
            color: inherit;
          }
          .btn-primary {
            background: linear-gradient(90deg, #6366f1, #06b6d4);
            color: white;
            padding: 10px;
            border-radius: 10px;
            font-weight: 600;
          }
        `}</style>

      </div>
    </div>
  );
}
