import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-700">
        
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">About RoadsRiser</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            RoadsRiser connects stranded drivers with nearby mechanics and towing
            support — making roadside help fast, simple, and reliable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-black transition">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-black transition">About</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-black transition">Services</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-black transition">Contact</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-black transition">Shop</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Get in Touch</h2>
          <p className="text-sm text-gray-600">📍 Mathura, India</p>
          <p className="text-sm text-gray-600">📞 +91 9389867581</p>
          <p className="text-sm text-gray-600">✉️ support-praviiiinn@gmail.com</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 mt-6 pt-4 pb-2 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RoadsRiser — All rights reserved.
      </div>
    </footer>
  );
}
