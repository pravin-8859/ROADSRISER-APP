import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaTools,
  FaPhone,
  FaDirections,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaCar,
  FaBatteryFull,
  FaWrench,
  FaTimes,
} from "react-icons/fa";

export default function MechanicSearch() {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] =
    useState("All");

  const services = [
    "All",
    "Towing",
    "Battery",
    "Tyre",
    "Engine",
    "General",
  ];

  const mechanics = [
    {
      id: 1,
      name: "Sharma Auto Care",
      distance: "1.2 km",
      rating: "4.8",
      reviews: 124,
      services: ["Tyre", "Battery", "General"],
      address: "Mathura, Uttar Pradesh",
      phone: "+91 98765 43210",
      available: true,
    },
    {
      id: 2,
      name: "Krishna Motors",
      distance: "2.4 km",
      rating: "4.6",
      reviews: 89,
      services: ["Engine", "Towing", "General"],
      address: "Dampier Nagar, Mathura",
      phone: "+91 98765 12345",
      available: true,
    },
    {
      id: 3,
      name: "Roadside Experts",
      distance: "3.5 km",
      rating: "4.5",
      reviews: 67,
      services: ["Battery", "Tyre", "Towing"],
      address: "NH-2, Mathura",
      phone: "+91 91234 56789",
      available: false,
    },
  ];

  const filteredMechanics = mechanics.filter(
    (mechanic) => {
      const matchesSearch =
        mechanic.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        mechanic.address
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesService =
        selectedService === "All" ||
        mechanic.services.includes(
          selectedService
        );

      return (
        matchesSearch &&
        matchesService
      );
    }
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="absolute bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* =========================================
          PAGE
      ========================================= */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="text-center max-w-2xl mx-auto mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
            <FaMapMarkerAlt />
            FIND HELP NEAR YOU
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Find Nearby{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Mechanics
            </span>
          </h1>

          <p className="mt-4 text-gray-400 text-sm md:text-base leading-6">
            Find trusted mechanics around your
            location and get roadside assistance
            when you need it.
          </p>

        </div>


        {/* =====================================
            SEARCH + FILTER
        ===================================== */}

        <div className="max-w-4xl mx-auto mb-8">

          <div className="flex flex-col md:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search mechanic or location..."
                className="
                  w-full
                  h-12
                  pl-11
                  pr-11
                  rounded-xl
                  bg-white/[0.05]
                  border
                  border-white/10
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500/60
                  focus:ring-2
                  focus:ring-blue-500/10
                  transition
                "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}

            </div>

            {/* LOCATION */}

            <button
              type="button"
              className="
                h-12
                px-5
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                transition
                shadow-lg
                shadow-blue-600/20
              "
            >
              <FaMapMarkerAlt />
              Use My Location
            </button>

          </div>

        </div>


        {/* =====================================
            SERVICE FILTERS
        ===================================== */}

        <div className="flex flex-wrap justify-center gap-2 mb-10">

          {services.map((service) => (
            <button
              key={service}
              onClick={() =>
                setSelectedService(service)
              }
              className={`
                px-4 py-2
                rounded-full
                text-xs
                sm:text-sm
                font-medium
                border
                transition
                ${
                  selectedService === service
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30"
                }
              `}
            >
              {service}
            </button>
          ))}

        </div>


        {/* =====================================
            CONTENT GRID
        ===================================== */}

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">

          {/* ===================================
              MAP
          =================================== */}

          <div
            className="
              relative
              min-h-[430px]
              lg:min-h-[600px]
              rounded-2xl
              overflow-hidden
              border
              border-white/10
              bg-[#0f172a]
            "
          >

            {/* MAP BACKGROUND */}

            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">

              {/* Road lines */}

              <div className="absolute w-[140%] h-16 bg-slate-700/60 rotate-[-20deg] top-[42%] left-[-20%]" />

              <div className="absolute w-[140%] h-10 bg-slate-700/50 rotate-[28deg] top-[25%] left-[-20%]" />

              <div className="absolute w-[130%] h-12 bg-slate-700/50 rotate-[5deg] top-[70%] left-[-15%]" />

              <div className="absolute w-8 h-[130%] bg-slate-700/40 rotate-[18deg] top-[-10%] left-[48%]" />

              {/* Map glow */}

              <div className="absolute inset-0 bg-blue-500/5" />

            </div>


            {/* MAP HEADER */}

            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">

              <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-sm font-semibold">
                Nearby Mechanics
              </div>

              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
              >
                <FaFilter />
              </button>

            </div>


            {/* CURRENT LOCATION */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
              "
            >

              <div className="relative">

                <div className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 animate-ping" />

                <div className="relative w-10 h-10 rounded-full bg-blue-600 border-4 border-white shadow-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>

              </div>

            </div>


            {/* MECHANIC MARKERS */}

            <MapMarker
              className="absolute top-[28%] left-[28%]"
              color="bg-emerald-500"
            />

            <MapMarker
              className="absolute top-[62%] left-[68%]"
              color="bg-blue-500"
            />

            <MapMarker
              className="absolute top-[35%] right-[20%]"
              color="bg-purple-500"
            />


            {/* MAP BOTTOM INFO */}

            <div className="absolute bottom-4 left-4 right-4">

              <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Your location
                    </p>

                    <p className="text-xs text-gray-400">
                      Showing mechanics near you
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================
              MECHANIC LIST
          =================================== */}

          <div>

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-bold">
                  Available Mechanics
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {filteredMechanics.length} mechanics found
                </p>

              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <FaClock className="text-emerald-400" />
                Updated just now
              </div>

            </div>


            {/* LIST */}

            <div className="space-y-4">

              {filteredMechanics.length === 0 ? (

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">

                  <FaTools className="mx-auto text-3xl text-gray-600 mb-4" />

                  <h3 className="font-semibold">
                    No mechanics found
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Try another search or service.
                  </p>

                </div>

              ) : (

                filteredMechanics.map(
                  (mechanic) => (
                    <MechanicCard
                      key={mechanic.id}
                      mechanic={mechanic}
                    />
                  )
                )

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   MECHANIC CARD
========================================= */

function MechanicCard({ mechanic }) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        p-5
        hover:bg-white/[0.06]
        hover:border-blue-500/25
        transition-all
        duration-300
      "
    >

      {/* TOP */}

      <div className="flex items-start gap-4">

        <div
          className="
            shrink-0
            w-14
            h-14
            rounded-xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            flex
            items-center
            justify-center
            text-xl
            shadow-lg
            shadow-blue-600/20
          "
        >
          <FaTools />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div>

              <h3 className="font-bold text-white truncate">
                {mechanic.name}
              </h3>

              <div className="flex items-center gap-2 mt-1">

                <span className="flex items-center gap-1 text-sm text-yellow-400">
                  <FaStar />
                  {mechanic.rating}
                </span>

                <span className="text-xs text-gray-500">
                  ({mechanic.reviews} reviews)
                </span>

              </div>

            </div>

            <span className="shrink-0 text-sm font-semibold text-blue-400">
              {mechanic.distance}
            </span>

          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="flex items-center gap-2 mt-4">

        <span
          className={`
            w-2 h-2 rounded-full
            ${
              mechanic.available
                ? "bg-emerald-400"
                : "bg-gray-500"
            }
          `}
        />

        <span
          className={`
            text-xs font-medium
            ${
              mechanic.available
                ? "text-emerald-400"
                : "text-gray-500"
            }
          `}
        >
          {mechanic.available
            ? "Available now"
            : "Currently unavailable"}
        </span>

      </div>


      {/* ADDRESS */}

      <div className="flex items-start gap-2 mt-3">

        <FaMapMarkerAlt className="text-gray-500 mt-0.5 shrink-0" />

        <p className="text-xs text-gray-400">
          {mechanic.address}
        </p>

      </div>


      {/* SERVICES */}

      <div className="flex flex-wrap gap-2 mt-4">

        {mechanic.services.map(
          (service) => (
            <span
              key={service}
              className="
                px-2.5
                py-1
                rounded-lg
                bg-white/[0.05]
                border
                border-white/10
                text-[11px]
                text-gray-400
              "
            >
              {service}
            </span>
          )
        )}

      </div>


      {/* ACTIONS */}

      <div className="grid grid-cols-2 gap-3 mt-5">

        <button
          type="button"
          disabled={!mechanic.available}
          className="
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-xl
            border
            border-white/10
            text-sm
            font-semibold
            text-gray-300
            hover:text-white
            hover:border-blue-500/30
            hover:bg-white/[0.05]
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >
          <FaPhone />
          Call
        </button>

        <button
          type="button"
          disabled={!mechanic.available}
          className="
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            text-sm
            font-semibold
            text-white
            hover:from-blue-500
            hover:to-indigo-500
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >
          <FaDirections />
          Get Help
        </button>

      </div>

    </div>
  );
}


/* =========================================
   MAP MARKER
========================================= */

function MapMarker({
  className,
  color,
}) {
  return (
    <div className={className}>

      <div
        className={`
          relative
          w-9
          h-9
          ${color}
          rounded-full
          border-4
          border-white
          shadow-xl
          flex
          items-center
          justify-center
        `}
      >

        <FaTools className="text-white text-xs" />

      </div>

    </div>
  );
}