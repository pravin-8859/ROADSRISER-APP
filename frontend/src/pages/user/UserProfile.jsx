import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaLock,
} from "react-icons/fa";

import {
  getUserProfileApi,
  updateUserProfileApi,
} from "../../api/userApi";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserProfileApi();

      setProfile({
        name: res?.user?.name || "",
        email: res?.user?.email || "",
        phone: res?.user?.phone || "",
      });
    } catch (err) {
      console.error("Profile load:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await updateUserProfileApi({
        name: profile.name,
        phone: profile.phone,
      });

      setProfile({
        name: res.user.name || "",
        email: res.user.email || "",
        phone: res.user.phone || "",
      });
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

        <p className="mt-4 text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {(profile.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {profile.name || "RoadsRiser User"}
            </h2>

            <p className="text-white/80 text-sm">
              {profile.email}
            </p>
          </div>

        </div>
      </div>

      {/* PERSONAL INFORMATION */}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-6">
          Personal Information
        </h3>

        <div className="space-y-5">

          {/* NAME */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Full Name
            </label>

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={profile.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-indigo-500"
                placeholder="Enter your name"
              />

            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Email
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={profile.email}
                disabled
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              />

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Email cannot be changed from here.
            </p>
          </div>

          {/* PHONE */}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Phone Number
            </label>

            <div className="relative">

              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={profile.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                maxLength={10}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-indigo-500"
                placeholder="Enter 10 digit phone number"
              />

            </div>
          </div>

          {/* BUTTONS */}

          <div className="pt-3 flex flex-col sm:flex-row gap-3">

            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FaSave />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              onClick={() =>
                alert(
                  "Change password feature will be added next."
                )
              }
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaLock />
              Change Password
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}