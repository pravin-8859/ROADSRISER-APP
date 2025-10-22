// src/pages/Shop.jsx
import React, { useState } from "react";
import petrolImg from "../assets/petrol.png";
import oilImg from "../assets/engine-oil.png";
import batteryImg from "../assets/battery.png";
import tireImg from "../assets/tire.png";
import toolKitImg from "../assets/tool-kit.png";


// Sample Products Data
const products = [
  { id: 1, name: "Premium Petrol", category: "Fuel", price: "₹120 / L", img: petrolImg },
  { id: 2, name: "Engine Oil - 4L", category: "Oil", price: "₹850", img: oilImg },
  { id: 3, name: "Car Battery", category: "Accessory", price: "₹3200", img: batteryImg },
  { id: 4, name: "Spare Tire", category: "Accessory", price: "₹2000", img: tireImg },
  { id: 5, name: "Repair Tool Kit", category: "Tools", price: "₹1500", img: toolKitImg },
  { id: 6, name: "Diesel", category: "Fuel", price: "₹110 / L", img: petrolImg }, // ya diesel ka alag image
];


export default function Shop() {
  const [filter, setFilter] = useState("All");

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((product) => product.category === filter);

  const handleQuote = (name) => {
    alert(`Thank you for your interest in ${name}. We will get back to you soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Shop at RoadRiser</h1>

      {/* Category Filter */}
      <div className="flex justify-center mb-6 space-x-4 flex-wrap">
        {["All", "Fuel", "Oil", "Tools", "Accessory"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium ${
              filter === cat
                ? "bg-red-500 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-red-500 hover:text-white"
            } transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img src={product.img} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.price}</p>
              <button
                onClick={() => handleQuote(product.name)}
                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
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
