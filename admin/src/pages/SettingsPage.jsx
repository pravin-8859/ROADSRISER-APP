import React, { useEffect, useState } from "react";
import {
  FiSettings,
  FiShield,
  FiBell,
  FiUser,
  FiLogOut,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [requestAlerts, setRequestAlerts] =
    useState(true);

  const [mechanicAlerts, setMechanicAlerts] =
    useState(true);

  const [saved, setSaved] = useState(false);

  // =====================================================
  // LOAD LOCAL SETTINGS
  // =====================================================

  useEffect(() => {
    const name =
      localStorage.getItem("adminName") ||
      "RoadsRiser Admin";

    const email =
      localStorage.getItem("adminEmail") ||
      "admin@roadsriser.com";

    const notificationSetting =
      localStorage.getItem(
        "adminNotifications"
      );

    const requestSetting =
      localStorage.getItem(
        "adminRequestAlerts"
      );

    const mechanicSetting =
      localStorage.getItem(
        "adminMechanicAlerts"
      );

    setAdminName(name);
    setAdminEmail(email);

    setNotifications(
      notificationSetting !== "false"
    );

    setRequestAlerts(
      requestSetting !== "false"
    );

    setMechanicAlerts(
      mechanicSetting !== "false"
    );
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const saveSettings = () => {
    localStorage.setItem(
      "adminName",
      adminName
    );

    localStorage.setItem(
      "adminEmail",
      adminEmail
    );

    localStorage.setItem(
      "adminNotifications",
      String(notifications)
    );

    localStorage.setItem(
      "adminRequestAlerts",
      String(requestAlerts)
    );

    localStorage.setItem(
      "adminMechanicAlerts",
      String(mechanicAlerts)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetSettings = () => {
    setAdminName("RoadsRiser Admin");
    setAdminEmail(
      "admin@roadsriser.com"
    );

    setNotifications(true);
    setRequestAlerts(true);
    setMechanicAlerts(true);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem("role");

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section>

        <p className="text-sm text-indigo-400 font-medium">
          Administration
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Settings
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Manage your admin profile and panel preferences.
        </p>

      </section>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {saved && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
          <FiSave />
          Settings saved successfully.
        </div>
      )}

      {/* =================================================
          ADMIN PROFILE
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="p-5 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FiUser />
            </div>

            <div>

              <h2 className="text-base font-semibold text-white">
                Admin Profile
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Basic administrator information
              </p>

            </div>

          </div>

        </div>

        <div className="p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-xs text-gray-400 mb-2">
                Admin Name
              </label>

              <input
                type="text"
                value={adminName}
                onChange={(e) =>
                  setAdminName(
                    e.target.value
                  )
                }
                className="w-full bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

            </div>

            <div>

              <label className="block text-xs text-gray-400 mb-2">
                Admin Email
              </label>

              <input
                type="email"
                value={adminEmail}
                onChange={(e) =>
                  setAdminEmail(
                    e.target.value
                  )
                }
                className="w-full bg-[#0b1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />

            </div>

          </div>

          <p className="text-xs text-gray-600 mt-4">
            Profile preferences are currently stored locally.
            Database-backed profile editing can be added with a
            dedicated admin settings API.
          </p>

        </div>

      </section>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="p-5 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <FiBell />
            </div>

            <div>

              <h2 className="text-base font-semibold text-white">
                Notifications
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Control admin panel alerts
              </p>

            </div>

          </div>

        </div>

        <div className="divide-y divide-white/5">

          <ToggleRow
            title="Admin Notifications"
            description="Receive general notifications inside the admin panel."
            checked={notifications}
            onChange={setNotifications}
          />

          <ToggleRow
            title="New Request Alerts"
            description="Show alerts when a new roadside assistance request is created."
            checked={requestAlerts}
            onChange={setRequestAlerts}
          />

          <ToggleRow
            title="Mechanic Alerts"
            description="Show alerts related to mechanic availability and activity."
            checked={mechanicAlerts}
            onChange={setMechanicAlerts}
          />

        </div>

      </section>

      {/* =================================================
          SECURITY
      ================================================= */}

      <section className="bg-[#111827] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

        <div className="p-5 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <FiShield />
            </div>

            <div>

              <h2 className="text-base font-semibold text-white">
                Security
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Admin account security information
              </p>

            </div>

          </div>

        </div>

        <div className="p-5 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <p className="text-sm text-gray-300">
                Authentication
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Admin access is protected by JWT authentication.
              </p>

            </div>

            <span className="w-fit px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
              Protected
            </span>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <p className="text-sm text-gray-300">
                Admin Role
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Current account role
              </p>

            </div>

            <span className="w-fit px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
              Admin
            </span>

          </div>

        </div>

      </section>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <section className="flex flex-col sm:flex-row justify-between gap-3">

        <button
          onClick={resetSettings}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium transition"
        >
          <FiRefreshCw />
          Reset Changes
        </button>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-medium transition"
          >
            <FiLogOut />
            Logout
          </button>

          <button
            onClick={saveSettings}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
          >
            <FiSave />
            Save Settings
          </button>

        </div>

      </section>

    </div>
  );
}

// =====================================================
// TOGGLE ROW
// =====================================================

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="p-5 flex items-center justify-between gap-4">

      <div>

        <p className="text-sm font-medium text-gray-200">
          {title}
        </p>

        <p className="text-xs text-gray-600 mt-1 max-w-xl">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        className={`relative w-11 h-6 shrink-0 rounded-full transition ${
          checked
            ? "bg-indigo-600"
            : "bg-gray-700"
        }`}
      >

        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}