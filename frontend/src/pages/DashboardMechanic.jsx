// src/pages/DashboardMechanic.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHome,
  FaInbox,
  FaBriefcase,
  FaBoxOpen,
  FaWallet,
  FaUser,
  FaStar,
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaPowerOff,
  FaCamera,
  FaTrash,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaTools,
  FaClock,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";

import {
  getMechanicRequests,
  acceptMechanicRequest,
  updateMechanicRequestStatus,
  logout,
} from "../api/mechanicApi";

export default function DashboardMechanic() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [requests, setRequests] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);

  const [available, setAvailable] = useState(
    localStorage.getItem("mechanicAvailable") !== "false"
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [toasts, setToasts] = useState([]);

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mechanicProfile") ||
          '{"name":"","garage":"","phone":"","email":"","gst":"","address":"","photo":""}'
      );
    } catch {
      return {
        name: "",
        garage: "",
        phone: "",
        email: "",
        gst: "",
        address: "",
        photo: "",
      };
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mechanicInventory") ||
          '[{"id":1,"name":"Tyre","sku":"TYR-01","qty":5,"price":1200},{"id":2,"name":"Car Battery","sku":"BAT-01","qty":2,"price":3500},{"id":3,"name":"Brake Pad","sku":"BRK-01","qty":1,"price":400}]'
      );
    } catch {
      return [];
    }
  });

  const [earnings, setEarnings] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mechanicEarnings") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [reviews] = useState([
    {
      id: 1,
      name: "RoadsRiser Customer",
      rating: 5,
      text: "Quick and professional service.",
      date: new Date().toISOString(),
    },
  ]);

  const profileInputRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", icon: FaHome },
    { name: "Active Requests", icon: FaInbox },
    { name: "Assigned Jobs", icon: FaBriefcase },
    { name: "Parts Inventory", icon: FaBoxOpen },
    { name: "Earnings", icon: FaWallet },
    { name: "Profile & Settings", icon: FaUser },
    { name: "Ratings & Reviews", icon: FaStar },
    { name: "Help", icon: FaQuestionCircle },
  ];

  /* ============================= TOAST ============================= */

  const notify = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  };

  /* ============================= LOAD REQUESTS ============================= */

  useEffect(() => {
    loadRequests();

    const interval = setInterval(() => {
      loadRequests();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getMechanicRequests();

      const data = res?.data?.requests || [];

      const pending = data
        .filter(
          (request) =>
            request.status === "pending" && !request.mechanic
        )
        .map(mapApiRequest);

      const assigned = data
        .filter(
          (request) =>
            request.status === "accepted" ||
            request.status === "enroute"
        )
        .map(mapApiJob);

      setRequests(pending);
      setAssignedJobs(assigned);
    } catch (error) {
      console.error("Failed to load mechanic requests:", error);

      notify(
        error?.response?.data?.message ||
          "Unable to load mechanic requests",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================= ACCEPT REQUEST ============================= */

  const acceptRequest = async (id) => {
    try {
      setActionLoading(`accept-${id}`);

      const res = await acceptMechanicRequest(id);

      const accepted = res?.data?.request;

      if (accepted) {
        const job = mapApiJob(accepted);

        setRequests((prev) =>
          prev.filter((request) => request.id !== id)
        );

        setAssignedJobs((prev) => [job, ...prev]);

        notify("Request accepted successfully.");

        setActiveMenu("Assigned Jobs");
      } else {
        await loadRequests();
      }
    } catch (error) {
      notify(
        error?.response?.data?.message ||
          "Request could not be accepted.",
        "error"
      );

      await loadRequests();
    } finally {
      setActionLoading("");
    }
  };

  /* ============================= UPDATE JOB ============================= */

  const updateJobStatus = async (jobId) => {
    try {
      setActionLoading(`status-${jobId}`);

      const res = await updateMechanicRequestStatus(
        jobId,
        "enroute"
      );

      const updated = res?.data?.request;

      if (updated) {
        const job = mapApiJob(updated);

        setAssignedJobs((prev) =>
          prev.map((item) =>
            item.id === jobId ? job : item
          )
        );

        notify("Status updated to On the way.");
      } else {
        await loadRequests();
      }
    } catch (error) {
      notify(
        error?.response?.data?.message ||
          "Unable to update job status.",
        "error"
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ============================= COMPLETE JOB ============================= */

  const completeJob = async (job) => {
    if (!job) return;

    try {
      setActionLoading(`complete-${job.id}`);

      await updateMechanicRequestStatus(
        job.id,
        "completed"
      );

      const earning = {
        id: Date.now(),
        date: new Date().toISOString(),
        amount: Number(job.estimatedCharge || 0),
        customer: job.customer,
        service: job.issue,
      };

      const updatedEarnings = [earning, ...earnings];

      setEarnings(updatedEarnings);

      localStorage.setItem(
        "mechanicEarnings",
        JSON.stringify(updatedEarnings)
      );

      setAssignedJobs((prev) =>
        prev.filter((item) => item.id !== job.id)
      );

      notify("Job completed successfully.");

      setActiveMenu("Earnings");
    } catch (error) {
      notify(
        error?.response?.data?.message ||
          "Unable to complete job.",
        "error"
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ============================= AVAILABILITY ============================= */

  const toggleAvailability = () => {
    const next = !available;

    setAvailable(next);

    localStorage.setItem(
      "mechanicAvailable",
      String(next)
    );

    notify(
      next
        ? "Garage is now accepting requests."
        : "Garage is now unavailable.",
      next ? "success" : "error"
    );
  };

  /* ============================= PROFILE ============================= */

  const saveProfile = (data) => {
    setProfile(data);

    localStorage.setItem(
      "mechanicProfile",
      JSON.stringify(data)
    );

    notify("Profile updated successfully.");
  };

  /* ============================= PROFILE PHOTO ============================= */

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image file.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notify("Photo must be smaller than 2MB.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const photo = reader.result;

      const updatedProfile = {
        ...profile,
        photo,
      };

      setProfile(updatedProfile);

      localStorage.setItem(
        "mechanicProfile",
        JSON.stringify(updatedProfile)
      );

      notify("Profile photo updated.");
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    const updatedProfile = {
      ...profile,
      photo: "",
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "mechanicProfile",
      JSON.stringify(updatedProfile)
    );

    notify("Profile photo removed.");
  };

  /* ============================= INVENTORY ============================= */

  const saveInventory = (items) => {
    setInventory(items);

    localStorage.setItem(
      "mechanicInventory",
      JSON.stringify(items)
    );
  };

  const addInventory = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
    };

    saveInventory([newItem, ...inventory]);

    notify("Part added.");
  };

  const updateInventory = (id, data) => {
    saveInventory(
      inventory.map((item) =>
        item.id === id
          ? { ...item, ...data }
          : item
      )
    );

    notify("Part updated.");
  };

  const deleteInventory = (id) => {
    saveInventory(
      inventory.filter((item) => item.id !== id)
    );

    notify("Part removed.");
  };

  /* ============================= LOGOUT ============================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout API error:", error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/auth/mechanic/login";
  };

  /* ============================= STATS ============================= */

  const lowStock = useMemo(
    () => inventory.filter((item) => Number(item.qty) < 3).length,
    [inventory]
  );

  const totalEarnings = useMemo(
    () =>
      earnings.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
    [earnings]
  );

  /* ============================= RENDER ============================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* MOBILE HEADER */}

      <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={() => setMobileMenu(true)}
            className="p-2 rounded-lg bg-indigo-600 text-white"
          >
            <FaBars />
          </button>

          <div>
            <div className="font-bold">RoadsRiser</div>
            <div className="text-xs text-gray-500">
              Mechanic Panel
            </div>
          </div>

        </div>

        <div
          className={`w-3 h-3 rounded-full ${
            available
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
      </div>

      <div className="max-w-[1500px] mx-auto p-4 md:p-6 grid grid-cols-12 gap-6">

        {/* SIDEBAR */}

        <aside
          className={`
            fixed md:sticky
            top-0 md:top-4
            left-0
            h-screen md:h-fit
            w-[280px] md:w-auto
            z-50
            md:z-auto
            col-span-12 md:col-span-3 lg:col-span-2
            bg-white dark:bg-gray-900
            border-r md:border
            dark:border-gray-800
            rounded-none md:rounded-2xl
            p-4
            shadow-xl md:shadow
            transform transition-transform
            ${
              mobileMenu
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
          `}
        >

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white">
                <FaTools />
              </div>

              <div>
                <h1 className="font-bold">
                  RoadsRiser
                </h1>
                <p className="text-xs text-gray-500">
                  Mechanic Panel
                </p>
              </div>

            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenu(false)}
            >
              <FaTimes />
            </button>

          </div>

          {/* PROFILE MINI CARD */}

          <div className="p-3 mb-4 rounded-xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">

            <div className="flex items-center gap-3">

              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Mechanic"
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600">
                  <FaUser />
                </div>
              )}

              <div className="min-w-0">

                <div className="font-semibold truncate">
                  {profile.name || "Mechanic"}
                </div>

                <div className="text-xs text-gray-500 truncate">
                  {profile.garage || "Your Garage"}
                </div>

              </div>

            </div>

          </div>

          {/* MENU */}

          <nav className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setMobileMenu(false);
                  }}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2.5 rounded-xl text-sm
                    transition
                    ${
                      activeMenu === item.name
                        ? "bg-indigo-600 text-white shadow-md"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }
                  `}
                >

                  <span className="flex items-center gap-3">
                    <Icon />
                    {item.name}
                  </span>

                  {item.name === "Active Requests" &&
                    requests.length > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {requests.length}
                      </span>
                    )}

                  {item.name === "Parts Inventory" &&
                    lowStock > 0 && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        {lowStock}
                      </span>
                    )}

                </button>
              );
            })}

          </nav>

          {/* GARAGE STATUS */}

          <div className="mt-6 p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">

            <div className="flex items-center justify-between">

              <span className="text-xs text-gray-500">
                Garage Status
              </span>

              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  available
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

            </div>

            <div
              className={`font-semibold mt-1 ${
                available
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {available ? "Available" : "Unavailable"}
            </div>

            <button
              onClick={toggleAvailability}
              className={`
                w-full mt-3 py-2 rounded-lg text-sm font-medium
                ${
                  available
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }
              `}
            >
              {available
                ? "Go Unavailable"
                : "Start Accepting Jobs"}
            </button>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <FaPowerOff />
            Logout
          </button>

        </aside>

        {/* MOBILE OVERLAY */}

        {mobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* MAIN CONTENT */}

        <main className="col-span-12 md:col-span-9 lg:col-span-10">

          {/* TOP HEADER */}

          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 mb-6 shadow-sm">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <p className="text-sm text-indigo-600 font-medium">
                  Mechanic Dashboard
                </p>

                <h2 className="text-2xl md:text-3xl font-bold mt-1">
                  Welcome back{profile.name ? `, ${profile.name}` : ""}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage roadside requests, jobs and your garage.
                </p>

              </div>

              <div
                className={`
                  flex items-center gap-2
                  px-4 py-2 rounded-full text-sm font-medium
                  ${
                    available
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                `}
              >

                <span
                  className={`w-2 h-2 rounded-full ${
                    available
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />

                {available
                  ? "Accepting Requests"
                  : "Not Accepting"}

              </div>

            </div>

          </div>

          {/* PAGE */}

          {activeMenu === "Dashboard" && (
            <DashboardPage
              requests={requests}
              assignedJobs={assignedJobs}
              earnings={earnings}
              totalEarnings={totalEarnings}
              lowStock={lowStock}
              loading={loading}
              onOpenRequests={() =>
                setActiveMenu("Active Requests")
              }
              onOpenJobs={() =>
                setActiveMenu("Assigned Jobs")
              }
              onRefresh={loadRequests}
            />
          )}

          {activeMenu === "Active Requests" && (
            <ActiveRequestsPage
              requests={requests}
              loading={loading}
              actionLoading={actionLoading}
              onAccept={acceptRequest}
              onRefresh={loadRequests}
            />
          )}

          {activeMenu === "Assigned Jobs" && (
            <AssignedJobsPage
              jobs={assignedJobs}
              actionLoading={actionLoading}
              onStatusUpdate={updateJobStatus}
              onComplete={completeJob}
            />
          )}

          {activeMenu === "Parts Inventory" && (
            <InventoryPage
              items={inventory}
              onAdd={addInventory}
              onUpdate={updateInventory}
              onDelete={deleteInventory}
            />
          )}

          {activeMenu === "Earnings" && (
            <EarningsPage
              earnings={earnings}
              total={totalEarnings}
            />
          )}

          {activeMenu === "Profile & Settings" && (
            <ProfilePage
              profile={profile}
              onSave={saveProfile}
              photoInputRef={profileInputRef}
              onPhoto={handlePhoto}
              onRemovePhoto={removePhoto}
            />
          )}

          {activeMenu === "Ratings & Reviews" && (
            <ReviewsPage reviews={reviews} />
          )}

          {activeMenu === "Help" && <HelpPage />}

        </main>

      </div>

      {/* TOASTS */}

      <div className="fixed bottom-5 right-5 z-[100] space-y-2 max-w-sm">

        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-xl shadow-xl
              border bg-white dark:bg-gray-900
              flex items-start gap-3
              ${
                toast.type === "error"
                  ? "border-red-300"
                  : "border-green-300"
              }
            `}
          >

            <FaCheckCircle
              className={
                toast.type === "error"
                  ? "text-red-500 mt-1"
                  : "text-green-500 mt-1"
              }
            />

            <span className="text-sm">
              {toast.message}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage({
  requests,
  assignedJobs,
  earnings,
  totalEarnings,
  lowStock,
  loading,
  onOpenRequests,
  onOpenJobs,
  onRefresh,
}) {
  const stats = [
    {
      title: "Pending Requests",
      value: requests.length,
      icon: FaInbox,
      description: "Requests waiting for you",
    },
    {
      title: "Assigned Jobs",
      value: assignedJobs.length,
      icon: FaBriefcase,
      description: "Currently assigned",
    },
    {
      title: "Completed Jobs",
      value: earnings.length,
      icon: FaCheckCircle,
      description: "Jobs completed",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings}`,
      icon: FaWallet,
      description: "Recorded earnings",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 shadow-sm"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {stat.value}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>

                </div>

                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                  <Icon />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REQUESTS */}

        <section className="lg:col-span-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-sm">

          <div className="p-5 border-b dark:border-gray-800 flex items-center justify-between">

            <div>

              <h3 className="font-bold text-lg">
                New Requests
              </h3>

              <p className="text-sm text-gray-500">
                Nearby customers waiting for assistance
              </p>

            </div>

            <button
              onClick={onRefresh}
              className="text-sm text-indigo-600"
            >
              Refresh
            </button>

          </div>

          <div className="p-5">

            {loading ? (
              <Loading />
            ) : requests.length === 0 ? (
              <EmptyState
                icon={FaInbox}
                title="No new requests"
                text="New roadside assistance requests will appear here."
              />
            ) : (
              <div className="space-y-3">

                {requests.slice(0, 5).map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    compact
                  />
                ))}

                {requests.length > 5 && (
                  <button
                    onClick={onOpenRequests}
                    className="w-full py-3 text-sm text-indigo-600 font-medium"
                  >
                    View all requests
                  </button>
                )}

              </div>
            )}

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 shadow-sm">

          <h3 className="font-bold text-lg">
            Quick Overview
          </h3>

          <div className="mt-5 space-y-3">

            <button
              onClick={onOpenRequests}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
            >

              <span className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                <FaInbox />
                View Requests
              </span>

              <FaChevronRight />

            </button>

            <button
              onClick={onOpenJobs}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >

              <span className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                <FaBriefcase />
                Assigned Jobs
              </span>

              <FaChevronRight />

            </button>

            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">

              <div className="flex items-center justify-between">

                <span className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                  <FaBoxOpen />
                  Low Stock
                </span>

                <strong>
                  {lowStock}
                </strong>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

/* =========================================================
   ACTIVE REQUESTS
========================================================= */

function ActiveRequestsPage({
  requests,
  loading,
  actionLoading,
  onAccept,
  onRefresh,
}) {
  return (
    <PageContainer
      title="Active Requests"
      subtitle="Review and accept roadside assistance requests."
      action={
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          Refresh
        </button>
      }
    >

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FaInbox}
          title="No active requests"
          text="There are currently no requests available."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={onAccept}
              actionLoading={actionLoading}
            />
          ))}

        </div>
      )}

    </PageContainer>
  );
}

