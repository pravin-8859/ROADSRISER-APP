// src/components/GetQuote.jsx
import React, { useState } from "react";

export default function GetQuote() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !service) {
      alert("Please fill both fields!");
      return;
    }
    alert(`Thank you, ${name}! We will contact you for ${service}.`);
    setName("");
    setService("");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Get a Quote
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Service Needed"
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
