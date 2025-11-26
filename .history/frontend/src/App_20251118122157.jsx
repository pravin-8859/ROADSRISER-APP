// src/App.jsx
import Auth from "./pages/Auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import MechanicSearch from './pages/MechanicSearch';
import RequestHelp from './pages/RequestHelp';
import Shop from './pages/Shop';
import About from './pages/About';
import Services from './pages/Services';
import GetQuote from './components/GetQuote';
import Contact from './pages/Contact';
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import DashboardUser from "./pages/DashboardUser";

import MechanicSignup from "./pages/MechanicSignup";
import MechanicLogin from "./pages/MechanicLogin";
import DashboardMechanic from "./pages/DashboardMechanic";

import AdminLogin from "./pages/AdminLogin";
import DashboardAdmin from "./pages/DashboardAdmin";
import SOSButton from "./components/SOSButton";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";




export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Padding for navbar overlap */}
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/user/signup" element={<UserSignup/>}/>
        <Route path="/user/login" element={<UserLogin/>}/>
        <Route path="/user/dashboard" element={<DashboardUser/>}/>

        <Route path="/mechanic-signup" element={<MechanicSignup/>}/>
        <Route path="/mechanic/login" element={<MechanicLogin/>}/>
        <Route path="/mechanic/dashboard" element={<DashboardMechanic/>}/>

        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<DashboardAdmin/>}/>

        <Route path="*" element={<Navigate to="/user/login"/>}/>
          <Route path="/" element={<Home />} />
          <Route path="/mechanic-search" element={<MechanicSearch />} />
          <Route path="/request-help" element={<RequestHelp />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <GetQuote />
        <Footer />
         <SOSButton />
      </div>
    </Router>
  );
}
