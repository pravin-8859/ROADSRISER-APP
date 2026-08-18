import React, { useRef, useState } from "react";
import { createRequestApi } from "../../api/userApi";
import {
  FaMotorcycle,
  FaCar,
  FaTruck,
  FaBus,
  FaTractor,
  FaLocationArrow,
  FaWrench,
  FaCamera,
  FaImage,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

export default function RequestHelp({ onSuccess }) {
  const [vehicle, setVehicle] = useState("");
  const [problem, setProblem] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const vehicleTypes = [
    { id: "bike", name: "Bike", icon: <FaMotorcycle /> },
    { id: "scooty", name: "Scooty", icon: <FaMotorcycle /> },
    { id: "car", name: "Car", icon: <FaCar /> },
    { id: "pickup", name: "Pickup", icon: <FaTruck /> },
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
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);

        setLocation(`${lat}, ${lng}`);
      },
      () => {
        alert("Please allow location access to detect your position.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setImage({
      file,
      preview,
    });
  };

  const removeImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!vehicle) {
      alert("Please select your vehicle.");
      return;
    }

    if (!problem) {
      alert("Please select the problem.");
      return;
    }

    if (!location) {
      alert("Please detect or enter your location.");
      return;
    }

    try {
      setLoading(true);

      const [lat, lng] = location
        .split(",")
        .map((value) => Number(value.trim()));

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        alert("Please enter a valid latitude and longitude.");
        setLoading(false);
        return;
      }

      const payload = {
        vehicleType: vehicle,
        problem,
        description: description.trim(),
        serviceType: problem,

        location: {
          type: "Point",
          coordinates: [lng, lat],
        },

        address: location,
      };

      const res = await createRequestApi(payload);

      if (res?.success) {
        alert("Roadside assistance request created successfully.");

        setVehicle("");
        setProblem("");
        setDescription("");
        setLocation("");
        removeImage();

        if (typeof onSuccess === "function") {
          onSuccess();
        }
      } else {
        alert("Unable to create request.");
      }
    } catch (error) {
      console.error("Create request error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create roadside request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* INTRO */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
          <FaWrench />
          Instant Roadside Assistance
        </div>

        <h2 className="text-2xl md:text-3xl font-bold">
          Tell us what happened
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Select your vehicle, describe the problem and share your current
          location.
        </p>
      </div>

      {/* VEHICLE */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            1. Select your vehicle
          </h3>

          {vehicle && (
            <span className="text-sm text-indigo-600 dark:text-indigo-400">
              Selected: {vehicle}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {vehicleTypes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVehicle(item.id)}
              className={`p-4 rounded-xl border transition-all ${
                vehicle === item.id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-700/40"
              }`}
            >
              <div className="text-2xl flex justify-center mb-2">
                {item.icon}
              </div>

              <p className="text-sm font-semibold">
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section>
        <h3 className="text-lg font-bold mb-4">
          2. What's the problem?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {problems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setProblem(item)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                problem === item
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 bg-gray-50 dark:bg-gray-700/40"
              }`}
            >
              <FaWrench />
              <span className="font-medium text-sm">
                {item}
              </span>

              {problem === item && (
                <FaCheckCircle className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section>
        <h3 className="text-lg font-bold mb-4">
          3. Your location
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Latitude, Longitude"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-indigo-500"
          />

          <button
            type="button"
            onClick={detectLocation}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            <FaLocationArrow />
            Detect Location
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Example: 27.4924, 77.6737
        </p>
      </section>

      {/* PHOTO */}
      <section>
        <h3 className="text-lg font-bold mb-4">
          4. Add a photo
          <span className="text-sm font-normal text-gray-500 ml-2">
            (optional)
          </span>
        </h3>

        {!image ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.setAttribute(
                  "capture",
                  "environment"
                );
                fileInputRef.current?.click();
              }}
              className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition flex items-center justify-center gap-2"
            >
              <FaCamera />
              Take Photo
            </button>

            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.removeAttribute("capture");
                fileInputRef.current?.click();
              }}
              className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition flex items-center justify-center gap-2"
            >
              <FaImage />
              Choose Image
            </button>
          </div>
        ) : (
          <div className="relative max-w-md">
            <img
              src={image.preview}
              alt="Problem preview"
              className="w-full max-h-72 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </section>

      {/* DESCRIPTION */}
      <section>
        <h3 className="text-lg font-bold mb-4">
          5. Describe the issue
        </h3>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell the mechanic anything that may help..."
          className="w-full min-h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-indigo-500 resize-none"
        />
      </section>

      {/* SUBMIT */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading
            ? "Creating Request..."
            : "Request Roadside Assistance"}
        </button>
      </div>
    </div>
  );
}