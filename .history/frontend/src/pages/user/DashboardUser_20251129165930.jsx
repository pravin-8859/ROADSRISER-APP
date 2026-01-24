// src/pages/user/DashboardUser.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestHelp from "./RequestHelp";
import RequestActive from "./RequestActive";
import RequestHistory from "./RequestHistory";
import UserProfile from "./UserProfile";
import { FaHome, FaPlusCircle, FaHistory, FaUser, FaBars, FaBell } from "react-icons/fa";

export default function DashboardUser() {
  const navigate = useNavigate();

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "user") navigate("/user/login");
  }, [navigate]);

  // Mobile sidebar state
  const [menuOpen, setMenuOpen] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("new"); // new | active | history | profile

  // Keyboard Switch
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "1") setActiveTab("new");
      if (e.key === "2") setActiveTab("active");
      if (e.key === "3") setActiveTab("history");
      if (e.key === "4") setActiveTab("profile");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const Sidebar = (
    <aside className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl h-fit">
      {/* USER PROFILE HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <div className="font-bold text-lg">User</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">RoadsRiser User</div>
        </div>
      </div>

      {/* TABS */}
      <nav className="space-y-2">
        <button
          onClick={() => {
            setActiveTab("new");
            setMenuOpen(false);
          }}
          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            activeTab === "new" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaPlusCircle /> New Request
        </button>

        <button
          onClick={() => {
            setActiveTab("active");
            setMenuOpen(false);
          }}
          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            activeTab === "active" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaHome /> Active Request
        </button>

        <button
          onClick={() => {
            setActiveTab("history");
            setMenuOpen(false);
          }}
          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            activeTab === "history" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaHistory /> History
        </button>

        <button
          onClick={() => {
            setActiveTab("profile");
            setMenuOpen(false);
          }}
          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            activeTab === "profile" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaUser /> Profile
        </button>
      </nav>

      {/* Tip */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Tip: Press 1/2/3/4 to switch tabs.
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* MOBILE SIDEBAR OPEN BUTTON (moved down to avoid navbar overlap) */}
      <button
        className="md:hidden fixed top-[140px] left-6 z-40 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <FaBars size={20} />
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">

        {/* SIDEBAR - DESKTOP */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 sticky top-28">
          {Sidebar}
        </div>

        {/* SIDEBAR - MOBILE DRAWER */}
        {menuOpen && (
          <>
            {/* Backdrop: close on click */}
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              aria-hidden="true"
            />

            <div className="md:hidden fixed top-0 left-0 w-3/4 h-full bg-white dark:bg-gray-900 shadow-2xl p-5 z-50 animate-slide">
              {/* CLOSE BUTTON */}
              <button
                className="absolute top-4 right-4 text-xl text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 p-1 rounded-full shadow"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✖
              </button>

              {Sidebar}
            </div>
          </>
        )}

        {/* RIGHT CONTENT */}
        <main className="md:col-span-9 lg:col-span-10 md:ml-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage requests, track mechanics and view history
                </p>
              </div>

              <button className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Notifications">
                <FaBell />
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="mt-4">
              {activeTab === "new" && <RequestHelp />}
              {activeTab === "active" && <RequestActive />}
              {activeTab === "history" && <RequestHistory />}
              {activeTab === "profile" && <UserProfile />}
            </div>
          </div>
        </main>
      </div>

      {/* ANIMATION STYLE */}
      <style>{`
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
        .animate-slide {
          animation: slide 0.28s ease-out;
        }
      `}</style>
    </div>
  );
}
