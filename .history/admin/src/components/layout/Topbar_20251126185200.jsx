export default function Topbar() {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 z-10">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </header>
  );
}
