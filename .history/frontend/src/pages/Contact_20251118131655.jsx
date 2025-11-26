// src/pages/Contact.jsx
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We will contact you soon.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 px-4 transition-colors duration-500">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Contact Us
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left Side - Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 transition-colors duration-500">

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Get in Touch
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            Have questions or need roadside assistance? We are here 24/7.
          </p>

          {/* Contact Items */}
          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <FaPhoneAlt className="text-indigo-600 dark:text-indigo-400" />
            <span>+91 9389867581</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <FaEnvelope className="text-indigo-600 dark:text-indigo-400" />
            <span>praviiiinn@gmail.com</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
            <span>Mathura, India (Nationwide service coming soon)</span>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-6">
            {[
              { label: "Instagram", link: "https://instagram.com" },
              { label: "Twitter", link: "https://x.com" },
              { label: "LinkedIn", link: "https://linkedin.com" },
              { label: "Github", link: "https://github.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 
              focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 
              focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 outline-none"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 
              focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 outline-none"
              required
            />

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 
              focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 outline-none"
              required
            >
              <option value="">Select Service</option>
              <option value="mechanic">Nearby Mechanic</option>
              <option value="towing">Car Towing</option>
              <option value="oil">Petrol & Oil Delivery</option>
              <option value="emergency">Emergency Assistance</option>
              <option value="shop">Shop Inquiry</option>
            </select>

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 
              focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 outline-none"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* Map Placeholder */}
      <div className="max-w-5xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Our Coverage Area
        </h2>

        <div className="w-full h-64 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-700 dark:text-gray-300">
            Map integration coming soon — serving Mathura & nearby cities
          </p>
        </div>
      </div>
    </div>
  );
}
