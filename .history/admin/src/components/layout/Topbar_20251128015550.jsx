import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("admin_name") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    navigate("/admin/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand" onClick={() => navigate("/admin")}>
          RoadsRiser Admin
        </div>
      </div>
      <div className="topbar-right">
        <div className="admin-info">
          <div className="admin-avatar" title={adminName}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="admin-name">{adminName}</div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