/* =========================================================
   REQUEST CARD
========================================================= */

function RequestCard({
  request,
  onAccept,
  actionLoading,
  compact = false,
}) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        border dark:border-gray-800
        rounded-2xl p-5
        shadow-sm
        ${
          request.sos
            ? "border-red-400 dark:border-red-500"
            : ""
        }
      `}
    >

      <div className="flex items-start justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="font-bold">
              {request.customer}
            </h3>

            {request.sos && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                SOS
              </span>
            )}

          </div>

          <p className="text-sm text-gray-500 mt-1">
            {request.issue}
          </p>

        </div>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          Open
        </span>

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <div className="flex gap-2 text-gray-600 dark:text-gray-300">
          <FaMapMarkerAlt className="text-indigo-500 mt-1" />
          <span>{request.location}</span>
        </div>

        {request.phone && (
          <div className="flex gap-2 text-gray-600 dark:text-gray-300">
            <FaPhone className="text-indigo-500 mt-1" />
            <span>{request.phone}</span>
          </div>
        )}

        <div className="flex gap-2 text-gray-600 dark:text-gray-300">
          <FaClock className="text-indigo-500 mt-1" />
          <span>
            {formatDate(request.requestedAt)}
          </span>
        </div>

      </div>

      {!compact && (
        <div className="mt-5 pt-4 border-t dark:border-gray-800">

          <button
            disabled={actionLoading === `accept-${request.id}`}
            onClick={() => onAccept(request.id)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-60"
          >

            {actionLoading === `accept-${request.id}` ? (
              <span className="flex justify-center items-center gap-2">
                <FaSpinner className="animate-spin" />
                Accepting...
              </span>
            ) : (
              "Accept Request"
            )}

          </button>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   ASSIGNED JOBS
========================================================= */

function AssignedJobsPage({
  jobs,
  actionLoading,
  onStatusUpdate,
  onComplete,
}) {
  return (
    <PageContainer
      title="Assigned Jobs"
      subtitle="Manage the requests you have accepted."
    >

      {jobs.length === 0 ? (
        <EmptyState
          icon={FaBriefcase}
          title="No assigned jobs"
          text="Accepted requests will appear here."
        />
      ) : (
        <div className="space-y-4">

          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 shadow-sm"
            >

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <h3 className="font-bold text-lg">
                      {job.customer}
                    </h3>

                    <StatusBadge status={job.status} />

                  </div>

                  <p className="text-gray-500 mt-1">
                    {job.issue}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">

                    <div className="flex gap-2">
                      <FaMapMarkerAlt className="text-indigo-500 mt-1" />
                      {job.location}
                    </div>

                    {job.phone && (
                      <div className="flex gap-2">
                        <FaPhone className="text-indigo-500 mt-1" />
                        {job.phone}
                      </div>
                    )}

                  </div>

                </div>

                <div className="text-left md:text-right">

                  <div className="text-xs text-gray-500">
                    Estimated Charge
                  </div>

                  <div className="text-2xl font-bold">
                    ₹{job.estimatedCharge || 0}
                  </div>

                </div>

              </div>

              <div className="mt-5 pt-4 border-t dark:border-gray-800 flex flex-wrap gap-3">

                {job.status === "Assigned" && (
                  <button
                    disabled={
                      actionLoading === `status-${job.id}`
                    }
                    onClick={() =>
                      onStatusUpdate(job.id)
                    }
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60"
                  >
                    {actionLoading === `status-${job.id}`
                      ? "Updating..."
                      : "On My Way"}
                  </button>
                )}

                <button
                  disabled={
                    actionLoading === `complete-${job.id}`
                  }
                  onClick={() => onComplete(job)}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-60"
                >
                  {actionLoading === `complete-${job.id}`
                    ? "Completing..."
                    : "Mark Completed"}
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </PageContainer>
  );
}

/* =========================================================
   INVENTORY
========================================================= */

function InventoryPage({
  items,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setShowModal(true);
  };

  return (
    <PageContainer
      title="Parts Inventory"
      subtitle="Keep track of parts available at your garage."
      action={
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          + Add Part
        </button>
      }
    >

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl overflow-hidden">

        {items.length === 0 ? (
          <EmptyState
            icon={FaBoxOpen}
            title="Inventory is empty"
            text="Add your first garage part."
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4">Part</th>
                  <th className="text-left p-4">SKU</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t dark:border-gray-800"
                  >

                    <td className="p-4 font-medium">
                      {item.name}
                    </td>

                    <td className="p-4 text-gray-500">
                      {item.sku}
                    </td>

                    <td className="p-4">

                      <span
                        className={
                          Number(item.qty) < 3
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {item.qty}
                      </span>

                      {Number(item.qty) < 3 && (
                        <span className="ml-2 text-xs text-red-500">
                          Low stock
                        </span>
                      )}

                    </td>

                    <td className="p-4">
                      ₹{item.price}
                    </td>

                    <td className="p-4 text-right">

                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1.5 mr-2 rounded-lg border dark:border-gray-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="px-3 py-1.5 rounded-lg text-red-600 border border-red-200"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {showModal && (
        <InventoryModal
          initial={editing}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editing) {
              onUpdate(editing.id, data);
            } else {
              onAdd(data);
            }

            setShowModal(false);
          }}
        />
      )}

    </PageContainer>
  );
}

/* =========================================================
   INVENTORY MODAL
========================================================= */

function InventoryModal({
  initial,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      sku: "",
      qty: 1,
      price: 0,
    }
  );

  const submit = () => {
    if (!form.name.trim()) return;

    onSave({
      ...form,
      qty: Number(form.qty),
      price: Number(form.price),
    });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">

        <div className="flex items-center justify-between mb-5">

          <h3 className="text-xl font-bold">
            {initial ? "Edit Part" : "Add Part"}
          </h3>

          <button onClick={onClose}>
            <FaTimes />
          </button>

        </div>

        <div className="space-y-4">

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Part name"
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-transparent"
          />

          <input
            value={form.sku}
            onChange={(e) =>
              setForm({
                ...form,
                sku: e.target.value,
              })
            }
            placeholder="SKU"
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-transparent"
          />

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              value={form.qty}
              onChange={(e) =>
                setForm({
                  ...form,
                  qty: e.target.value,
                })
              }
              placeholder="Quantity"
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-transparent"
            />

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              placeholder="Price"
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-transparent"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border dark:border-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   EARNINGS
========================================================= */

function EarningsPage({ earnings, total }) {
  return (
    <PageContainer
      title="Earnings"
      subtitle="Your completed job earnings."
    >

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <StatCard
          title="Total Earnings"
          value={`₹${total}`}
          icon={FaWallet}
        />

        <StatCard
          title="Completed Jobs"
          value={earnings.length}
          icon={FaCheckCircle}
        />

        <StatCard
          title="Average Job"
          value={
            earnings.length
              ? `₹${Math.round(
                  total / earnings.length
                )}`
              : "₹0"
          }
          icon={FaStar}
        />

      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl overflow-hidden">

        <div className="p-5 border-b dark:border-gray-800">
          <h3 className="font-bold">
            Recent Earnings
          </h3>
        </div>

        {earnings.length === 0 ? (
          <EmptyState
            icon={FaWallet}
            title="No earnings yet"
            text="Your completed jobs will appear here."
          />
        ) : (
          <div className="divide-y dark:divide-gray-800">

            {earnings.map((item) => (
              <div
                key={item.id}
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <div className="font-medium">
                    {item.service || "Roadside Assistance"}
                  </div>

                  <div className="text-sm text-gray-500">
                    {item.customer || "Customer"} •{" "}
                    {formatDate(item.date)}
                  </div>

                </div>

                <div className="font-bold text-green-600">
                  +₹{item.amount}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </PageContainer>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({
  profile,
  onSave,
  photoInputRef,
  onPhoto,
  onRemovePhoto,
}) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <PageContainer
      title="Profile & Settings"
      subtitle="Manage your mechanic and garage information."
    >

      {/* PROFILE HERO */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white mb-6">

        <div className="flex flex-col sm:flex-row items-center gap-5">

          <div className="relative">

            {form.photo ? (
              <img
                src={form.photo}
                alt="Mechanic profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white/80 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center text-4xl">
                <FaUser />
              </div>
            )}

            <button
              onClick={() =>
                photoInputRef.current?.click()
              }
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg"
              title="Change photo"
            >
              <FaCamera />
            </button>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhoto}
            />

          </div>

          <div className="text-center sm:text-left">

            <h2 className="text-2xl font-bold">
              {form.name || "Your Name"}
            </h2>

            <p className="opacity-90">
              {form.garage || "Your Garage"}
            </p>

            <p className="text-sm opacity-80 mt-1">
              Professional Mechanic
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">

              <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                ✓ Verified Profile
              </span>

              <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                ⭐ 4.7 Rating
              </span>

            </div>

          </div>

        </div>

        {form.photo && (
          <button
            onClick={onRemovePhoto}
            className="mt-5 flex items-center gap-2 text-sm bg-red-500/20 hover:bg-red-500/30 px-3 py-2 rounded-lg"
          >
            <FaTrash />
            Remove Profile Photo
          </button>
        )}

        <p className="text-xs opacity-75 mt-3">
          Recommended: clear square image, maximum 2MB.
        </p>

      </div>

      {/* FORM */}

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input
            label="Full Name"
            value={form.name}
            onChange={(value) =>
              update("name", value)
            }
          />

          <Input
            label="Garage Name"
            value={form.garage}
            onChange={(value) =>
              update("garage", value)
            }
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              update("phone", value)
            }
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(value) =>
              update("email", value)
            }
            type="email"
          />

          <Input
            label="GST Number"
            value={form.gst}
            onChange={(value) =>
              update("gst", value)
            }
          />

          <Input
            label="Garage Address"
            value={form.address}
            onChange={(value) =>
              update("address", value)
            }
          />

        </div>

        <div className="flex justify-end mt-6">

          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Save Profile
          </button>

        </div>

      </div>

    </PageContainer>
  );
}

/* =========================================================
   REVIEWS
========================================================= */

function ReviewsPage({ reviews }) {
  const average = reviews.length
    ? (
        reviews.reduce(
          (sum, item) => sum + Number(item.rating),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <PageContainer
      title="Ratings & Reviews"
      subtitle="Customer feedback about your service."
    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="md:col-span-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-6">

          <div className="text-5xl font-bold">
            {average}
          </div>

          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <FaStar key={item} />
            ))}
          </div>

          <p className="text-sm mt-2 opacity-90">
            Based on {reviews.length} reviews
          </p>

        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6">

          <h3 className="font-bold mb-4">
            Recent Reviews
          </h3>

          <div className="space-y-4">

            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              >

                <div className="flex justify-between">

                  <div className="font-medium">
                    {review.name}
                  </div>

                  <div className="text-yellow-500 flex gap-1">
                    {review.rating} <FaStar />
                  </div>

                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {review.text}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(review.date)}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </PageContainer>
  );
}

/* =========================================================
   HELP
========================================================= */

function HelpPage() {
  const faqs = [
    {
      q: "How do I accept a request?",
      a: "Open Active Requests and select Accept Request.",
    },
    {
      q: "How do I update job status?",
      a: "Open Assigned Jobs and use On My Way or Mark Completed.",
    },
    {
      q: "How do I change my profile photo?",
      a: "Open Profile & Settings and click the camera icon.",
    },
    {
      q: "How do I stop receiving requests?",
      a: "Use the Garage Status toggle and switch to Unavailable.",
    },
  ];

  return (
    <PageContainer
      title="Help & FAQ"
      subtitle="Quick answers for using the mechanic dashboard."
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5"
          >

            <h3 className="font-bold">
              {faq.q}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {faq.a}
            </p>

          </div>
        ))}

      </div>

    </PageContainer>
  );
}

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageContainer({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

        <div>

          <h2 className="text-2xl md:text-3xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>

        </div>

        {action}

      </div>

      {children}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
          <Icon />
        </div>

      </div>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
      />

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Assigned:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "On my way":
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function Loading() {
  return (
    <div className="flex justify-center items-center py-16 text-indigo-600">

      <FaSpinner className="animate-spin text-2xl" />

      <span className="ml-3 text-sm text-gray-500">
        Loading...
      </span>

    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="text-center py-14">

      <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xl">
        <Icon />
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   API MAPPING
========================================================= */

function mapApiRequest(request) {
  const coordinates =
    request?.location?.coordinates || [];

  const lng = coordinates[0];
  const lat = coordinates[1];

  return {
    ...request,
    id: request._id,
    customer:
      request.user?.name || "Roadside User",
    phone: request.user?.phone || "",
    issue:
      request.problem ||
      request.serviceType ||
      "Roadside Assistance",
    location:
      request.address ||
      (Number.isFinite(lat) &&
      Number.isFinite(lng)
        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        : "Location unavailable"),
    requestedAt: request.createdAt,
    status: "Open",
    sos: false,
    estimatedCharge: request.fare || 0,
  };
}

function mapApiJob(request) {
  const coordinates =
    request?.location?.coordinates || [];

  const lng = coordinates[0];
  const lat = coordinates[1];

  const status =
    request.status === "enroute"
      ? "On my way"
      : "Assigned";

  return {
    ...request,
    id: request._id,
    customer:
      request.user?.name || "Roadside User",
    phone: request.user?.phone || "",
    issue:
      request.problem ||
      request.serviceType ||
      "Roadside Assistance",
    location:
      request.address ||
      (Number.isFinite(lat) &&
      Number.isFinite(lng)
        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        : "Location unavailable"),
    status,
    estimatedCharge: request.fare || 0,
  };
}

function formatDate(date) {
  if (!date) return "Recently";

  try {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "Recently";
  }
}