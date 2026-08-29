import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FaSearch,
  FaMapMarkerAlt,
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


// =====================================================
// FIX LEAFLET DEFAULT MARKER ICON
// =====================================================

const userIcon = L.divIcon({
  className: "rr-user-marker",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#2563eb;
      border:4px solid white;
      box-shadow:0 5px 18px rgba(0,0,0,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:17px;
    ">
      📍
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -21],
});

const mechanicIcon = L.divIcon({
  className: "rr-mechanic-marker",
  html: `
    <div style="
      width:40px;
      height:40px;
      border-radius:50%;
      background:linear-gradient(135deg,#4f46e5,#2563eb);
      border:4px solid white;
      box-shadow:0 5px 18px rgba(0,0,0,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:16px;
    ">
      🔧
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});


// =====================================================
// MAP CENTER CONTROLLER
// =====================================================

function MapCenter({
  location,
}) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.setView(
      [
        location.latitude,
        location.longitude,
      ],
      13,
      {
        animate: true,
      }
    );
  }, [
    location,
    map,
  ]);

  return null;
}


// =====================================================
// MAIN COMPONENT
// =====================================================

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


  // =====================================================
  // SERVICES
  // =====================================================

  const services = [
    "All",
    "Towing",
    "Battery",
    "Tyre",
    "Engine",
    "General",
  ];


  // =====================================================
  // LOAD MECHANICS
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
          response?.data;

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Unable to find mechanics"
          );
        }

        setMechanics(
          Array.isArray(
            data.mechanics
          )
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
          err?.response?.data?.message ||
            err?.message ||
            "Unable to find nearby mechanics"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // =====================================================
  // GET USER LOCATION
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
            "Location permission denied. Please allow location access."
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
  // INITIAL LOCATION
  // =====================================================

  useEffect(() => {
    getUserLocation();
  }, []);


  // =====================================================
  // FILTER MECHANICS
  // =====================================================

  const filteredMechanics =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

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

          /*
            Current backend mechanic model
            does not have a services array.

            So until services are added to
            backend, don't fake-filter data.
          */

          const matchesService =
            selectedService ===
            "All";

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
    navigate(
      "/request-help"
    );
  };


  // =====================================================
  // CALL MECHANIC
  // =====================================================

  const handleCall = (
    phone
  ) => {
    if (!phone) return;

    window.location.href =
      `tel:${phone}`;
  };


  // =====================================================
  // MAP DEFAULT LOCATION
  // =====================================================

  const defaultCenter = [
    27.4924,
    77.6737,
  ];


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#020617]
        text-white
        relative
        overflow-hidden
      "
    >

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
          MAIN
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

        <div
          className="
            text-center
            max-w-2xl
            mx-auto
            mb-10
          "
        >

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

        <div
          className="
            max-w-4xl
            mx-auto
            mb-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-3
            "
          >

            <div
              className="
                relative
                flex-1
              "
            >

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


            <button
              type="button"
              onClick={
                getUserLocation
              }
              disabled={
                locationLoading
              }
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
                  <FaSpinner
                    className="
                      animate-spin
                    "
                  />

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
            FILTERS
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

            <FaExclamationTriangle
              className="
                mt-0.5
                shrink-0
              "
            />

            <div className="flex-1">
              {error}
            </div>


            <button
              type="button"
              onClick={
                getUserLocation
              }
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
            CONTENT GRID
        ================================================= */}

        <div
          className="
            grid
            lg:grid-cols-[1.1fr_0.9fr]
            gap-6
          "
        >

          {/* =================================================
              REAL MAP
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

            <MapContainer
              center={
                location
                  ? [
                      location.latitude,
                      location.longitude,
                    ]
                  : defaultCenter
              }
              zoom={
                location
                  ? 13
                  : 11
              }
              scrollWheelZoom={true}
              className="
                h-full
                min-h-[430px]
                lg:min-h-[600px]
                w-full
                z-0
              "
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              <MapCenter
                location={location}
              />


              {/* USER */}

              {location && (
                <>
                  <Marker
                    position={[
                      location.latitude,
                      location.longitude,
                    ]}
                    icon={userIcon}
                  >
                    <Popup>
                      <strong>
                        Your Location
                      </strong>
                      <br />
                      Searching nearby mechanics
                    </Popup>
                  </Marker>


                  <Circle
                    center={[
                      location.latitude,
                      location.longitude,
                    ]}
                    radius={3000}
                    pathOptions={{
                      color:
                        "#2563eb",
                      fillColor:
                        "#2563eb",
                      fillOpacity:
                        0.06,
                    }}
                  />
                </>
              )}


              {/* MECHANICS */}

              {filteredMechanics.map(
                (mechanic) => {
                  const lat =
                    Number(
                      mechanic
                        ?.location
                        ?.lat
                    );

                  const lng =
                    Number(
                      mechanic
                        ?.location
                        ?.lng
                    );

                  if (
                    !Number.isFinite(
                      lat
                    ) ||
                    !Number.isFinite(
                      lng
                    )
                  ) {
                    return null;
                  }

                  return (
                    <Marker
                      key={
                        mechanic.id
                      }
                      position={[
                        lat,
                        lng,
                      ]}
                      icon={
                        mechanicIcon
                      }
                    >

                      <Popup>

                        <div
                          style={{
                            minWidth:
                              "210px",
                            color:
                              "#111827",
                          }}
                        >

                          <strong
                            style={{
                              fontSize:
                                "15px",
                            }}
                          >
                            {
                              mechanic.name
                            }
                          </strong>


                          <div
                            style={{
                              marginTop:
                                "6px",
                              fontSize:
                                "12px",
                              color:
                                "#6b7280",
                            }}
                          >
                            {
                              mechanic
                                .mechanicName
                            }
                          </div>


                          <div
                            style={{
                              marginTop:
                                "7px",
                              fontSize:
                                "12px",
                            }}
                          >
                            📍{" "}
                            {
                              mechanic.distance
                            }{" "}
                            km away
                          </div>


                          <div
                            style={{
                              marginTop:
                                "4px",
                              color:
                                "#16a34a",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >
                            ● Available now
                          </div>

                        </div>

                      </Popup>

                    </Marker>
                  );
                }
              )}

            </MapContainer>


            {/* MAP HEADER */}

            <div
              className="
                absolute
                top-4
                left-4
                right-4
                z-[1000]
                flex
                justify-between
                items-center
                pointer-events-none
              "
            >

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-black/65
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
                onClick={
                  getUserLocation
                }
                className="
                  pointer-events-auto
                  w-10
                  h-10
                  rounded-xl
                  bg-black/65
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


            {/* MAP BOTTOM INFO */}

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                z-[1000]
                pointer-events-none
              "
            >

              <div
                className="
                  rounded-xl
                  bg-black/65
                  backdrop-blur-md
                  border
                  border-white/10
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

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

                    <p
                      className="
                        text-sm
                        font-semibold
                      "
                    >
                      {location
                        ? "Your location detected"
                        : "Location required"}
                    </p>


                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
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

                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Available Mechanics
                </h2>


                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
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

                <FaClock
                  className="
                    text-emerald-400
                  "
                />

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


                <h3
                  className="
                    font-semibold
                  "
                >
                  Finding nearby mechanics
                </h3>


                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-2
                  "
                >
                  Checking verified mechanics
                  around your location...
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


                  <h3
                    className="
                      font-semibold
                    "
                  >
                    No nearby mechanics found
                  </h3>


                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-2
                    "
                  >
                    Try searching again from
                    your current location.
                  </p>


                  <button
                    type="button"
                    onClick={
                      getUserLocation
                    }
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
                <div
                  className="
                    space-y-4
                  "
                >

                  {filteredMechanics.map(
                    (mechanic) => (
                      <MechanicCard
                        key={
                          mechanic.id
                        }
                        mechanic={
                          mechanic
                        }
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


      {/* =================================================
          EXTRA STYLES
      ================================================= */}

      <style>{`

        .leaflet-container {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          background:#0f172a;
        }

        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background:#ffffff;
        }

        .leaflet-popup-content {
          margin:12px 14px;
        }

        .leaflet-control-zoom {
          border:none !important;
          box-shadow:
            0 5px 15px
            rgba(0,0,0,.25) !important;
        }

        .leaflet-control-zoom a {
          background:#0f172a !important;
          color:#ffffff !important;
          border-color:#334155 !important;
        }

        .leaflet-control-zoom a:hover {
          background:#1e293b !important;
        }

        .leaflet-control-attribution {
          background:rgba(2,6,23,.75) !important;
          color:#94a3b8 !important;
        }

        .leaflet-control-attribution a {
          color:#93c5fd !important;
        }

      `}</style>

    </div>
  );
}


// =====================================================
// MECHANIC CARD
// =====================================================

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

      <div
        className="
          flex
          items-start
          gap-4
        "
      >

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
            overflow-hidden
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
                object-cover
              "
            />
          ) : (
            <FaTools />
          )}

        </div>


        <div
          className="
            min-w-0
            flex-1
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

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


              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
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

      <div
        className="
          flex
          items-center
          gap-2
          mt-4
        "
      >

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

      <div
        className="
          flex
          items-start
          gap-2
          mt-3
        "
      >

        <FaMapMarkerAlt
          className="
            text-gray-500
            mt-0.5
            shrink-0
          "
        />

        <p
          className="
            text-xs
            text-gray-400
          "
        >
          {mechanic.address}
        </p>

      </div>


      {/* TAGS */}

      <div
        className="
          flex
          flex-wrap
          gap-2
          mt-4
        "
      >

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
          Verified
        </span>

      </div>


      {/* ACTIONS */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          mt-5
        "
      >

        <button
          type="button"
          disabled={
            !mechanic.phone
          }
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
          onClick={
            onGetHelp
          }
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