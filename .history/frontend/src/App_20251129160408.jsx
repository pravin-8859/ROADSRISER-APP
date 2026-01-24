
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home"; // keep if exists
import MechanicSearch from "./pages/MechanicSearch";
import RequestHelp from "./pages/RequestHelp";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import DashboardUser from "./pages/user/DashboardUser";
import MechanicSignup from "./pages/MechanicSignup";
import MechanicLogin from "./pages/MechanicLogin";
import DashboardMechanic from "./pages/DashboardMechanic"; // full mechanic dashboard demo
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";
import SOSButton from "./components/SOSButton";

import AdminLogin from "./pages/AdminLogin";
import DashboardAdmin from "./pages/DashboardAdmin";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <ScrollToTop />
        <Routes>
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<DashboardUser />} />
          <Route path="/auth/mechanic/signup" element={<MechanicSignup />} />
          <Route path="/auth/mechanic/login" element={<MechanicLogin />} />
          <Route path="/mechanic/dashboard" element={<DashboardMechanic />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/mechanic-search" element={<MechanicSearch />} />
          <Route path="/request-help" element={<RequestHelp onSubmit={yourFunction} />} />

          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/user/login" />} />

          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/dashboard" element={<DashboardAdmin/>} /> 
        </Routes>
        <Footer />
        <SOSButton />
      </div>
    </Router>
  );
}
