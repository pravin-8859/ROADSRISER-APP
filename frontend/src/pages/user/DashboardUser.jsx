// src/pages/user/DashboardUser.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RequestHelp from "./RequestHelp";
import RequestActive from "./RequestActive";
import RequestHistory from "./RequestHistory";
import UserProfile from "./UserProfile";

import {
  FaHome,
  FaPlusCircle,
  FaHistory,
  FaUser,
  FaBars,
  FaBell,
  FaTimes,
  FaRoad,
  FaSignOutAlt,
  FaGlobe,
  FaChevronRight,
} from "react-icons/fa";

import { getUserProfileApi } from "../../api/userApi";

export default function DashboardUser() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // ================= AUTH =================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/user/login", { replace: true });
      return;
    }

    loadUser();
  }, [navigate]);

  // ================= USER =================

  const loadUser = async () => {
    try {
      const res = await getUserProfileApi();

      setUser({
        name: res?.user?.name || "User",
        email: res?.user?.email || "",
      });
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Remove old user data if present
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");

    navigate("/user/login", {
      replace: true,
    });
  };

  // ================= WEBSITE =================

  const handleBackToWebsite = () => {
    setMenuOpen(false);
    navigate("/");
  };

  // ================= TABS =================

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // ================= KEYBOARD =================

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "1") changeTab("new");
      if (e.key === "2") changeTab("active");
      if (e.key === "3") changeTab("history");
      if (e.key === "4") changeTab("profile");
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  // ================= SIDEBAR =================

  const Sidebar = (
    <aside className="w-full bg-[#1d293b] text-white rounded-2xl p-4 shadow-xl border border-white/5">

      {/* BRAND */}

      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
          <FaRoad />
        </div>

        <div>
          <h2 className="font-bold text-sm">
            RoadsRiser
          </h2>

          <p className="text-[10px] text-gray-400">
            User Dashboard
          </p>
        </div>
      </div>

      {/* USER */}

      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/20">
          {(user.name || "U")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">
            {user.name || "User"}
          </p>

          <p className="text-[10px] text-gray-400 truncate">
            {user.email || "Customer"}
          </p>
        </div>
      </div>

      {/* MENU */}

      <nav className="space-y-2">

        {/* NEW */}

        <button
          onClick={() => changeTab("new")}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === "new"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-gray-300 hover:bg-white/5"
          }`}
        >
          <FaPlusCircle />
          <span>New Request</span>
        </button>

        {/* ACTIVE */}

        <button
          onClick={() => changeTab("active")}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === "active"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-gray-300 hover:bg-white/5"
          }`}
        >
          <FaHome />
          <span>Active Request</span>
        </button>

        {/* HISTORY */}

        <button
          onClick={() => changeTab("history")}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-gray-300 hover:bg-white/5"
          }`}
        >
          <FaHistory />
          <span>Service History</span>
        </button>

        {/* PROFILE */}

        <button
          onClick={() => changeTab("profile")}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-gray-300 hover:bg-white/5"
          }`}
        >
          <FaUser />
          <span>My Profile</span>
        </button>

      </nav>

      {/* WEBSITE BUTTON */}

      <div className="mt-6 pt-5 border-t border-white/10 space-y-2">

        <button
          onClick={handleBackToWebsite}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition"
        >
          <FaGlobe />
          <span>Back to Website</span>
          <FaChevronRight className="ml-auto text-xs opacity-50" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

      {/* HELP */}

      <div className="mt-5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/10">
        <p className="text-[10px] leading-relaxed text-indigo-300">
          Need roadside help? Create a request and get assistance from a nearby mechanic.
        </p>
      </div>

      {/* KEYBOARD */}

      <p className="text-[9px] text-gray-500 mt-4 text-center">
        Press 1 / 2 / 3 / 4 to switch tabs
      </p>

    </aside>
  );

  // ================= PAGE =================

  return (
    <div className="min-h-screen bg-[#050914] text-white">

      {/* ================= DESKTOP TOP BAR ================= */}

      <header className="hidden md:block sticky top-0 z-40 bg-[#080d18]/95 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-[1450px] mx-auto px-5 lg:px-6 h-[76px] flex items-center justify-between">

          {/* BRAND */}

          <button
            onClick={handleBackToWebsite}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <FaRoad />
            </div>

            <div className="text-left">
              <h1 className="font-bold text-base">
                RoadsRiser
              </h1>

              <p className="text-[10px] text-gray-500 tracking-widest">
                USER DASHBOARD
              </p>
            </div>
          </button>

          {/* RIGHT ACTIONS */}

          <div className="flex items-center gap-3">

            <button
              onClick={handleBackToWebsite}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <FaGlobe />
              Back to Website
            </button>

            <button
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/10 transition"
              aria-label="Notifications"
            >
              <FaBell size={14} />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/20">
                {(user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="hidden sm:block max-w-[150px]">
                <p className="text-sm font-semibold truncate">
                  {user.name || "User"}
                </p>

                <p className="text-[10px] text-gray-500 truncate">
                  {user.email || "Customer"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"
              title="Logout"
            >
              <FaSignOutAlt size={14} />
            </button>

          </div>

        </div>

      </header>

      {/* ================= MOBILE HEADER ================= */}

      <div className="md:hidden sticky top-0 z-40 bg-[#080d18]/95 backdrop-blur-xl border-b border-white/10">

        <div className="flex items-center justify-between px-4 py-3">

          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg"
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <button
            onClick={handleBackToWebsite}
            className="text-center"
          >
            <p className="text-[10px] text-indigo-400">
              RoadsRiser
            </p>

            <h2 className="font-bold text-sm">
              {activeTab === "new"
                ? "New Request"
                : activeTab === "active"
                ? "Active Request"
                : activeTab === "history"
                ? "Service History"
                : "My Profile"}
            </h2>
          </button>

          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/10"
            aria-label="Logout"
          >
            <FaSignOutAlt size={14} />
          </button>

        </div>

      </div>

      {/* ================= MOBILE DRAWER ================= */}

      {menuOpen && (
        <>
          {/* BACKDROP */}

          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setMenuOpen(false)}
          />

          {/* DRAWER */}

          <div className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-[#0b1220] z-[60] p-4 shadow-2xl overflow-y-auto animate-sidebar">

            {/* CLOSE */}

            <div className="flex justify-end mb-3">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-red-500/20 hover:text-red-400"
              >
                <FaTimes />
              </button>
            </div>

            {Sidebar}

          </div>
        </>
      )}

      {/* ================= MAIN ================= */}

      <div className="max-w-[1450px] mx-auto flex gap-5 p-4 md:p-5 lg:p-6">

        {/* DESKTOP SIDEBAR */}

        <div className="hidden md:block w-[220px] lg:w-[240px] shrink-0">

          <div className="sticky top-[96px]">
            {Sidebar}
          </div>

        </div>

        {/* CONTENT */}

        <main className="flex-1 min-w-0">

          <div className="bg-[#162235] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">

            {/* CONTENT HEADER */}

            <div className="px-5 md:px-6 py-5 border-b border-white/5">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-xs text-indigo-400 font-medium mb-1">
                    Customer Dashboard
                  </p>

                  <h1 className="text-xl md:text-2xl font-bold truncate">

                    {activeTab === "new"
                      ? `Welcome back, ${user.name || "User"} 👋`
                      : activeTab === "active"
                      ? "Active Roadside Request"
                      : activeTab === "history"
                      ? "Service History"
                      : "My Profile"}

                  </h1>

                  <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                    Manage your roadside assistance services easily.
                  </p>

                </div>

                <button
                  className="hidden md:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center hover:bg-white/10 transition"
                  aria-label="Notifications"
                >
                  <FaBell size={14} />
                </button>

              </div>

            </div>

            {/* TAB CONTENT */}

            <div className="p-4 md:p-6">

              {activeTab === "new" && (
                <RequestHelp
                  onSuccess={() => setActiveTab("active")}
                />
              )}

              {activeTab === "active" && (
                <RequestActive />
              )}

              {activeTab === "history" && (
                <RequestHistory />
              )}

              {activeTab === "profile" && (
                <UserProfile />
              )}

            </div>

          </div>

        </main>

      </div>

      {/* SIDEBAR ANIMATION */}

      <style>{`

        @keyframes sidebarSlide {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(0);
          }
        }

        .animate-sidebar {
          animation: sidebarSlide 0.25s ease-out;
        }

      `}</style>

    </div>
  );
}