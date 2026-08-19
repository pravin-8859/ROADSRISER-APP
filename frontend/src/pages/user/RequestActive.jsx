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
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FaMapMarkerAlt,
  FaTools,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaRoute,
} from "react-icons/fa";

import { getActiveRequestApi } from "../../api/userApi";

/* =========================================================
   LEAFLET ICONS
========================================================= */

const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `
    <div style="
      width:34px;
      height:34px;
      border-radius:50%;
      background:#2563eb;
      border:4px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:16px;
    ">
      ●
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const mechanicIcon = L.divIcon({
  className: "custom-mechanic-marker",
  html: `
    <div style="
      width:40px;
      height:40px;
      border-radius:50%;
      background:#16a34a;
      border:4px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,.4);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:18px;
    ">
      🔧
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

/* =========================================================
   HELPERS
========================================================= */

const getCoordinates = (location) => {
  const coordinates =
    location?.coordinates;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2
  ) {
    return null;
  }

  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return {
    lat,
    lng,
  };
};

const formatTime = (value) => {
  if (!value) return "Just now";

  try {
    return new Date(value).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  } catch {
    return "Just now";
  }
};

/* =========================================================
   DISTANCE
   Haversine formula
========================================================= */

const calculateDistance = (
  point1,
  point2
) => {
  if (!point1 || !point2) {
    return null;
  }

  const R = 6371;

  const dLat =
    ((point2.lat - point1.lat) *
      Math.PI) /
    180;

  const dLng =
    ((point2.lng - point1.lng) *
      Math.PI) /
    180;

  const lat1 =
    (point1.lat * Math.PI) /
    180;

  const lat2 =
    (point2.lat * Math.PI) /
    180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

/* =========================================================
   ROUTE API
   OSRM - OpenStreetMap based routing
========================================================= */

const getRoute = async (
  user,
  mechanic
) => {
  if (!user || !mechanic) {
    return null;
  }

  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${user.lng},${user.lat};` +
      `${mechanic.lng},${mechanic.lat}` +
      `?overview=full&geometries=geojson`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Route API error: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      data.code !== "Ok" ||
      !data.routes?.length
    ) {
      return null;
    }

    const route =
      data.routes[0];

    const routeCoordinates =
      route.geometry.coordinates.map(
        ([lng, lat]) => [
          lat,
          lng,
        ]
      );

    return {
      coordinates:
        routeCoordinates,

      distanceKm:
        route.distance / 1000,

      durationMin:
        route.duration / 60,
    };
  } catch (error) {
    console.error(
      "Route fetch failed:",
      error
    );

    return null;
  }
};

/* =========================================================
   MAP AUTO FIT
========================================================= */

function MapController({
  userLocation,
  mechanicLocation,
}) {
  const map = useMap();

  useEffect(() => {
    const points = [];

    if (userLocation) {
      points.push([
        userLocation.lat,
        userLocation.lng,
      ]);
    }

    if (mechanicLocation) {
      points.push([
        mechanicLocation.lat,
        mechanicLocation.lng,
      ]);
    }

    if (points.length === 1) {
      map.setView(
        points[0],
        15
      );
    }

    if (points.length === 2) {
      const bounds =
        L.latLngBounds(points);

      map.fitBounds(
        bounds,
        {
          padding: [50, 50],
          maxZoom: 15,
        }
      );
    }
  }, [
    map,
    userLocation,
    mechanicLocation,
  ]);

  return null;
}

/* =========================================================
   STATUS
========================================================= */

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Finding a nearby mechanic";

    case "accepted":
      return "Mechanic assigned";

    case "enroute":
      return "Mechanic is on the way";

    case "completed":
      return "Request completed";

    default:
      return "Request active";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "accepted":
      return "bg-blue-100 text-blue-700";

    case "enroute":
      return "bg-green-100 text-green-700";

    case "completed":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-indigo-100 text-indigo-700";
  }
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function RequestActive() {
  const [request, setRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [route, setRoute] =
    useState(null);

  const [routeLoading, setRouteLoading] =
    useState(false);

  /* =======================================================
     LOAD ACTIVE REQUEST
  ======================================================= */

  const loadActiveRequest = async (
    showLoader = false
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const res =
        await getActiveRequestApi();

      const active =
        res?.active ||
        res?.data?.active ||
        null;

      setRequest(active);

      setLastUpdated(
        new Date()
      );

      setError("");
    } catch (err) {
      console.error(
        "Active request error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load active request."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  /* =======================================================
     INITIAL LOAD + 5 SEC POLLING
  ======================================================= */

  useEffect(() => {
    loadActiveRequest(true);

    const interval =
      setInterval(() => {
        loadActiveRequest(false);
      }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     LOCATIONS
  ======================================================= */

  const userLocation = useMemo(() => {
    return getCoordinates(
      request?.location
    );
  }, [request]);

  const mechanicLocation =
    useMemo(() => {
      return getCoordinates(
        request?.mechanic
          ?.currentLocation
      );
    }, [request]);

  /* =======================================================
     STRAIGHT LINE DISTANCE
  ======================================================= */

  const straightDistance =
    useMemo(() => {
      return calculateDistance(
        userLocation,
        mechanicLocation
      );
    }, [
      userLocation,
      mechanicLocation,
    ]);

  /* =======================================================
     ROUTE FETCH
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadRoute = async () => {
      if (
        !userLocation ||
        !mechanicLocation
      ) {
        setRoute(null);
        return;
      }

      setRouteLoading(true);

      const result =
        await getRoute(
          userLocation,
          mechanicLocation
        );

      if (!cancelled) {
        setRoute(result);
        setRouteLoading(false);
      }
    };

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [
    userLocation,
    mechanicLocation,
  ]);

  /* =======================================================
     DISPLAY DISTANCE
  ======================================================= */

  const distanceText =
    route?.distanceKm != null
      ? route.distanceKm < 1
        ? `${Math.round(
            route.distanceKm * 1000
          )} m`
        : `${route.distanceKm.toFixed(
            1
          )} km`
      : straightDistance != null
      ? straightDistance < 1
        ? `${Math.round(
            straightDistance * 1000
          )} m`
        : `${straightDistance.toFixed(
            1
          )} km`
      : "Calculating...";

  /* =======================================================
     ETA
  ======================================================= */

  const etaText =
    route?.durationMin != null
      ? route.durationMin < 1
        ? "Less than 1 min"
        : `${Math.ceil(
            route.durationMin
          )} min`
      : straightDistance != null
      ? `${Math.max(
          1,
          Math.ceil(
            (straightDistance / 25) *
              60
          )
        )} min approx`
      : "Calculating...";

  /* =======================================================
     GOOGLE MAPS URL
  ======================================================= */

  const openMapUrl =
    mechanicLocation &&
    userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${mechanicLocation.lat},${mechanicLocation.lng}`
      : mechanicLocation
      ? `https://www.google.com/maps/search/?api=1&query=${mechanicLocation.lat},${mechanicLocation.lng}`
      : "#";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-3xl text-indigo-600 mx-auto" />

          <p className="mt-3 text-gray-500">
            Loading active request...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO ACTIVE REQUEST
  ======================================================= */

  if (!request) {
    return (
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-8 text-center">

        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <FaRoute className="text-2xl text-indigo-600" />
        </div>

        <h2 className="text-xl font-bold mt-4">
          No Active Request
        </h2>

        <p className="text-gray-500 mt-2">
          You currently don't have an active roadside assistance request.
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-4">
            {error}
          </p>
        )}
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 md:p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <p className="text-sm text-indigo-600 font-medium">
              Roadside Assistance
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {getStatusText(
                request.status
              )}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Request ID:{" "}
              {String(
                request._id || ""
              ).slice(-8)}
            </p>
          </div>

          <span
            className={`inline-flex items-center w-fit px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              request.status
            )}`}
          >
            {request.status ===
              "enroute" && (
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            )}

            {request.status
              ?.charAt(0)
              .toUpperCase() +
              request.status?.slice(
                1
              )}
          </span>

        </div>
      </div>

      {/* ===================================================
          MECHANIC CARD
      =================================================== */}

      {request.mechanic ? (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 md:p-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FaTools className="text-2xl text-indigo-600" />
              </div>

              <div>

                <h3 className="font-bold text-lg">
                  {request.mechanic.name ||
                    "Mechanic"}
                </h3>

                <p className="text-sm text-gray-500">
                  {request.mechanic
                    .garageName ||
                    "Roadside Mechanic"}
                </p>

                {request.mechanic
                  .phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">

                    <FaPhone className="text-green-600" />

                    <a
                      href={`tel:${request.mechanic.phone}`}
                      className="hover:text-indigo-600"
                    >
                      {request.mechanic.phone}
                    </a>

                  </div>
                )}

              </div>
            </div>

            {request.mechanic
              .isOnline && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Online
              </span>
            )}

          </div>

          {/* LIVE LOCATION */}

          <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">

            <div className="flex items-center gap-3">

              <div
                className={`w-3 h-3 rounded-full ${
                  mechanicLocation
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              />

              <div>

                <p className="font-semibold">
                  {mechanicLocation
                    ? "Live mechanic location"
                    : "Waiting for mechanic location"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {mechanicLocation
                    ? "Location updates automatically."
                    : "Mechanic location is not available yet."}
                </p>

              </div>
            </div>

            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-3">
                Last checked:{" "}
                {lastUpdated.toLocaleTimeString(
                  "en-IN"
                )}
              </p>
            )}

          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <FaSpinner className="animate-spin text-yellow-600" />

            <div>

              <h3 className="font-semibold">
                Finding a nearby mechanic
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Please wait while we find an available mechanic near you.
              </p>

            </div>

          </div>
        </div>
      )}

      {/* ===================================================
          DISTANCE + ETA
      =================================================== */}

      {request.mechanic &&
        mechanicLocation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FaRoute className="text-indigo-600" />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Distance
                  </p>

                  <p className="text-xl font-bold">
                    {distanceText}
                  </p>

                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FaClock className="text-green-600" />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Estimated arrival
                  </p>

                  <p className="text-xl font-bold">
                    {etaText}
                  </p>

                </div>
              </div>

            </div>

          </div>
        )}

      {/* ===================================================
          LIVE MAP
      =================================================== */}

      {(userLocation ||
        mechanicLocation) && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-4 md:p-5">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h3 className="font-bold text-lg">
                Live Tracking
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Mechanic location updates automatically
              </p>

            </div>

            {mechanicLocation && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">

                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

                LIVE

              </div>
            )}

          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[350px] md:h-[500px]">

            <MapContainer
              center={[
                (
                  mechanicLocation ||
                  userLocation
                ).lat,
                (
                  mechanicLocation ||
                  userLocation
                ).lng,
              ]}
              zoom={14}
              scrollWheelZoom={true}
              className="w-full h-full"
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController
                userLocation={
                  userLocation
                }
                mechanicLocation={
                  mechanicLocation
                }
              />

              {/* USER */}

              {userLocation && (
                <Marker
                  position={[
                    userLocation.lat,
                    userLocation.lng,
                  ]}
                  icon={userIcon}
                >
                  <Popup>
                    <strong>
                      Your location
                    </strong>
                  </Popup>
                </Marker>
              )}

              {/* MECHANIC */}

              {mechanicLocation && (
                <Marker
                  position={[
                    mechanicLocation.lat,
                    mechanicLocation.lng,
                  ]}
                  icon={mechanicIcon}
                >
                  <Popup>

                    <strong>
                      {request.mechanic
                        ?.name ||
                        "Mechanic"}
                    </strong>

                    <br />

                    {request.status ===
                    "enroute"
                      ? "On the way"
                      : "Mechanic"}

                  </Popup>
                </Marker>
              )}

              {/* ROUTE */}

              {route?.coordinates
                ?.length > 1 && (
                <Polyline
                  positions={
                    route.coordinates
                  }
                  pathOptions={{
                    color:
                      "#2563eb",
                    weight: 6,
                    opacity: 0.8,
                  }}
                />
              )}

            </MapContainer>

          </div>

          {routeLoading && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">

              <FaSpinner className="animate-spin" />

              Calculating road route...

            </div>
          )}

          {!route &&
            mechanicLocation &&
            userLocation &&
            !routeLoading && (
              <p className="text-sm text-gray-500 mt-3">
                Road route unavailable. Showing direct distance instead.
              </p>
            )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">

            <a
              href={openMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Open Route in Google Maps
            </a>

            {request.mechanic
              ?.phone && (
              <a
                href={`tel:${request.mechanic.phone}`}
                className="flex-1 text-center px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Call Mechanic
              </a>
            )}

          </div>

        </div>
      )}

      {/* ===================================================
          REQUEST DETAILS
      =================================================== */}

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 md:p-6">

        <h3 className="font-bold text-lg">
          Request Details
        </h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">

            <p className="text-xs text-gray-500">
              Service
            </p>

            <p className="font-semibold mt-1">
              {request.serviceType ||
                request.problem ||
                "Roadside Assistance"}
            </p>

          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">

            <p className="text-xs text-gray-500">
              Vehicle
            </p>

            <p className="font-semibold mt-1">
              {request.vehicleType ||
                "Vehicle"}
            </p>

          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 md:col-span-2">

            <p className="text-xs text-gray-500">
              Problem
            </p>

            <p className="font-semibold mt-1">
              {request.problem ||
                request.description ||
                "Roadside assistance required"}
            </p>

          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 md:col-span-2">

            <p className="text-xs text-gray-500">
              Pickup Location
            </p>

            <div className="flex items-start gap-2 mt-1">

              <FaMapMarkerAlt className="text-indigo-600 mt-1" />

              <p className="font-semibold">
                {request.address ||
                  (userLocation
                    ? `${userLocation.lat.toFixed(
                        6
                      )}, ${userLocation.lng.toFixed(
                        6
                      )}`
                    : "Location unavailable")}
              </p>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">

            <p className="text-xs text-gray-500">
              Requested
            </p>

            <div className="flex items-center gap-2 mt-1">

              <FaClock className="text-indigo-600" />

              <p className="font-semibold">
                {formatTime(
                  request.createdAt
                )}
              </p>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">

            <p className="text-xs text-gray-500">
              Status
            </p>

            <div className="flex items-center gap-2 mt-1">

              <FaCheckCircle className="text-green-600" />

              <p className="font-semibold">
                {getStatusText(
                  request.status
                )}
              </p>

            </div>

          </div>

        </div>
      </div>

      {/* ===================================================
          ENROUTE INFO
      =================================================== */}

      {request.status ===
        "enroute" &&
        mechanicLocation && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">

                <FaRoute className="text-green-600" />

              </div>

              <div>

                <h3 className="font-bold text-green-800 dark:text-green-300">
                  Your mechanic is on the way
                </h3>

                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Distance and ETA update automatically as the mechanic moves.
                </p>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}