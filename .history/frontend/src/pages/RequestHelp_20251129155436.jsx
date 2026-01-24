import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaMotorcycle,
  FaCar,
  FaBicycle,
  FaCamera,
  FaTools,
  FaClock,
} from "react-icons/fa";

export default function RequestHelp({ onSubmit }) {
  const [vehicle, setVehicle] = useState("");
  const [problem, setProblem] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [nearby, setNearby] = useState(0);
  const [loadingLoc, setLoadingLoc] = useState(false);

  // ---- Auto Detect Location ----
  const getAutoLocation = () => {
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation(`${lat}, ${lng}`);

        /// simulate backend nearby mechanics count
        setNearby(Math.floor(Math.random() * 7) + 1);
        setLoadingLoc(false);
      },
      () => {
        alert("Unable to fetch location.");
        setLoadingLoc(false);
      }
    );
  };

  useEffect(() => {
    getAutoLocation();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const submitRequest = () => {
    if (!vehicle || !problem || !location) {
      alert("Please fill all required details.");
      return;
    }

    onSubmit?.({
      vehicle,
      problem,
      location,
      photo,
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-20">

      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-4">Request Assistance</h1>
      <p className="text-gray-300 mb-6">
        Describe your problem and we’ll connect a nearby mechanic instantly.
      </p>

      {/* NEARBY MECHANICS */}
      <div className="bg-indigo-600 text-white p-4 rounded-xl flex justify-between items-center shadow-lg mb-6">
        <div>
          <p className="text-lg font-semibold">{nearby} mechanics available</p>
          <small className="opacity-90">within 5km radius</small>
        </div>
        <FaTools size={30} />
      </div>

      {/* VEHICLE TYPE */}
      <div className="mb-6">
        <label className="text-gray-300 font-medium">Select Vehicle</label>
        <div className="grid grid-cols-3 gap-3 mt-3">

          <button
            className={`p-4 rounded-xl bg-gray-800 border ${
              vehicle === "bike" ? "border-indigo-500" : "border-gray-700"
            } text-center`}
            onClick={() => setVehicle("bike")}
          >
            <FaMotorcycle size={28} className="mx-auto mb-2 text-white" />
            <p className="text-gray-300">Bike</p>
          </button>

          <button
            className={`p-4 rounded-xl bg-gray-800 border ${
              vehicle === "car" ? "border-indigo-500" : "border-gray-700"
            } text-center`}
            onClick={() => setVehicle("car")}
          >
            <FaCar size={28} className="mx-auto mb-2 text-white" />
            <p className="text-gray-300">Car</p>
          </button>

          <button
            className={`p-4 rounded-xl bg-gray-800 border ${
              vehicle === "scooty" ? "border-indigo-500" : "border-gray-700"
            } text-center`}
            onClick={() => setVehicle("scooty")}
          >
            <FaBicycle size={28} className="mx-auto mb-2 text-white" />
            <p className="text-gray-300">Scooty</p>
          </button>

        </div>
      </div>

      {/* PROBLEM LIST */}
      <div className="mb-6">
        <label className="text-gray-300 font-medium">Problem Type</label>

        <select
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full p-3 mt-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700"
        >
          <option value="">Select problem</option>
          <option value="puncture">Tyre Puncture</option>
          <option value="battery">Battery Down</option>
          <option value="engine">Engine Issue</option>
          <option value="tow">Need Tow</option>
          <option value="key">Lost Keys</option>
          <option value="others">Other Issue</option>
        </select>
      </div>

      {/* LOCATION */}
      <div className="mb-6">
        <label className="text-gray-300 font-medium">Location</label>

        <div className="flex gap-3 mt-3">
          <input
            className="flex-1 p-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={getAutoLocation}
            className="p-3 bg-indigo-600 text-white rounded-xl"
          >
            {loadingLoc ? "..." : <FaMapMarkerAlt />}
          </button>
        </div>
      </div>

      {/* PHOTO UPLOAD */}
      <div className="mb-6">
        <label className="text-gray-300 font-medium flex items-center gap-2">
          <FaCamera /> Upload Photo (optional)
        </label>

        <input type="file" onChange={handlePhoto} className="mt-3 text-gray-300" />

        {photo && (
          <img
            src={photo}
            alt="preview"
            className="mt-3 w-full rounded-xl border border-gray-700 shadow-lg"
          />
        )}
      </div>

      {/* ESTIMATED ARRIVAL TIME */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-300 font-medium">Estimated Reach Time</p>
          <p className="text-indigo-400 font-bold text-lg">10 - 15 min</p>
        </div>
        <FaClock className="text-white" size={28} />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        className="w-full py-4 bg-indigo-600 rounded-xl text-white text-lg font-semibold hover:bg-indigo-700 transition"
        onClick={submitRequest}
      >
        Request Support
      </button>
    </div>
  );
}
