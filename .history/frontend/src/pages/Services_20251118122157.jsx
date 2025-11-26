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
      icon: <FaTools className="text-red-500 text-3xl" />,
      title: "Mechanical Repairs",
      desc: "Brake, clutch, engine repair and more.",
    },
    {
      icon: <FaCarCrash className="text-yellow-500 text-3xl" />,
      title: "Accident Assistance",
      desc: "Emergency support during accidents.",
    },
    {
      icon: <FaGasPump className="text-green-500 text-3xl" />,
      title: "Fuel Delivery",
      desc: "Petrol, Diesel, and Oils delivered nearby.",
    },
    {
      icon: <FaTruck className="text-blue-500 text-3xl" />,
      title: "Towing Service",
      desc: "Vehicle towing to nearby garage.",
    },
    {
      icon: <FaBolt className="text-purple-500 text-3xl" />,
      title: "Battery Jumpstart",
      desc: "Instant battery assistance.",
    },
    {
      icon: <FaMapMarkedAlt className="text-orange-500 text-3xl" />,
      title: "Nearby Mechanic Connect",
      desc: "Find and contact local mechanics instantly.",
    },
    {
      icon: <FaHandshake className="text-indigo-500 text-3xl" />,
      title: "Customer Support",
      desc: "24/7 professional guidance.",
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
    <div className="px-4 md:px-12 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Our Services
      </h1>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all text-center"
          >
            <div className="mb-4 flex justify-center">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing Plans */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Pricing Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingPlans.map((plan, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all text-center"
          >
            <span className="inline-block mb-2 px-3 py-1 bg-indigo-500 text-white text-sm rounded-full">
              {plan.note}
            </span>
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-xl font-semibold mb-4">
              ₹{plan.price}
            </p>
            <ul className="text-gray-600 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="mb-1">
                  • {feature}
                </li>
              ))}
            </ul>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Request Service
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
