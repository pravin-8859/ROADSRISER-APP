import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaArrowUp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaTools,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/shop", label: "Shop" },
    { to: "/contact", label: "Contact" },
  ];

  const mechanicLinks = [
    {
      to: "/auth/mechanic/signup",
      label: "Become a Mechanic",
    },
    {
      to: "/auth/mechanic/login",
      label: "Mechanic Login",
    },
    {
      to: "/auth/user/login",
      label: "User Login",
    },
  ];

  const services = [
    "Flat Tyre Assistance",
    "Battery Jumpstart",
    "Towing Service",
    "Fuel Delivery",
    "Engine Assistance",
    "Key Unlock",
    "Starting Problem",
    "Emergency Roadside Help",
  ];

  const socials = [
    {
      icon: <FaFacebookF />,
      link: "https://www.facebook.com/",
      label: "Facebook",
    },
    {
      icon: <FaInstagram />,
      link: "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: <FaLinkedinIn />,
      link: "https://www.linkedin.com/",
      label: "LinkedIn",
    },
    {
      icon: <FaYoutube />,
      link: "https://www.youtube.com/",
      label: "YouTube",
    },
    {
      icon: <FaWhatsapp />,
      link: "https://wa.me/919389867581",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="relative bg-[#020617] text-gray-300 overflow-hidden">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* =========================================
          TOP CTA
      ========================================= */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16">

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-blue-500/20
            bg-gradient-to-br
            from-blue-600/15
            via-indigo-600/10
            to-transparent
            px-6
            py-10
            md:px-10
            md:py-12
          "
        >
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full border border-blue-400/10" />
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-blue-400/10" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                24/7 Roadside Assistance
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white">
                Stranded on the road?
              </h2>

              <p className="mt-3 text-gray-400 max-w-xl">
                Get connected with trusted roadside assistance and get back
                on the road with confidence.
              </p>
            </div>

            <Link
              to="/request-help"
              className="
                shrink-0
                inline-flex
                items-center
                justify-center
                px-7
                py-3.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                font-semibold
                shadow-xl
                shadow-blue-600/20
                hover:scale-[1.03]
                hover:shadow-blue-600/30
                transition-all
                duration-300
              "
            >
              Request Assistance
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================
          MAIN FOOTER
      ========================================= */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* =====================================
              BRAND
          ===================================== */}
          <div className="lg:pr-8">

            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  group-hover:scale-105
                  transition-transform
                "
              >
                <img
                  src="/src/assets/logo.png"
                  alt="RoadsRiser"
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Roads<span className="text-blue-500">Riser</span>
                </h2>

                <p className="text-[9px] tracking-[0.28em] text-gray-500">
                  ROADSIDE ASSISTANCE
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              RoadsRiser connects stranded drivers with nearby trusted
              mechanics and roadside assistance — quickly, safely and
              reliably.
            </p>

            {/* Trust badges */}
            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FaShieldAlt className="text-blue-400" />
                </div>
                <span>Verified & Trusted Mechanics</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FaClock className="text-emerald-400" />
                </div>
                <span>24/7 Emergency Assistance</span>
              </div>

            </div>
          </div>

          {/* =====================================
              QUICK LINKS
          ===================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="
                      inline-flex
                      items-center
                      text-sm
                      text-gray-400
                      hover:text-blue-400
                      hover:translate-x-1
                      transition-all
                      duration-200
                    "
                  >
                    <span className="mr-2 text-blue-500">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================
              SERVICES
          ===================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Our Services
            </h3>

            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-400
                    hover:text-blue-400
                    transition-colors
                  "
                >
                  <FaTools className="text-[10px] text-blue-500" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================
              CONTACT
          ===================================== */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              Get In Touch
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-400 text-sm" />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Location
                  </p>
                  <p className="text-sm text-gray-300">
                    Mathura, India
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FaPhoneAlt className="text-blue-400 text-sm" />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Phone
                  </p>

                  <a
                    href="tel:+919389867581"
                    className="text-sm text-gray-300 hover:text-blue-400 transition"
                  >
                    +91 9389867581
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-blue-400 text-sm" />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Email
                  </p>

                  <a
                    href="mailto:praviiiinn@gmail.com"
                    className="text-sm text-gray-300 hover:text-blue-400 transition break-all"
                  >
                    praviiiinn@gmail.com
                  </a>
                </div>
              </div>

            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-7">

              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    border
                    border-white/10
                    bg-white/[0.03]
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    hover:text-white
                    hover:bg-blue-600
                    hover:border-blue-500
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  {social.icon}
                </a>
              ))}

            </div>
          </div>

        </div>

        {/* =========================================
            MECHANIC ZONE
        ========================================= */}
        <div
          className="
            mt-14
            pt-8
            border-t
            border-white/10
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-6
          "
        >

          <div className="flex items-center gap-3">
            <FaTools className="text-yellow-400" />

            <span className="text-sm text-gray-400">
              Are you a mechanic?
            </span>

            <Link
              to="/auth/mechanic/signup"
              className="
                text-sm
                font-semibold
                text-yellow-400
                hover:text-yellow-300
                transition
              "
            >
              Join RoadsRiser →
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/auth/mechanic/login"
              className="text-gray-500 hover:text-gray-300 transition"
            >
              Mechanic Login
            </Link>

            <Link
              to="/auth/user/login"
              className="text-gray-500 hover:text-gray-300 transition"
            >
              User Login
            </Link>
          </div>

        </div>

        {/* =========================================
            BOTTOM BAR
        ========================================= */}
        <div
          className="
            mt-8
            pt-6
            border-t
            border-white/10
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
          "
        >

          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-300 font-semibold">
              RoadsRiser
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <span>Fast</span>
            <span>•</span>
            <span>Reliable</span>
            <span>•</span>
            <span>24/7 Assistance</span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            className="
              w-10
              h-10
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              flex
              items-center
              justify-center
              text-gray-400
              hover:text-white
              hover:bg-blue-600
              hover:border-blue-500
              transition-all
              duration-300
            "
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>

        </div>

      </div>
    </footer>
  );
}