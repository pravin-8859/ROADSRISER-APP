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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! We will contact you soon.");
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        Contact Us
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions or need roadside assistance? Reach out to us anytime.
          </p>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaPhoneAlt />
            <span>+91 9389867581</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaEnvelope />
            <span>praviiiinn@gmail.com</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaMapMarkerAlt />
            <span>Mathura, India (Serving Nationwide soon)</span>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Instagram
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Twitter
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              LinkedIn
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Github
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Send a Message
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="4"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Get a Quote
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Our Coverage Area
        </h2>
        <div className="w-full h-64 md:h-96 bg-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">Map coming soon - serving Mathura & nearby cities</p>
        </div>
      </div>
    </div>
  );
}
