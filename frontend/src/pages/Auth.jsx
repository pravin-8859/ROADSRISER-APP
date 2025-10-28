import { useState } from "react";
import MechanicSignup from "./MechanicSignup";
import UserSignup from "./UserSignup";
import MechanicLogin from "./MechanicLogin";
import UserLogin from "./UserLogin";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login or signup
  const [role, setRole] = useState("user"); // user or mechanic

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const renderForm = () => {
    if (mode === "signup" && role === "mechanic") return <MechanicSignup />;
    if (mode === "signup" && role === "user") return <UserSignup />;
    if (mode === "login" && role === "mechanic") return <MechanicLogin />;
    if (mode === "login" && role === "user") return <UserLogin />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        {/* Role selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-md transition ${
              role === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("mechanic")}
            className={`px-4 py-2 rounded-md transition ${
              role === "mechanic"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Mechanic
          </button>
        </div>

        {/* Render login/signup form */}
        <div className="mb-6">{renderForm()}</div>

        {/* Toggle link */}
        <p className="text-center text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={handleSwitchMode}
                className="text-indigo-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={handleSwitchMode}
                className="text-indigo-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
