// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaBolt,
  FaMapMarkerAlt,
  FaGasPump,
  FaTruck,
  FaCarCrash,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 transition-colors duration-500">

      {/* HERO SECTION */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* Left */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              Fast, Reliable  
              <span className="text-indigo-600 dark:text-indigo-400"> Roadside Assistance</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Stuck on the road? Get instant help from nearby trusted mechanics and towing support — anytime, anywhere.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/request-help"
                className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Request Help
              </Link>

              <Link
                to="/services"
                className="px-8 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-semibold hover:bg-indigo-600 hover:text-white transition-all"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="flex-1">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/towing-car-illustration-download-in-svg-png-gif-file-formats--accident-repair-mechanic-auto-service-pack-people-illustrations-6840135.png"
              alt="Roadside Assistance"
              className="w-full drop-shadow-2xl dark:brightness-90"
            />
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-500">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          What We Offer
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {[
            { icon: <FaTools />, title: "Mechanical Repair", desc: "Quick professional mechanic support nearby." },
            { icon: <FaBolt />, title: "Battery Jumpstart", desc: "Instant battery jumpstart anytime." },
            { icon: <FaGasPump />, title: "Fuel Delivery", desc: "Petrol & diesel delivered directly to you." },
            { icon: <FaTruck />, title: "Towing Support", desc: "Vehicle towing to nearest garage safely." },
            { icon: <FaMapMarkerAlt />, title: "Live Location", desc: "Mechanic arrives faster using GPS location." },
            { icon: <FaCarCrash />, title: "Accident Help", desc: "Emergency support during breakdowns." },
          ].map((s, i) => (
            <div
              key={i}
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all text-center"
            >
              <div className="text-4xl text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center">
                {s.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-indigo-600 dark:text-indigo-400">
          RoadRiser in Numbers
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { count: "1000+", label: "Active Users" },
            { count: "50+", label: "Mechanics Connected" },
            { count: "10+", label: "Cities Covered" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-indigo-50 dark:bg-gray-800 p-10 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
                {item.count}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative text-center py-24 px-6  
        bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        text-white dark:text-gray-100 transition-colors duration-500 overflow-hidden">

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-5"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Need Instant Roadside Assistance?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 dark:text-gray-300 max-w-2xl mx-auto">
            We connect you to the nearest verified mechanics within seconds.
          </p>

          <Link
            to="/request-help"
            className="inline-block bg-white text-indigo-700 dark:bg-indigo-600 dark:text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Request Help
          </Link>
        </div>
      </section>
    </div>
  );
}
