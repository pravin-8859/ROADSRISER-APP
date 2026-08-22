import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaTools,
  FaPhone,
  FaDirections,
  FaFilter,
  FaClock,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { getNearbyMechanics } from "../api/mechanicApi";

export default function MechanicSearch() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [selectedService, setSelectedService] =
    useState("All");

  const [mechanics, setMechanics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const services = [
    "All",
    "Towing",
    "Battery",
    "Tyre",
    "Engine",
    "General",
  ];

  // =====================================================
  // GET USER LOCATION
  // =====================================================

  const loadMechanics = (
    latitude,
    longitude
  ) => {
    setLoading(true);
    setError("");

    getNearbyMechanics({
      latitude,
      longitude,
      radius: 50,
    })
      .then((response) => {
        const data =
          response.data;

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Unable to find mechanics"
          );
        }

        setMechanics(
          Array.isArray(data.mechanics)
            ? data.mechanics
            : []
        );
      })
      .catch((err) => {
        console.error(
          "Nearby mechanics error:",
          err
        );

        setMechanics([]);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to find nearby mechanics"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // =====================================================
  // BROWSER LOCATION
  // =====================================================

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location is not supported by your browser."
      );

      setLoading(false);

      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const userLocation = {
          latitude,
          longitude,
        };

        setLocation(
          userLocation
        );

        setLocationLoading(false);

        loadMechanics(
          latitude,
          longitude
        );
      },

      (geoError) => {
        console.error(
          "Location error:",
          geoError
        );

        setLocationLoading(false);
        setLoading(false);

        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {
          setError(
            "Location permission denied. Please allow location access to find nearby mechanics."
          );
        } else if (
          geoError.code ===
          geoError.POSITION_UNAVAILABLE
        ) {
          setError(
            "Your location is currently unavailable."
          );
        } else {
          setError(
            "Unable to get your location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    getUserLocation();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredMechanics =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return mechanics.filter(
        (mechanic) => {
          const matchesSearch =
            !query ||
            mechanic.name
              ?.toLowerCase()
              .includes(query) ||
            mechanic.address
              ?.toLowerCase()
              .includes(query) ||
            mechanic.mechanicName
              ?.toLowerCase()
              .includes(query);

          // Backend currently does not store
          // a service list in the mechanic model.
          // Therefore service filtering remains
          // available for future service data.
          const matchesService =
            selectedService === "All";

          return (
            matchesSearch &&
            matchesService
          );
        }
      );
    }, [
      mechanics,
      search,
      selectedService,
    ]);

  // =====================================================
  // GET HELP
  // =====================================================

  const handleGetHelp = () => {
    navigate("/request-help");
  };

  // =====================================================
  // CALL
  // =====================================================

  const handleCall = (phone) => {
    if (!phone) {
      return;
    }

    window.location.href =
      `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          absolute
          top-[-180px]
          left-[-180px]
          w-[420px]
          h-[420px]
          bg-blue-600/15
          rounded-full
          blur-[130px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-180px]
          right-[-180px]
          w-[450px]
          h-[450px]
          bg-indigo-600/15
          rounded-full
          blur-[140px]
          pointer-events-none
        "
      />

      {/* =================================================
          PAGE
      ================================================= */}

      <div
        className="
          relative
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
          md:py-14
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center max-w-2xl mx-auto mb-10">

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              text-xs
              font-semibold
              mb-5
            "
          >
            <FaMapMarkerAlt />
            FIND HELP NEAR YOU
          </div>

          <h1
            className="
              text-3xl
              md:text-5xl
              font-extrabold
              tracking-tight
            "
          >
            Find Nearby{" "}

            <span
              className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-blue-400
                to-cyan-300
              "
            >
              Mechanics
            </span>
          </h1>

          <p
            className="
              mt-4
              text-gray-400
              text-sm
              md:text-base
              leading-6
            "
          >
            Find verified mechanics near your
            location and get roadside assistance
            when you need it.
          </p>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="max-w-4xl mx-auto mb-8">

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-3
            "
          >

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
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
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    hover:text-white
                  "
                >
                  <FaTimes />
                </button>
              )}

            </div>


            {/* LOCATION */}

            <button
              type="button"
              onClick={getUserLocation}
              disabled={locationLoading}
              className="
                h-12
                px-5
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                disabled:opacity-60
                disabled:cursor-not-allowed
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

              {locationLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <FaMapMarkerAlt />
                  Use My Location
                </>
              )}

            </button>

          </div>

        </div>


        {/* =================================================
            SERVICE FILTER
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            justify-center
            gap-2
            mb-10
          "
        >

          {services.map(
            (service) => (
              <button
                key={service}
                type="button"
                onClick={() =>
                  setSelectedService(
                    service
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-medium
                  border
                  transition

                  ${
                    selectedService ===
                    service
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30"
                  }
                `}
              >
                {service}
              </button>
            )
          )}

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              max-w-4xl
              mx-auto
              mb-6
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              flex
              items-start
              gap-3
              text-sm
              text-red-300
            "
          >

            <FaExclamationTriangle className="mt-0.5 shrink-0" />

            <div className="flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={getUserLocation}
              className="
                text-xs
                font-semibold
                text-red-200
                hover:text-white
                underline
              "
            >
              Retry
            </button>

          </div>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            grid
            lg:grid-cols-[1.1fr_0.9fr]
            gap-6
          "
        >

          {/* =================================================
              MAP AREA
          ================================================= */}

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

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-slate-900
                via-slate-800
                to-blue-950
              "
            >

              <div
                className="
                  absolute
                  w-[140%]
                  h-16
                  bg-slate-700/60
                  rotate-[-20deg]
                  top-[42%]
                  left-[-20%]
                "
              />

              <div
                className="
                  absolute
                  w-[140%]
                  h-10
                  bg-slate-700/50
                  rotate-[28deg]
                  top-[25%]
                  left-[-20%]
                "
              />

              <div
                className="
                  absolute
                  w-[130%]
                  h-12
                  bg-slate-700/50
                  rotate-[5deg]
                  top-[70%]
                  left-[-15%]
                "
              />

              <div
                className="
                  absolute
                  w-8
                  h-[130%]
                  bg-slate-700/40
                  rotate-[18deg]
                  top-[-10%]
                  left-[48%]
                "
              />

              <div className="absolute inset-0 bg-blue-500/5" />

            </div>


            {/* MAP HEADER */}

            <div
              className="
                absolute
                top-4
                left-4
                right-4
                flex
                justify-between
                items-center
              "
            >

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-black/50
                  backdrop-blur-md
                  border
                  border-white/10
                  text-sm
                  font-semibold
                "
              >
                Nearby Mechanics
              </div>

              <button
                type="button"
                onClick={getUserLocation}
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-black/50
                  backdrop-blur-md
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-gray-300
                  hover:text-white
                "
              >
                <FaFilter />
              </button>

            </div>


            {/* USER LOCATION */}

            {location && (
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

                  <div
                    className="
                      absolute
                      inset-0
                      w-16
                      h-16
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-blue-500/20
                      animate-ping
                    "
                  />

                  <div
                    className="
                      relative
                      w-10
                      h-10
                      rounded-full
                      bg-blue-600
                      border-4
                      border-white
                      shadow-xl
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>

                </div>

              </div>
            )}


            {/* MECHANIC MARKERS */}

            {filteredMechanics
              .slice(0, 5)
              .map((mechanic, index) => (
                <MapMarker
                  key={mechanic.id}
                  index={index}
                />
              ))}


            {/* MAP INFO */}

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
              "
            >

              <div
                className="
                  rounded-xl
                  bg-black/60
                  backdrop-blur-md
                  border
                  border-white/10
                  p-4
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-blue-500/15
                      flex
                      items-center
                      justify-center
                      text-blue-400
                    "
                  >
                    <FaMapMarkerAlt />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      {location
                        ? "Your location detected"
                        : "Location required"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {location
                        ? "Showing verified online mechanics near you"
                        : "Allow location access to find nearby mechanics"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              MECHANIC LIST
          ================================================= */}

          <div>

            <div
              className="
                flex
                items-center
                justify-between
                mb-4
              "
            >

              <div>

                <h2 className="text-xl font-bold">
                  Available Mechanics
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {loading
                    ? "Finding nearby mechanics..."
                    : `${filteredMechanics.length} mechanics found`}
                </p>

              </div>

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-500
                "
              >
                <FaClock className="text-emerald-400" />
                Live availability
              </div>

            </div>


            {/* LOADING */}

            {loading && (
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-10
                  text-center
                "
              >

                <FaSpinner
                  className="
                    mx-auto
                    text-3xl
                    text-blue-400
                    animate-spin
                    mb-4
                  "
                />

                <h3 className="font-semibold">
                  Finding nearby mechanics
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Checking verified mechanics around
                  your location...
                </p>

              </div>
            )}


            {/* EMPTY */}

            {!loading &&
              filteredMechanics.length ===
                0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-10
                    text-center
                  "
                >

                  <FaTools
                    className="
                      mx-auto
                      text-3xl
                      text-gray-600
                      mb-4
                    "
                  />

                  <h3 className="font-semibold">
                    No nearby mechanics found
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Try again from another location
                    or increase your search area.
                  </p>

                  <button
                    type="button"
                    onClick={getUserLocation}
                    className="
                      mt-5
                      px-5
                      py-2.5
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-500
                      text-sm
                      font-semibold
                      transition
                    "
                  >
                    Search Again
                  </button>

                </div>
              )}


            {/* MECHANICS */}

            {!loading &&
              filteredMechanics.length >
                0 && (
                <div className="space-y-4">

                  {filteredMechanics.map(
                    (mechanic) => (
                      <MechanicCard
                        key={mechanic.id}
                        mechanic={mechanic}
                        onCall={
                          handleCall
                        }
                        onGetHelp={
                          handleGetHelp
                        }
                      />
                    )
                  )}

                </div>
              )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   MECHANIC CARD
========================================================= */

function MechanicCard({
  mechanic,
  onCall,
  onGetHelp,
}) {
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
          {mechanic.profilePhoto ? (
            <img
              src={
                mechanic.profilePhoto
              }
              alt={
                mechanic.name
              }
              className="
                w-full
                h-full
                rounded-xl
                object-cover
              "
            />
          ) : (
            <FaTools />
          )}
        </div>


        <div className="min-w-0 flex-1">

          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <h3
                  className="
                    font-bold
                    text-white
                    truncate
                  "
                >
                  {mechanic.name}
                </h3>

                {mechanic.verified && (
                  <FaCheckCircle
                    className="
                      shrink-0
                      text-blue-400
                      text-sm
                    "
                    title="Verified mechanic"
                  />
                )}

              </div>

              <p className="text-xs text-gray-500 mt-1">
                {mechanic.mechanicName}
              </p>

            </div>


            <span
              className="
                shrink-0
                text-sm
                font-semibold
                text-blue-400
              "
            >
              {mechanic.distance} km
            </span>

          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="flex items-center gap-2 mt-4">

        <span
          className="
            w-2
            h-2
            rounded-full
            bg-emerald-400
          "
        />

        <span
          className="
            text-xs
            font-medium
            text-emerald-400
          "
        >
          Available now
        </span>

      </div>


      {/* ADDRESS */}

      <div className="flex items-start gap-2 mt-3">

        <FaMapMarkerAlt
          className="
            text-gray-500
            mt-0.5
            shrink-0
          "
        />

        <p className="text-xs text-gray-400">
          {mechanic.address}
        </p>

      </div>


      {/* SERVICE */}

      <div className="flex flex-wrap gap-2 mt-4">

        <span
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
          Roadside Assistance
        </span>

        <span
          className="
            px-2.5
            py-1
            rounded-lg
            bg-emerald-500/10
            border
            border-emerald-500/20
            text-[11px]
            text-emerald-400
          "
        >
          Online
        </span>

      </div>


      {/* ACTIONS */}

      <div className="grid grid-cols-2 gap-3 mt-5">

        <button
          type="button"
          disabled={!mechanic.phone}
          onClick={() =>
            onCall(
              mechanic.phone
            )
          }
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
          onClick={onGetHelp}
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


/* =========================================================
   MAP MARKER
========================================================= */

function MapMarker({
  index = 0,
}) {
  const positions = [
    "top-[28%] left-[28%]",
    "top-[62%] left-[68%]",
    "top-[35%] right-[20%]",
    "top-[72%] left-[25%]",
    "top-[20%] right-[38%]",
  ];

  const colors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];

  return (
    <div
      className={`
        absolute
        ${positions[index % positions.length]}
      `}
    >

      <div
        className={`
          relative
          w-9
          h-9
          ${colors[index % colors.length]}
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