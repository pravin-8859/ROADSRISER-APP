// src/pages/Services.jsx
import React from "react";
import {
  FaTools,
  FaCarCrash,
  FaGasPump,
  FaTruck,
  FaBolt,
  FaMapMarkedAlt,
  FaHandshake,
} from "react-icons/fa";

export default function Services() {
  const services = [
    {
      icon: <FaTools className="text-red-500 text-4xl" />,
      title: "Mechanical Repairs",
      desc: "Brake, clutch, engine repair and more.",
    },
    {
      icon: <FaCarCrash className="text-yellow-500 text-4xl" />,
      title: "Accident Assistance",
      desc: "Emergency support during accidents.",
    },
    {
      icon: <FaGasPump className="text-green-500 text-4xl" />,
      title: "Fuel Delivery",
      desc: "Petrol, Diesel, and Oils delivered nearby.",
    },
    {
      icon: <FaTruck className="text-blue-500 text-4xl" />,
      title: "Towing Service",
      desc: "Vehicle towing to nearby garage.",
    },
    {
      icon: <FaBolt className="text-purple-500 text-4xl" />,
      title: "Battery Jumpstart",
      desc: "Instant battery assistance.",
    },
    {
      icon: <FaMapMarkedAlt className="text-orange-500 text-4xl" />,
      title: "Nearby Mechanic Connect",
      desc: "Find and contact local mechanics instantly.",
    },
    {
      icon: <FaHandshake className="text-indigo-500 text-4xl" />,
      title: "Customer Support",
      desc: "24/7 professional guidance anytime.",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: 499,
      features: ["Emergency roadside assistance", "Battery jumpstart"],
      note: "Quick Help",
    },
    {
      name: "Standard",
      price: 999,
      features: ["Basic + Minor Repairs", "Oil change"],
      note: "Most Popular",
    },
    {
      name: "Premium",
      price: 1499,
      features: ["Standard + Towing", "Full vehicle checkup", "Fuel delivery"],
      note: "All-in-One",
    },
    {
      name: "Custom / Quote",
      price: "Varies",
      features: ["Choose any combination of services"],
      note: "Get a Personalized Quote",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-6 md:px-12 transition-colors duration-500">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        Our Services
      </h1>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="mb-4 flex justify-center">{service.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* PRICING PLANS */}
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Pricing Plans
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-20">
        {pricingPlans.map((plan, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center border border-gray-200 dark:border-gray-700"
          >
            <span className="inline-block mb-3 px-4 py-1 bg-indigo-600 text-white text-sm rounded-full dark:bg-indigo-500">
              {plan.note}
            </span>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>

            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              ₹{plan.price}
            </p>

            <ul className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition">
              Request Service
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
