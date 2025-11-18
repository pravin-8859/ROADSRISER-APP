import React, { useState } from "react";
import { createRequestApi } from "../../api/userApi";

export default function RequestNew({ onSuccess }) {
  const [form, setForm] = useState({
    vehicle: "Car",
    serviceType: "Towing",
    description: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Try detect geolocation (optional)
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm(f => ({ ...f, address: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` }));
    }, () => alert("Couldn't get location"));
  };

  const handleChange = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.address) return alert("Please provide address or use My Location");
    try {
      setLoading(true);
      const payload = {
        vehicle: form.vehicle,
        serviceType: form.serviceType,
        description: form.description,
        address: form.address,
        // sample location object if you want to send coordinates:
        // location: { type: "Point", coordinates: [lng, lat] }
      };
      const res = await createRequestApi(payload);
      setLoading(false);
      alert("Request created successfully");
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Failed to create request");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <select value={form.vehicle} onChange={e=>handleChange("vehicle", e.target.value)} className="input">
          <option>Car</option>
          <option>Bike</option>
          <option>Truck</option>
        </select>
        <select value={form.serviceType} onChange={e=>handleChange("serviceType", e.target.value)} className="input">
          <option>Towing</option>
          <option>Flat Tyre</option>
          <option>Battery Jumpstart</option>
          <option>Key Unlock</option>
          <option>Fuel Delivery</option>
        </select>
      </div>

      <textarea placeholder="Describe the issue (optional)" value={form.description} onChange={e=>handleChange("description", e.target.value)} className="input h-28" />

      <input placeholder="Pickup address or landmark" value={form.address} onChange={e=>handleChange("address", e.target.value)} className="input" />

      <div className="flex gap-3">
        <button type="button" onClick={handleUseMyLocation} className="px-4 py-2 rounded-lg border">Use my location</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
          {loading ? "Creating..." : "Create Request"}
        </button>
      </div>

      <style>{`
        .input { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #e5e7eb; background:transparent }
      `}</style>
    </form>
  );
}
