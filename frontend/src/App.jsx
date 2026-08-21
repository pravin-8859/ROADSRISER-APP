import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MechanicSearch from "./pages/MechanicSearch";
import RequestHelp from "./pages/user/RequestHelp";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import DashboardUser from "./pages/user/DashboardUser";
import MechanicSignup from "./pages/MechanicSignup";
import MechanicLogin from "./pages/MechanicLogin";
import DashboardMechanic from "./pages/DashboardMechanic";
import ForgotPassword from "./pages/ForgotPassword";
//import ResetPassword from "./pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";
import SOSButton from "./components/SOSButton";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import MechanicForgotPassword from "./pages/MechanicForgotPassword";
import MechanicResetPassword from "./pages/MechanicResetPassword";

const handleHelpRequest = (data) => {
  console.log("Help Request Submitted:", data);
};


/* =========================================
   APP LAYOUT
========================================= */

function AppLayout() {
  const location = useLocation();

  /*
    Dashboard pages already have their own
    navigation/header/sidebar.

    Therefore global public Navbar and Footer
    should NOT appear there.
  */

  const isDashboard =
    location.pathname === "/user/dashboard" ||
    location.pathname.startsWith("/user/dashboard/") ||
    location.pathname === "/mechanic/dashboard" ||
    location.pathname.startsWith("/mechanic/dashboard/");

  return (
    <div className="min-h-screen bg-[#020617]">

      {/* PUBLIC NAVBAR ONLY */}

      {!isDashboard && <Navbar />}

      {/* 
        Public pages need top spacing because Navbar
        is fixed.

        Dashboard pages don't need this spacing because
        they control their own layout.
      */}

      <main className={!isDashboard ? "pt-16" : ""}>

        <ScrollToTop />

        <Routes>

          {/* ================= USER ================= */}

          <Route
            path="/user/signup"
            element={<UserSignup />}
          />

          <Route
            path="/user/login"
            element={<UserLogin />}
          />

          <Route
            path="/user/dashboard"
            element={<DashboardUser />}
          />

          {/* ================= MECHANIC ================= */}

          <Route
            path="/auth/mechanic/signup"
            element={<MechanicSignup />}
          />

          <Route
            path="/auth/mechanic/login"
            element={<MechanicLogin />}
          />

          <Route
            path="/mechanic/dashboard"
            element={
              <ProtectedRoute>
                <DashboardMechanic />
              </ProtectedRoute>
            }
          />

          {/* ================= PASSWORD ================= */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
  path="/mechanic/forgot-password"
  element={<MechanicForgotPassword />}
/>

<Route
  path="/mechanic/reset-password"
  element={<MechanicResetPassword />}
/>

          {/* <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          /> */}

          {/* ================= PUBLIC ================= */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/mechanic-search"
            element={<MechanicSearch />}
          />

          <Route
  path="/request-help"
  element={
    <UserProtectedRoute>
      <RequestHelp
        onSubmit={handleHelpRequest}
      />
    </UserProtectedRoute>
  }
/>

          <Route
            path="/"
            element={<Home />}
          />

          {/* ================= FALLBACK ================= */}

          <Route
            path="*"
            element={<Navigate to="/user/login" replace />}
          />

        </Routes>

      </main>

      {/* PUBLIC FOOTER ONLY */}

      {!isDashboard && <Footer />}

      {/* 
        SOS is useful on public/user pages,
        but dashboard can have its own emergency action.
      */}

      {!isDashboard && <SOSButton />}

    </div>
  );
}


/* =========================================
   APP
========================================= */

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}