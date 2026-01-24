import React, { useState, useRef } from "react";
import {
  FaMotorcycle, FaCar, FaTruck, FaBus, FaTractor,
  FaLocationArrow, FaWrench, FaCamera, FaImage, FaTimes
} from "react-icons/fa";

export default function RequestHelp() {
  const [vehicle, setVehicle] = useState("");
  const [problem, setProblem] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const vehicleTypes = [
    { id: "bike", name: "Bike", icon: <FaMotorcycle /> },
    { id: "scooty", name: "Scooty", icon: <FaMotorcycle /> },
    { id: "car", name: "Car", icon: <FaCar /> },
    { id: "pickup", name: "Pickup Van", icon: <FaTruck /> },
    { id: "truck", name: "Truck", icon: <FaTruck /> },
    { id: "bus", name: "Bus", icon: <FaBus /> },
    { id: "tractor", name: "Tractor", icon: <FaTractor /> },
    { id: "erickshaw", name: "E-Rickshaw", icon: <FaCar /> },
  ];

  const problems = [
    "Engine Starting Issue",
    "Battery Dead",
    "Tyre Puncture",
    "Fuel Empty",
    "Overheating",
    "Brake Failure",
    "Electrical Fault",
    "Towing Needed",
    "Other Problem",
  ];

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Location not supported!");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lon = pos.coords.longitude.toFixed(5);
        setLocation(`${lat}, ${lon}`);
      },
      () => alert("Please enable GPS to detect location.")
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImage(preview);
  };

  const handleSubmit = () => {
    if (!vehicle || !problem || !location) {
      alert("Please fill required fields.");
      return;
    }

    alert("Request Submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 px-4 md:px-8">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-3">
        Request Roadside Assistance
      </h1>
      <p className="text-gray-400 text-center mb-10">
        Choose vehicle, describe your issue & request instant help.
      </p>

      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-700">

        {/* VEHICLE SELECT */}
        <h2 className="text-2xl font-semibold mb-4">Select Your Vehicle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {vehicleTypes.map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicle(v.id)}
              className={`p-4 flex flex-col items-center rounded-xl border transition 
                ${vehicle === v.id ? "bg-indigo-600 border-indigo-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}
              `}
            >
              <div className="text-3xl mb-2">{v.icon}</div>
              <span className="font-medium">{v.name}</span>
            </button>
          ))}
        </div>

        {/* PROBLEM SELECT */}
        <h2 className="text-2xl font-semibold mb-4">What's the Problem?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {problems.map((p) => (
            <button
              key={p}
              onClick={() => setProblem(p)}
              className={`p-3 rounded-lg border transition 
                ${problem === p ? "bg-indigo-600 border-indigo-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}
              `}
            >
              <FaWrench className="inline mr-2" />
              {p}
            </button>
          ))}
        </div>

        {/* LOCATION */}
        <h2 className="text-2xl font-semibold mb-4">Your Location</h2>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Latitude, Longitude"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-indigo-500"
          />

          <button
            onClick={detectLocation}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-lg flex items-center gap-2"
          >
            <FaLocationArrow /> Detect
          </button>
        </div>

        {/* PHOTO UPLOAD */}
        <h2 className="text-2xl font-semibold mb-4">Add Photo (optional)</h2>

        {!image && (
          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* CAMERA CAPTURE */}
            <button
              onClick={() => {
                fileInputRef.current.setAttribute("capture", "environment");
                fileInputRef.current.click();
              }}
              className="bg-gray-800 border border-gray-700 hover:bg-gray-700 p-4 rounded-xl flex items-center justify-center gap-2"
            >
              <FaCamera className="text-xl" /> Take Photo
            </button>

            {/* GALLERY */}
            <button
              onClick={() => {
                fileInputRef.current.removeAttribute("capture");
                fileInputRef.current.click();
              }}
              className="bg-gray-800 border border-gray-700 hover:bg-gray-700 p-4 rounded-xl flex items-center justify-center gap-2"
            >
              <FaImage className="text-xl" /> Choose from Gallery
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* IMAGE PREVIEW */}
        {image && (
          <div className="relative w-full mb-6">
            <img
              src={image}
              alt="uploaded"
              className="w-full rounded-xl border border-gray-700"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full text-white"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* DESCRIPTION */}
        <h2 className="text-2xl font-semibold mb-4">Describe Your Issue</h2>
        <textarea
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 bg-gray-800 border border-gray-700 p-3 rounded-lg outline-none focus:border-indigo-500"
        />

        {/* SUBMIT */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-xl"
          >
            Request Assistance
          </button>
        </div>

      </div>
    </div>
  );
}
