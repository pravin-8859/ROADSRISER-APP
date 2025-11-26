import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 → Details, Step 2 → OTP
  const [loading, setLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState(null); // demo OTP
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });

  const handle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  // -------------------------------
  // VALIDATION (Step 1)
  // -------------------------------
  const validateDetails = () => {
    if (!form.name.trim()) return "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) return "Enter valid 10-digit mobile number";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";

    return null;
  };

  // -------------------------------
  // SEND OTP
  // -------------------------------
  const handleSendOtp = async () => {
    const errorMsg = validateDetails();
    if (errorMsg) return setError(errorMsg);

    try {
      setLoading(true);

      const res = await API.post("/users/send-otp", { phone: form.phone });

      // Store OTP (for demo - remove in production)
      setServerOtp(res.data.otp);

      setStep(2);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // -------------------------------
  // VERIFY OTP & REGISTER
  // -------------------------------
  const handleVerifyAndRegister = async () => {
    if (!form.otp.trim()) return setError("Enter OTP");

    // DEMO OTP VALIDATION
    if (form.otp !== serverOtp && form.otp !== "1234") {
      return setError("Invalid OTP");
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        otp: form.otp,
      };

      const res = await API.post("/users/register", payload);

      alert(res.data.message || "Signup successful!");
      navigate("/user/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-center font-medium text-sm">
            {error}
          </div>
        )}

        {/* STEP 1 — USER DETAILS */}
        {step === 1 && (
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => handle("name", e.target.value)}
              className="input"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handle("email", e.target.value)}
              className="input"
            />

            <input
              type="text"
              placeholder="Mobile Number (10 digits)"
              value={form.phone}
              onChange={(e) => handle("phone", e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handle("password", e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handle("confirmPassword", e.target.value)}
              className="input"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="btn"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <div className="space-y-4">

            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              OTP sent to <b>{form.phone}</b>{" "}
              <br />
              <span className="text-xs opacity-70">
                (Demo OTP: {serverOtp})
              </span>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(e) => handle("otp", e.target.value)}
              className="input"
            />

            <button
              onClick={handleVerifyAndRegister}
              disabled={loading}
              className="btn"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full py-2 text-sm border border-gray-400 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 mt-3"
            >
              Edit Information
            </button>
          </div>
        )}
      </div>

      {/* Tailwind utility classes */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cccccc50;
          background: #f8f8f8;
          color: #111;
        }
        .dark .input {
          background: #111827;
          color: #fff;
        }
        .btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          border-radius: 10px;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
