import React from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

export default function UserProtectedRoute({
  children,
}) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "user") {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{
          redirectTo:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return children;
}