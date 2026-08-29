import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FaTools,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaEnvelope,
  FaPhoneAlt,
  FaStore,
  FaLock,
  FaIdCard,
  FaUser,
  FaSpinner,
  FaCrosshairs,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import {
  sendOtp,
  registerMechanic,
} from "../api/mechanicApi";

import logo from "../assets/logo.png";


// =====================================================
// GARAGE MARKER
// =====================================================

const garageIcon = L.divIcon({
  className: "rr-garage-marker",

  html: `
    <div style="
      width:44px;
      height:44px;
      border-radius:50%;
      background:linear-gradient(135deg,#4f46e5,#2563eb);
      border:4px solid white;
      box-shadow:0 5px 18px rgba(0,0,0,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:18px;
    ">
      📍
    </div>
  `,

  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});


// =====================================================
// DEFAULT MAP CENTER
// =====================================================

const DEFAULT_CENTER = [
  27.4924,
  77.6737,
];


// =====================================================
// MAP CLICK HANDLER
// =====================================================

function MapClickHandler({
  onSelect,
}) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        accuracy: null,
        source: "map",
      });
    },
  });

  return null;
}


// =====================================================
// MAP CENTER
// =====================================================

function MapRecenter({
  center,
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!center) return;

    map.setView(
      [
        center.latitude,
        center.longitude,
      ],
      17,
      {
        animate: true,
      }
    );
  }, [center, map]);

  return null;
}


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function MechanicSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [serverOtp, setServerOtp] =
    useState(null);

  const [mapMode, setMapMode] =
    useState(false);

  const [locationConfirmed, setLocationConfirmed] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gst: "",
    garageName: "",
    address: "",
    otp: "",
  });

  const [garageLocation, setGarageLocation] =
    useState(null);

  const [locationStatus, setLocationStatus] =
    useState(
      "Please set your exact garage location."
    );

  const [locationAccuracy, setLocationAccuracy] =
    useState(null);


  // =====================================================
  // FORM HANDLER
  // =====================================================

  const handle = (
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError("");
  };


  // =====================================================
  // SET LOCATION
  // =====================================================

  const applyLocation = ({
    latitude,
    longitude,
    accuracy = null,
    source = "map",
  }) => {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setError(
        "Invalid garage location selected."
      );

      return;
    }

    setGarageLocation({
      type: "Point",

      coordinates: [
        Number(longitude),
        Number(latitude),
      ],

      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    setLocationAccuracy(
      accuracy !== null
        ? Number(accuracy)
        : null
    );

    setLocationConfirmed(false);

    if (source === "gps") {
      if (
        accuracy !== null &&
        accuracy <= 50
      ) {
        setLocationStatus(
          "GPS location detected with good accuracy."
        );
      } else if (
        accuracy !== null &&
        accuracy <= 100
      ) {
        setLocationStatus(
          "GPS location detected with moderate accuracy."
        );
      } else {
        setLocationStatus(
          "GPS accuracy is low. Please verify the garage position on the map."
        );
      }
    } else {
      setLocationStatus(
        "Garage location selected on the map."
      );
    }
  };


  // =====================================================
  // USE CURRENT LOCATION
  // =====================================================

  const getCurrentGarageLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setLocationLoading(true);
    setError("");

    setLocationStatus(
      "Detecting your current location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;

        applyLocation({
          latitude,
          longitude,
          accuracy,
          source: "gps",
        });

        setMapMode(true);

        setLocationLoading(false);
      },

      (geoError) => {
        console.error(
          "Garage GPS error:",
          geoError
        );

        setLocationLoading(false);

        let message =
          "Unable to detect your location.";

        if (
          geoError.code === 1
        ) {
          message =
            "Location permission denied. Please allow location access.";
        } else if (
          geoError.code === 2
        ) {
          message =
            "Your location could not be determined.";
        } else if (
          geoError.code === 3
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationStatus(message);
        setError(message);
      },

      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };


  // =====================================================
  // MAP LOCATION SELECT
  // =====================================================

  const handleMapSelect = ({
    latitude,
    longitude,
    accuracy,
    source,
  }) => {
    applyLocation({
      latitude,
      longitude,
      accuracy,
      source,
    });

    setMapMode(true);
  };


  // =====================================================
  // DRAG MARKER
  // =====================================================

  const handleMarkerDrag = (
    event
  ) => {
    const position =
      event.target.getLatLng();

    applyLocation({
      latitude: position.lat,
      longitude: position.lng,
      accuracy: null,
      source: "map",
    });
  };


  // =====================================================
  // CONFIRM LOCATION
  // =====================================================

  const confirmGarageLocation = () => {
    if (
      !garageLocation?.coordinates ||
      garageLocation.coordinates.length !== 2
    ) {
      setError(
        "Please select your garage location first."
      );

      return;
    }

    setLocationConfirmed(true);

    setLocationStatus(
      "Garage location confirmed successfully."
    );

    setError("");
  };


  // =====================================================
  // VALIDATE DETAILS
  // =====================================================

  const validateStep1 = () => {
    if (!form.name.trim()) {
      return "Enter your full name.";
    }

    if (!form.garageName.trim()) {
      return "Enter your garage name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Enter a valid email address.";
    }

    if (
      form.phone.trim() &&
      !/^\d{10}$/.test(
        form.phone.trim()
      )
    ) {
      return "Phone number must contain 10 digits.";
    }

    if (
      form.password.length < 6
    ) {
      return "Password must be at least 6 characters.";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    if (form.gst.trim()) {
      if (
        !/^[0-9A-Z]{15}$/.test(
          form.gst
            .trim()
            .toUpperCase()
        )
      ) {
        return "GST number should contain 15 characters.";
      }
    }

    if (!form.address.trim()) {
      return "Enter your complete garage address.";
    }

    if (
      !garageLocation?.coordinates ||
      garageLocation.coordinates.length !== 2
    ) {
      return "Please select your exact garage location.";
    }

    if (!locationConfirmed) {
      return "Please confirm your garage location on the map.";
    }

    return null;
  };


  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOtp = async () => {
    const validationError =
      validateStep1();

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      setLoading(true);
      setError("");

      const email =
        form.email
          .trim()
          .toLowerCase();

      const response =
        await sendOtp({
          email,
          purpose: "signup",
        });

      const debugOtp =
        response?.data?.debugOtp ||
        response?.data?.otp ||
        null;

      setServerOtp(
        debugOtp
          ? String(debugOtp)
          : null
      );

      setStep(2);
    } catch (err) {
      console.error(
        "Send mechanic OTP error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // REGISTER
  // =====================================================

  const handleVerifyAndRegister =
    async () => {
      if (!form.otp.trim()) {
        setError("Enter OTP.");

        return;
      }

      if (
        !garageLocation?.coordinates ||
        !locationConfirmed
      ) {
        setError(
          "Garage location must be confirmed."
        );

        setStep(1);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const payload = {
          name: form.name.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          password:
            form.password,

          garageName:
            form.garageName.trim(),

          address:
            form.address.trim(),

          otp:
            form.otp.trim(),

          garageLocation: {
            type: "Point",

            coordinates: [
              Number(
                garageLocation.coordinates[0]
              ),
              Number(
                garageLocation.coordinates[1]
              ),
            ],
          },
        };

        const phone =
          form.phone.trim();

        if (/^\d{10}$/.test(phone)) {
          payload.phone = phone;
        }

        if (form.gst.trim()) {
          payload.gst =
            form.gst
              .trim()
              .toUpperCase();
        }

        const response =
          await registerMechanic(
            payload
          );

        if (
          !response?.data?.success
        ) {
          throw new Error(
            response?.data?.message ||
              "Mechanic registration failed."
          );
        }

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        navigate(
          "/auth/mechanic/login",
          {
            replace: true,
            state: {
              registered: true,

              email:
                form.email
                  .trim()
                  .toLowerCase(),
            },
          }
        );
      } catch (err) {
        console.error(
          "Mechanic registration error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };


  // =====================================================
  // LOCATION DATA
  // =====================================================

  const latitude =
    garageLocation?.coordinates?.[1];

  const longitude =
    garageLocation?.coordinates?.[0];

  const mapCenter =
    garageLocation
      ? [
          latitude,
          longitude,
        ]
      : DEFAULT_CENTER;


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 py-8 md:py-12 relative overflow-hidden">

      {/* BACKGROUND */}

      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />


      <div className="relative max-w-6xl mx-auto">

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-2xl">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">


            {/* =================================================
                LEFT
            ================================================= */}

            <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent border-r border-white/10">

              <div>

                <div className="flex items-center gap-3 mb-12">

                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">

                    <img
                      src={logo}
                      alt="RoadsRiser"
                      className="w-10 h-10 object-contain"
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-extrabold">

                      Roads
                      <span className="text-blue-400">
                        Riser
                      </span>

                    </h2>

                    <p className="text-[9px] tracking-[0.25em] text-gray-500">
                      ROADSIDE ASSISTANCE
                    </p>

                  </div>

                </div>


                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  MECHANIC PARTNER PROGRAM

                </span>


                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mt-5">

                  Grow your

                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    garage business.
                  </span>

                </h1>


                <p className="mt-5 text-gray-400 leading-7 max-w-md">

                  Join RoadsRiser and connect
                  with drivers who need reliable
                  roadside assistance nearby.

                </p>

              </div>


              <div className="space-y-5 mt-12">

                <Benefit
                  icon={<FaTools />}
                  title="More Service Requests"
                  desc="Connect with customers nearby."
                />

                <Benefit
                  icon={<FaMapMarkerAlt />}
                  title="Accurate Location"
                  desc="Customers can find your garage accurately."
                />

                <Benefit
                  icon={<FaShieldAlt />}
                  title="Verified Platform"
                  desc="Professional and secure ecosystem."
                />

                <Benefit
                  icon={<FaClock />}
                  title="Work On Your Terms"
                  desc="Manage your availability yourself."
                />

              </div>

            </div>


            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="p-6 sm:p-8 md:p-10">

              <div className="flex items-start justify-between mb-8">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2">
                    Mechanic Registration
                  </p>

                  <h2 className="text-3xl font-extrabold">
                    Create your account
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">
                    Join RoadsRiser as a verified mechanic.
                  </p>

                </div>

                <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 items-center justify-center font-bold text-blue-400">
                  {step}/2
                </div>

              </div>


              {/* STEP */}

              <div className="flex items-center mb-8">

                <Step
                  number="1"
                  title="Details"
                  active={step === 1}
                  complete={step === 2}
                />

                <div
                  className={`flex-1 h-[2px] mx-3 ${
                    step === 2
                      ? "bg-blue-500"
                      : "bg-white/10"
                  }`}
                />

                <Step
                  number="2"
                  title="Verify"
                  active={step === 2}
                />

              </div>


              {/* ERROR */}

              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm flex gap-3">

                  <FaExclamationTriangle className="mt-0.5 shrink-0" />

                  <span>
                    {error}
                  </span>

                </div>
              )}


              {/* =================================================
                  STEP 1
              ================================================= */}

              {step === 1 && (
                <div className="space-y-5">

                  <div className="grid sm:grid-cols-2 gap-4">

                    <Input
                      icon={<FaUser />}
                      label="Full Name"
                      placeholder="Your full name"
                      value={form.name}
                      disabled={loading}
                      onChange={(e) =>
                        handle(
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      icon={<FaStore />}
                      label="Garage Name"
                      placeholder="Garage / shop name"
                      value={form.garageName}
                      disabled={loading}
                      onChange={(e) =>
                        handle(
                          "garageName",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <Input
                    icon={<FaEnvelope />}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    disabled={loading}
                    onChange={(e) =>
                      handle(
                        "email",
                        e.target.value
                      )
                    }
                  />


                  <div className="grid sm:grid-cols-2 gap-4">

                    <Input
                      icon={<FaPhoneAlt />}
                      label="Phone Number"
                      optional
                      placeholder="10 digit number"
                      value={form.phone}
                      disabled={loading}
                      maxLength={10}
                      inputMode="numeric"
                      onChange={(e) =>
                        handle(
                          "phone",
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />

                    <Input
                      icon={<FaIdCard />}
                      label="GST Number"
                      optional
                      placeholder="15 character GST"
                      value={form.gst}
                      disabled={loading}
                      maxLength={15}
                      onChange={(e) =>
                        handle(
                          "gst",
                          e.target.value.toUpperCase()
                        )
                      }
                    />

                  </div>


                  <div className="grid sm:grid-cols-2 gap-4">

                    <Input
                      icon={<FaLock />}
                      label="Password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      disabled={loading}
                      onChange={(e) =>
                        handle(
                          "password",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      icon={<FaLock />}
                      label="Confirm Password"
                      type="password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      disabled={loading}
                      onChange={(e) =>
                        handle(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  {/* ADDRESS */}

                  <div>

                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Complete Garage Address
                    </label>

                    <textarea
                      value={form.address}
                      disabled={loading}
                      placeholder="House / shop number, street, area, city, state..."
                      onChange={(e) =>
                        handle(
                          "address",
                          e.target.value
                        )
                      }
                      className="rr-input rr-textarea"
                    />

                  </div>


                  {/* =================================================
                      LOCATION SECTION
                  ================================================= */}

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                          <FaMapMarkerAlt />
                        </div>

                        <div>

                          <h3 className="font-bold">
                            Exact Garage Location
                          </h3>

                          <p className="text-xs text-gray-500 mt-1 leading-5">
                            Required for accurate distance
                            and nearby mechanic matching.
                          </p>

                        </div>

                      </div>


                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold">
                        REQUIRED
                      </span>

                    </div>


                    {/* GPS */}

                    <button
                      type="button"
                      onClick={
                        getCurrentGarageLocation
                      }
                      disabled={
                        loading ||
                        locationLoading
                      }
                      className="mt-5 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 flex items-center justify-center gap-2 font-bold transition"
                    >

                      {locationLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Detecting Location...
                        </>
                      ) : (
                        <>
                          <FaCrosshairs />
                          Use My Current Location
                        </>
                      )}

                    </button>


                    <div className="text-center text-xs text-gray-500 my-3">
                      OR
                    </div>


                    {/* MAP MODE */}

                    <button
                      type="button"
                      onClick={() => {
                        setMapMode(true);
                        setError("");
                      }}
                      disabled={loading}
                      className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 font-semibold flex items-center justify-center gap-2 transition"
                    >

                      <FaMapMarkerAlt />

                      Select Garage on Map

                    </button>


                    <p className="text-[11px] text-gray-500 text-center mt-3 leading-5">
                      If you are not physically at your garage,
                      use the map option and place the marker
                      directly on your garage.
                    </p>


                    {/* =================================================
    LOCATION INFO + MAP
================================================= */}

{mapMode && (
  <div className="mt-5">

    {/* MAP INSTRUCTION */}

    <div className="mb-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

      <div className="flex gap-3">

        <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0" />

        <div>

          <p className="text-sm font-semibold text-gray-200">
            Select your exact garage location
          </p>

          <p className="text-xs text-gray-500 mt-1 leading-5">
            Click directly on your garage location
            on the map. You can also drag the marker
            after selecting it.
          </p>

        </div>

      </div>

    </div>


    {/* =================================================
        MAP
    ================================================= */}

    <div className="h-[320px] rounded-2xl overflow-hidden border border-white/10">

      <MapContainer
        center={
          garageLocation
            ? [
                garageLocation.coordinates[1],
                garageLocation.coordinates[0],
              ]
            : DEFAULT_CENTER
        }
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* Recenter only after location exists */}

        {garageLocation && (
          <MapRecenter
            center={{
              latitude:
                garageLocation.coordinates[1],

              longitude:
                garageLocation.coordinates[0],
            }}
          />
        )}


        {/* CLICK MAP TO SELECT LOCATION */}

        <MapClickHandler
          onSelect={handleMapSelect}
        />


        {/* MARKER ONLY AFTER LOCATION SELECTED */}

        {garageLocation && (
          <Marker
            position={[
              garageLocation.coordinates[1],
              garageLocation.coordinates[0],
            ]}
            icon={garageIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          >

            <Popup>

              <strong>
                Garage Location
              </strong>

              <br />

              Drag this marker to adjust
              the exact garage position.

            </Popup>

          </Marker>
        )}

      </MapContainer>

    </div>


    {/* MAP HELP */}

    <p className="text-xs text-gray-500 text-center mt-3">

      📍 Click anywhere on the map to place the
      garage marker.

      <br />

      You can drag the marker to fine-tune the
      exact position.

    </p>


    {/* =================================================
        LOCATION DETAILS
    ================================================= */}

    {garageLocation && (
      <div className="mt-4">

        {/* ACCURACY / STATUS */}

        <div
          className={`rounded-xl p-4 border ${
            locationConfirmed
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-yellow-500/20 bg-yellow-500/5"
          }`}
        >

          <div className="flex gap-3">

            {locationConfirmed ? (
              <FaCheckCircle className="text-emerald-400 mt-1 shrink-0" />
            ) : (
              <FaExclamationTriangle className="text-yellow-400 mt-1 shrink-0" />
            )}

            <div>

              <p className="font-semibold text-sm">

                {locationConfirmed
                  ? "Garage location confirmed"
                  : "Please verify this location"}

              </p>


              <p className="text-xs text-gray-500 mt-1">

                {locationConfirmed
                  ? "This exact point will be saved as your garage location."
                  : locationStatus}

              </p>


              {locationAccuracy !== null && (
                <p className="text-xs text-gray-400 mt-2">

                  GPS accuracy:{" "}

                  <strong>
                    {Math.round(
                      locationAccuracy
                    )}{" "}
                    meters
                  </strong>

                </p>
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            COORDINATES
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 mt-3">

          <Coordinate
            label="Latitude"
            value={
              garageLocation.coordinates[1]
            }
          />

          <Coordinate
            label="Longitude"
            value={
              garageLocation.coordinates[0]
            }
          />

        </div>


        {/* =================================================
            CONFIRM BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={
            confirmGarageLocation
          }
          className={`w-full mt-4 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
            locationConfirmed
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >

          <FaCheckCircle />

          {locationConfirmed
            ? "Garage Location Confirmed"
            : "Confirm Garage Location"}

        </button>

      </div>
    )}

  </div>
)}

                  </div>


                  {/* CONTINUE */}

                  <button
                    type="button"
                    onClick={
                      handleSendOtp
                    }
                    disabled={loading}
                    className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition"
                  >

                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue to Verification
                        <FaArrowRight />
                      </>
                    )}

                  </button>


                  <p className="text-center text-sm text-gray-500">

                    Already have an account?{" "}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/auth/mechanic/login"
                        )
                      }
                      className="text-blue-400 font-semibold hover:text-blue-300"
                    >
                      Login
                    </button>

                  </p>

                </div>
              )}


              {/* =================================================
                  STEP 2
              ================================================= */}

              {step === 2 && (
                <div className="space-y-6">

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <FaEnvelope />
                      </div>

                      <div>

                        <p className="font-semibold">
                          Verify your email
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          OTP sent to
                        </p>

                        <p className="text-sm text-blue-400 break-all mt-1">
                          {form.email}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* LOCATION CONFIRMED */}

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                    <div className="flex gap-3">

                      <FaCheckCircle className="text-emerald-400 mt-1" />

                      <div>

                        <p className="font-semibold text-sm">
                          Garage location confirmed
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Exact coordinates will be used
                          for nearby mechanic matching.
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* OTP */}

                  <div>

                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Verification OTP
                    </label>

                    <div className="relative">

                      <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        value={form.otp}
                        disabled={loading}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="Enter 6 digit OTP"
                        onChange={(e) =>
                          handle(
                            "otp",
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className="rr-input rr-otp"
                      />

                    </div>

                  </div>


                  {/* REGISTER */}

                  <button
                    type="button"
                    onClick={
                      handleVerifyAndRegister
                    }
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-60 font-bold flex items-center justify-center gap-2 transition"
                  >

                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Verify & Create Account
                      </>
                    )}

                  </button>


                  {/* BACK / RESEND */}

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setStep(1);
                        setError("");

                        setForm((prev) => ({
                          ...prev,
                          otp: "",
                        }));
                      }}
                      className="py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-gray-300 flex items-center justify-center gap-2"
                    >

                      <FaArrowLeft />

                      Edit Details

                    </button>


                    <button
                      type="button"
                      disabled={loading}
                      onClick={
                        handleSendOtp
                      }
                      className="py-3 rounded-xl border border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                    >
                      Resend OTP
                    </button>

                  </div>


                  {serverOtp && (
                    <p className="text-center text-xs text-yellow-400/70">
                      DEBUG OTP (development only):{" "}
                      {serverOtp}
                    </p>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-gray-500">

          <span className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-400" />
            Secure Registration
          </span>

          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-blue-400" />
            Verified Platform
          </span>

          <span className="flex items-center gap-2">
            <FaClock className="text-purple-400" />
            24/7 Support
          </span>

        </div>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        .rr-input {
          box-sizing:border-box;
          width:100%;
          height:54px;

          padding:13px 14px 13px 48px;

          border-radius:12px;
          border:1px solid rgba(255,255,255,.10);

          background:rgba(255,255,255,.035);

          color:#fff;
          outline:none;

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .rr-input::placeholder {
          color:#64748b;
        }

        .rr-input:focus {
          border-color:rgba(59,130,246,.75);

          background:rgba(59,130,246,.045);

          box-shadow:
            0 0 0 3px rgba(59,130,246,.10);
        }

        .rr-input:disabled {
          opacity:.55;
          cursor:not-allowed;
        }

        .rr-textarea {
          height:105px;
          padding:14px;
          resize:none;
          line-height:1.5;
        }

        .rr-otp {
          padding-left:55px;
          padding-right:20px;

          text-align:center;

          letter-spacing:.45em;

          font-weight:700;
          font-size:18px;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color:white;

          -webkit-box-shadow:
            0 0 0 1000px #0f172a inset;
        }

        .leaflet-container {
          width:100%;
          height:100%;
          font-family:Arial,Helvetica,sans-serif;
          background:#0f172a;
        }

        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background:white;
        }

        .leaflet-popup-content {
          color:#111827;
        }

        .leaflet-control-zoom a {
          background:#0f172a !important;
          color:white !important;
          border-color:#334155 !important;
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
// INPUT
// =====================================================

function Input({
  icon,
  label,
  optional,
  ...props
}) {
  return (
    <div>

      <label className="block text-xs font-semibold text-gray-400 mb-2">

        {label}

        {optional && (
          <span className="text-gray-600 font-normal ml-1">
            (optional)
          </span>
        )}

      </label>


      <div className="relative">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
          {icon}
        </span>

        <input
          {...props}
          className="rr-input"
        />

      </div>

    </div>
  );
}


// =====================================================
// COORDINATE
// =====================================================

function Coordinate({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">

      <p className="text-[10px] uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-200 mt-1">
        {Number(value).toFixed(6)}
      </p>

    </div>
  );
}


// =====================================================
// BENEFIT
// =====================================================

function Benefit({
  icon,
  title,
  desc,
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {desc}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// STEP
// =====================================================

function Step({
  number,
  title,
  active,
  complete,
}) {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
          active || complete
            ? "bg-blue-600 border-blue-500 text-white"
            : "bg-white/5 border-white/10 text-gray-500"
        }`}
      >

        {complete ? (
          <FaCheckCircle />
        ) : (
          number
        )}

      </div>

      <span
        className={`hidden sm:block text-xs font-semibold ${
          active || complete
            ? "text-gray-200"
            : "text-gray-600"
        }`}
      >
        {title}
      </span>

    </div>
  );
}