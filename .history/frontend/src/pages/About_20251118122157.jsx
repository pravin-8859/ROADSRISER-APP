// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import founderImg from '../assets/logo.png'; // Replace with actual founder image if available



export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Hero Section */}
      <section className="bg-blue-100 flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About RoadRiser</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Connecting you instantly with nearby mechanics for any roadside emergency.
        </p>
        <Link
          to="#vision"
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Learn More
        </Link>
      </section>

      {/* Founder Story Section */}
      <section id="vision" className="max-w-5xl mx-auto my-16 px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src={founderImg}
            alt="Founder"
            className="w-48 h-48 object-cover rounded-full shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Founder & Vision</h2>
            <p className="text-gray-700 mb-4">
              RoadRiser was inspired by the struggles of rural travelers stranded without immediate help. 
              Our founder, Pravin Kumar, envisioned a platform where anyone could connect with nearby 
              mechanics instantly, ensuring safety and quick assistance.
            </p>
            <p className="text-gray-700">
              Starting with just a laptop and determination, the platform now helps users across multiple states.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <i className="fas fa-map-marker-alt text-3xl text-red-500 mb-4"></i>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Nearby Mechanics</h3>
            <p className="text-gray-700">Find trusted mechanics near you instantly.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <i className="fas fa-bolt text-3xl text-yellow-500 mb-4"></i>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">SOS Requests</h3>
            <p className="text-gray-700">Send an emergency help request with just one click.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition text-center">
            <i className="fas fa-tools text-3xl text-green-500 mb-4"></i>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Shop & Services</h3>
            <p className="text-gray-700">Browse local shops, services, and get instant support.</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="max-w-5xl mx-auto my-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Impact So Far</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">1000+</h3>
            <p className="text-gray-700">Active Users</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">50+</h3>
            <p className="text-gray-700">Mechanics Connected</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">10+</h3>
            <p className="text-gray-700">Cities Covered</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4 px-4">
          <div className="faq-item border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-gray-800">How do I request help?</h3>
            <p className="text-gray-700 mt-2 hidden">
              Click the SOS button on the home page and nearby mechanics will be notified immediately.
            </p>
          </div>
          <div className="faq-item border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-gray-800">Is my location safe?</h3>
            <p className="text-gray-700 mt-2 hidden">
              Yes! Your location is securely shared only with the mechanics you connect with.
            </p>
          </div>
          <div className="faq-item border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-gray-800">Can I become a mechanic partner?</h3>
            <p className="text-gray-700 mt-2 hidden">
              Absolutely! Register as a mechanic on the platform and start helping nearby users.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center my-16 px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Join the RoadRiser Mission</h2>
        <p className="text-gray-700 mb-4">
          Connect, support, or partner with us to make roadside assistance instant for everyone.
        </p>
        <Link
          to="/request-help"
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Request Help
        </Link>
      </section>
    </div>
  );
}
