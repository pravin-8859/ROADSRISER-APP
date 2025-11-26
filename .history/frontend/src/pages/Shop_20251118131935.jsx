// src/pages/Shop.jsx
import React, { useState } from "react";
import petrolImg from "../assets/petrol.png";
import oilImg from "../assets/engine-oil.png";
import batteryImg from "../assets/battery.png";
import tireImg from "../assets/tire.png";
import toolKitImg from "../assets/tool-kit.png";

const products = [
  { id: 1, name: "Premium Petrol", category: "Fuel", price: "₹120 / L", img: petrolImg },
  { id: 2, name: "Engine Oil - 4L", category: "Oil", price: "₹850", img: oilImg },
  { id: 3, name: "Car Battery", category: "Accessory", price: "₹3200", img: batteryImg },
  { id: 4, name: "Spare Tire", category: "Accessory", price: "₹2000", img: tireImg },
  { id: 5, name: "Repair Tool Kit", category: "Tools", price: "₹1500", img: toolKitImg },
  { id: 6, name: "Diesel", category: "Fuel", price: "₹110 / L", img: petrolImg },
];

export default function Shop() {
  const [filter, setFilter] = useState("All");

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((product) => product.category === filter);

  const handleQuote = (name) => {
    alert(`Thank you for your interest in ${name}. We will contact you soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 md:px-10 transition-colors duration-500">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
        Shop at RoadRiser
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center mb-10 gap-4 flex-wrap">
        {["All", "Fuel", "Oil", "Tools", "Accessory"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition-all shadow 
              ${
                filter === cat
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-indigo-600 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 p-4"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {product.price}
              </p>

              <button
                onClick={() => handleQuote(product.name)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition"
              >
                Get a Quote
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
