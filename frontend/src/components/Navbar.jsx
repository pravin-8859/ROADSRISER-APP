import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaTools,
  FaSignOutAlt,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
  FaChevronDown,
  FaPhoneAlt,
  FaHome,
  FaInfoCircle,
  FaWrench,
  FaEnvelope,
  FaRoad,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* --------------------------------
     SCROLL EFFECT
  -------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* --------------------------------
     CLOSE MENUS ON ROUTE CHANGE
  -------------------------------- */
  useEffect(() => {
    setIsOpen(false);
    setDropdown(false);
  }, [location.pathname]);

  /* --------------------------------
     AUTH
  -------------------------------- */
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  const role = localStorage.getItem("role");

  const userName = localStorage.getItem("user_name");
  const mechanicName = localStorage.getItem("mechanic_name");

  const profileName =
    role === "mechanic"
      ? mechanicName
      : userName;

  /* --------------------------------
     LOGOUT
  -------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("mechanic_name");

    setDropdown(false);
    setIsOpen(false);

    navigate("/");
  };

  /* --------------------------------
     ACTIVE ROUTE
  -------------------------------- */
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* --------------------------------
     PROFILE ICON
  -------------------------------- */
  const profileIcon =
    role === "mechanic" ? (
      <FaTools />
    ) : (
      <FaUserCircle />
    );

  /* --------------------------------
     NAV ITEMS
  -------------------------------- */
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "About",
      path: "/about",
      icon: <FaInfoCircle />,
    },
    {
      name: "Services",
      path: "/services",
      icon: <FaWrench />,
    },
    {
      name: "Shop",
      path: "/shop",
      icon: <FaShoppingBag />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <>
      {/* =========================================
          NAVBAR
      ========================================= */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[100]
          transition-all duration-500
          ${
            scrolled
              ? "px-3 md:px-6 pt-3"
              : "px-0"
          }
        `}
      >
        <div
          className={`
            mx-auto
            transition-all duration-500
            ${
              scrolled
                ? `
                  max-w-7xl
                  rounded-2xl
                  border border-white/10
                  bg-gray-950/80
                  backdrop-blur-2xl
                  shadow-[0_15px_45px_rgba(0,0,0,0.35)]
                `
                : `
                  w-full
                  bg-gray-950
                  border-b border-white/5
                `
            }
          `}
        >
          <div
            className={`
              max-w-7xl mx-auto
              h-[72px]
              px-4 sm:px-6 lg:px-7
              flex items-center justify-between
            `}
          >
            {/* =====================================
                LOGO
            ===================================== */}
            <Link
              to="/"
              className="flex items-center gap-3 shrink-0 group"
            >
              <div
                className="
                  w-11 h-11
                  rounded-xl
                  flex items-center justify-center
                  bg-gradient-to-br from-white to-gray-300
                  shadow-lg
                  group-hover:scale-105
                  group-hover:rotate-1
                  transition-all duration-300
                "
              >
                <img
                  src={logo}
                  alt="RoadsRiser"
                  className="w-9 h-9 object-contain"
                />
              </div>

              <div className="leading-none">
                <div className="text-xl font-extrabold tracking-tight text-white">
                  Roads<span className="text-blue-500">Riser</span>
                </div>

                <div className="hidden sm:block text-[9px] uppercase tracking-[0.22em] text-gray-500 mt-1">
                  Roadside Assistance
                </div>
              </div>
            </Link>

            {/* =====================================
                DESKTOP NAVIGATION
            ===================================== */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative
                      flex items-center gap-2
                      px-4 py-2.5
                      rounded-xl
                      text-sm font-medium
                      transition-all duration-300
                      ${
                        active
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-sm
                        ${
                          active
                            ? "text-blue-400"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    {item.name}

                    {active && (
                      <span
                        className="
                          absolute
                          bottom-1
                          left-1/2
                          -translate-x-1/2
                          w-5 h-[2px]
                          rounded-full
                          bg-blue-500
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* =====================================
                RIGHT SIDE
            ===================================== */}
            <div className="hidden lg:flex items-center gap-3">

              {/* REQUEST HELP */}
              {token && (
                <Link
                  to="/request-help"
                  className={`
                    flex items-center gap-2
                    px-4 py-2.5
                    rounded-xl
                    text-sm font-semibold
                    border
                    transition-all duration-300
                    ${
                      isActive("/request-help")
                        ? "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                    }
                  `}
                >
                  <FaMapMarkerAlt />
                  Request Help
                </Link>
              )}

              {/* PUBLIC AUTH */}
              {!token && (
                <>
                  <Link
                    to="/auth/mechanic/signup"
                    className="
                      px-4 py-2.5
                      rounded-xl
                      text-sm font-semibold
                      text-yellow-300
                      border border-yellow-400/20
                      bg-yellow-400/5
                      hover:bg-yellow-400
                      hover:text-gray-950
                      transition-all duration-300
                    "
                  >
                    Become a Mechanic
                  </Link>

                  <Link
                    to="/auth/user/login"
                    className="
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-xl
                      text-sm font-semibold
                      text-white
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      hover:from-blue-500
                      hover:to-indigo-500
                      shadow-lg shadow-blue-600/20
                      hover:shadow-blue-600/30
                      transition-all duration-300
                    "
                  >
                    <FaUserCircle />
                    Login
                  </Link>
                </>
              )}

              {/* LOGGED IN PROFILE */}
              {token && (
                <div className="relative">
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="
                      flex items-center gap-2.5
                      px-3 py-2
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      hover:bg-white/10
                      transition-all duration-300
                    "
                  >
                    <div
                      className="
                        w-9 h-9
                        rounded-lg
                        flex items-center justify-center
                        bg-gradient-to-br
                        from-blue-500
                        to-indigo-600
                        text-white
                      "
                    >
                      {profileIcon}
                    </div>

                    <div className="text-left hidden xl:block">
                      <p className="text-xs text-gray-500">
                        {role === "mechanic"
                          ? "Mechanic"
                          : "Welcome"}
                      </p>

                      <p className="text-sm font-semibold text-white max-w-[110px] truncate">
                        {profileName || "Account"}
                      </p>
                    </div>

                    <FaChevronDown
                      className={`
                        text-[10px] text-gray-500
                        transition-transform duration-300
                        ${
                          dropdown
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* PROFILE DROPDOWN */}
                  {dropdown && (
                    <div
                      className="
                        absolute right-0 top-full mt-3
                        w-64
                        rounded-2xl
                        overflow-hidden
                        border border-white/10
                        bg-gray-950/95
                        backdrop-blur-2xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                      "
                    >
                      {/* PROFILE HEADER */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-11 h-11
                              rounded-xl
                              flex items-center justify-center
                              bg-gradient-to-br
                              from-blue-500
                              to-indigo-600
                              text-white text-lg
                            "
                          >
                            {profileIcon}
                          </div>

                          <div className="min-w-0">
                            <p className="text-white font-semibold truncate">
                              {profileName ||
                                "RoadsRiser User"}
                            </p>

                            <p className="text-xs text-gray-500 capitalize">
                              {role || "user"} account
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DASHBOARD */}
                      <button
                        onClick={() => {
                          navigate(
                            `/${role}/dashboard`
                          );
                          setDropdown(false);
                        }}
                        className="
                          w-full
                          flex items-center gap-3
                          px-4 py-3
                          text-left
                          text-gray-300
                          hover:text-white
                          hover:bg-white/5
                          transition
                        "
                      >
                        <FaRoad className="text-blue-400" />
                        <div>
                          <p className="text-sm font-medium">
                            Dashboard
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Manage your account
                          </p>
                        </div>
                      </button>

                      {/* REQUEST HELP */}
                      <button
                        onClick={() => {
                          navigate("/request-help");
                          setDropdown(false);
                        }}
                        className="
                          w-full
                          flex items-center gap-3
                          px-4 py-3
                          text-left
                          text-gray-300
                          hover:text-white
                          hover:bg-white/5
                          transition
                        "
                      >
                        <FaMapMarkerAlt className="text-red-400" />

                        <div>
                          <p className="text-sm font-medium">
                            Request Assistance
                          </p>

                          <p className="text-[11px] text-gray-500">
                            Get roadside help
                          </p>
                        </div>
                      </button>

                      <div className="border-t border-white/10" />

                      {/* LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="
                          w-full
                          flex items-center gap-3
                          px-4 py-3
                          text-left
                          text-red-400
                          hover:bg-red-500/10
                          transition
                        "
                      >
                        <FaSignOutAlt />

                        <div>
                          <p className="text-sm font-medium">
                            Logout
                          </p>

                          <p className="text-[11px] text-red-400/60">
                            Sign out of account
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* =====================================
                MOBILE MENU BUTTON
            ===================================== */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                lg:hidden
                w-11 h-11
                flex items-center justify-center
                rounded-xl
                border border-white/10
                bg-white/5
                text-gray-200
                hover:bg-white/10
                transition
              "
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes size={19} />
              ) : (
                <FaBars size={19} />
              )}
            </button>
          </div>

          {/* =====================================
              MOBILE MENU
          ===================================== */}
          {isOpen && (
            <div
              className="
                lg:hidden
                border-t border-white/10
                bg-gray-950/95
                backdrop-blur-2xl
                rounded-b-2xl
                p-4
              "
            >
              <div className="space-y-1">

                {/* NAV ITEMS */}
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3
                        px-4 py-3
                        rounded-xl
                        text-sm font-medium
                        transition
                        ${
                          active
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <span
                        className={
                          active
                            ? "text-blue-400"
                            : "text-gray-500"
                        }
                      >
                        {item.icon}
                      </span>

                      {item.name}
                    </Link>
                  );
                })}

                {/* REQUEST HELP */}
                {token && (
                  <Link
                    to="/request-help"
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      bg-red-500/10
                      border border-red-500/20
                      text-red-400
                      font-semibold
                    "
                  >
                    <FaMapMarkerAlt />
                    Request Roadside Help
                  </Link>
                )}

                <div className="h-px bg-white/10 my-3" />

                {/* PUBLIC */}
                {!token && (
                  <>
                    <Link
                      to="/auth/mechanic/signup"
                      className="
                        block text-center
                        px-4 py-3
                        rounded-xl
                        bg-yellow-400
                        text-gray-950
                        font-semibold
                      "
                    >
                      Become a Mechanic
                    </Link>

                    <Link
                      to="/auth/user/login"
                      className="
                        mt-2
                        flex items-center justify-center gap-2
                        px-4 py-3
                        rounded-xl
                        bg-blue-600
                        text-white
                        font-semibold
                      "
                    >
                      <FaUserCircle />
                      Login
                    </Link>
                  </>
                )}

                {/* LOGGED IN */}
                {token && (
                  <>
                    <Link
                      to={`/${role}/dashboard`}
                      className="
                        flex items-center gap-3
                        px-4 py-3
                        rounded-xl
                        bg-white/5
                        text-gray-200
                      "
                    >
                      {profileIcon}
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        mt-1
                        flex items-center justify-center gap-2
                        px-4 py-3
                        rounded-xl
                        bg-red-500/10
                        text-red-400
                        font-semibold
                      "
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;