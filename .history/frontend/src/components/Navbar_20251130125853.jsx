import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaTools,
  FaSignOutAlt,
  FaShoppingBag
} from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const navigate = useNavigate();

  // Scroll detect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -------------------------
  // Authentication Logic
  // -------------------------
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
 // FIXED: mechanic & user same key
  const role = localStorage.getItem("role"); // user || mechanic

  const userName = localStorage.getItem("user_name");
  const mechanicName = localStorage.getItem("mechanic_name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Which icon to show?
  const profileIcon =
    role === "mechanic" ? (
      <FaTools className="text-3xl" />
    ) : (
      <FaUserCircle className="text-3xl" />
    );

  const profileName = role === "mechanic" ? mechanicName : userName;

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
        scrolled
          ? "w-[95%] md:w-[90%] lg:w-[85%] backdrop-blur-xl bg-white/20 dark:bg-gray-900/30 border border-white/30 rounded-3xl shadow-xl"
          : "w-full bg-gray-900 dark:bg-gray-950 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-gradient-to-br from-gray-200 to-gray-400 p-[6px] rounded-full shadow-xl hover:scale-105 transition">
              <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-100 tracking-wide">
              RoadsRiser
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/services" className="nav-link">
              Services
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>

            <Link to="/shop" className="nav-link flex items-center gap-1">
              <FaShoppingBag /> Shop
            </Link>

            {/* --------------------- AUTH SECTION --------------------- */}
            {!token && (
              <>
                {/* Become Mechanic */}
                <Link
                  to="/auth/mechanic/signup"
                  className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-300 transition"
                >
                  Become a Mechanic
                </Link>

                {/* User Login */}
                <Link
                  to="/auth/user/login"
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition shadow"
                >
                  <FaUserCircle size={18} /> Login
                </Link>
              </>
            )}

            {/* --------------------- LOGGED IN SECTION --------------------- */}
            {token && (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 text-white"
                >
                  {profileIcon}
                  {profileName && (
                    <span className="text-sm font-medium">{profileName}</span>
                  )}
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-3 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-48 overflow-hidden border border-gray-300 dark:border-gray-700">
                    {/* Dashboard */}
                    <button
                      onClick={() => {
                        navigate(`/${role}/dashboard`);
                        setDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {profileIcon}
                      Dashboard
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* --------------------- MOBILE MENU --------------------- */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3 shadow-lg">
          <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/about"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/services"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <Link
            to="/shop"
            className="mobile-link flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <FaShoppingBag /> Shop
          </Link>

          {!token ? (
            <>
              <Link
                to="/auth/mechanic/signup"
                className="w-full block bg-yellow-400 text-gray-900 text-center py-2 font-semibold rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Become a Mechanic
              </Link>

              <Link
                to="/auth/user/login"
                className="w-full block bg-blue-600 text-white text-center py-2 font-semibold rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/${role}/dashboard`}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .nav-link {
          color: #d1d5db;
          font-size: 0.95rem;
          padding: 6px 10px;
          transition: 0.3s;
        }
        .nav-link:hover { color: #ffffff; }

        .mobile-link {
          color: #e5e7eb;
          padding: 10px;
          display: block;
          border-radius: 6px;
        }
        .mobile-link:hover { background: #374151; }
      `}</style>
    </nav>
  );
};

export default Navbar;
