import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const user = JSON.parse(localStorage.getItem("user"));


  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      {/* Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="RoadsRiser Logo" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold text-gray-800">RoadsRiser</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              <Link
              to="/shop"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            {user ? (
    <Link to="/profile" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
  ) : (
    <Link to="/login" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
  )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/shop"
              className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            {user ? (
  <Link to="/profile" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
) : (
  <Link to="/login" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
)}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;