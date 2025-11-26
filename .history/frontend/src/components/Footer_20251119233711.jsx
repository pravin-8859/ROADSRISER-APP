import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">

      {/* 🌟 TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14 
                      grid grid-cols-1 sm:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            About RoadsRiser
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            RoadsRiser connects stranded drivers with nearby mechanics and towing
            support — making roadside help fast, simple, and reliable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
              { to: "/shop", label: "Shop" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ⭐ NEW: Mechanic Zone (ADDED ONLY THIS SECTION) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Mechanic Zone
          </h2>

          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/auth/mechanic/signup"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                Become a Mechanic
              </Link>
            </li>

            <li>
              <Link
                to="/auth/mechanic/login"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                Mechanic Login
              </Link>
            </li>

            <li>
              <Link
                to="/auth/user/login"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                User Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Get in Touch
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">📍 Mathura, India</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">📞 +91 9389867581</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">✉️ support-praviiiinn@gmail.com</p>
        </div>

      </div>

      {/* 🌟 SERVICES + SOCIALS SECTION */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 border-t border-gray-200 dark:border-gray-700 pt-10 pb-8 text-center">

        {/* Services Row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-x-12 
                        text-sm font-medium text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          {[
            "Seat Covers & Installation",
            "Towing",
            "Flat Tyre",
            "Battery Jumpstart",
            "Starting Problem",
            "Key Unlock",
            "Fuel Delivery",
            "Fitment Service",
          ].map((service, i) => (
            <span
              key={i}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 cursor-default"
            >
              {service}
            </span>
          ))}
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-10">
          <a
            href="https://www.apple.com/in/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform duration-300"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-10 md:h-12 filter dark:brightness-90"
            />
          </a>

          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-10 md:h-12 filter dark:brightness-90"
            />
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
          {[
            { icon: <FaFacebookF />, link: "https://facebook.com" },
            { icon: <FaInstagram />, link: "https://instagram.com" },
            { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
            { icon: <FaYoutube />, link: "https://youtube.com" },
            { icon: <FaWhatsapp />, link: "https://wa.me/9389867581" },
          ].map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border 
                         border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         hover:text-white hover:bg-indigo-600 hover:border-indigo-600 
                         transition-all duration-300 text-lg"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-top border-gray-200 dark:border-gray-700 mt-6">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            RoadsRiser
          </span>{" "}
          — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
