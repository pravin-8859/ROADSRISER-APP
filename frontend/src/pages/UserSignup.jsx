import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaClock,
  FaTools,
} from "react-icons/fa";

import logo from "../assets/logo.png";

export default function UserSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handle = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErr("");
    setSuccess("");
  };


  // =====================================================
  // VALIDATION
  // =====================================================

  const validateDetails = () => {
    if (!form.name.trim()) {
      return "Please enter your full name";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address";
    }

    const phone = form.phone.replace(/\D/g, "");

    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must contain 10 digits";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };


  // =====================================================
  // START RESEND TIMER
  // =====================================================

  const startResendCooldown = () => {
    setResendCooldown(60);

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };


  // =====================================================
  // SEND EMAIL OTP
  // =====================================================

  const sendOtpToUser = async () => {
    const validationError = validateDetails();

    if (validationError) {
      setErr(validationError);
      return;
    }

    if (resendCooldown > 0) {
      return;
    }

    try {
      setLoading(true);
      setErr("");
      setSuccess("");

      const cleanEmail = form.email
        .trim()
        .toLowerCase();

      const cleanPhone = form.phone.replace(
        /\D/g,
        ""
      );

      await API.post(
        "/users/send-signup-otp",
        {
          name: form.name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          password: form.password,
        }
      );

      /*
        IMPORTANT:

        Backend OTP ko response me return nahi karta.
        OTP directly user's email par jayega.
      */

      setStep(2);

      setSuccess(
        "Verification OTP has been sent to your email."
      );

      startResendCooldown();

    } catch (error) {
      console.error(
        "User email OTP error:",
        error
      );

      setErr(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to send verification OTP"
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // VERIFY EMAIL OTP + CREATE ACCOUNT
  // =====================================================

  const handleSignup = async () => {
    const otp = form.otp.trim();

    if (!/^\d{6}$/.test(otp)) {
      setErr(
        "Please enter the 6-digit OTP sent to your email"
      );
      return;
    }

    try {
      setLoading(true);
      setErr("");
      setSuccess("");

      const cleanEmail = form.email
        .trim()
        .toLowerCase();

      /*
        Backend OTP verify karega.

        Frontend ke paas serverOtp nahi hoga.
        Isliye user OTP ko frontend me compare
        karne ki zarurat nahi hai.
      */

      await API.post(
        "/users/verify-signup-otp",
        {
          email: cleanEmail,
          otp,
        }
      );

      setSuccess(
        "Email verified and account created successfully."
      );

      /*
        Login page par redirect.
        Existing login flow same rahega.
      */

      setTimeout(() => {
        navigate("/user/login", {
          replace: true,
          state: {
            registered: true,
            email: cleanEmail,
          },
        });
      }, 1200);

    } catch (error) {
      console.error(
        "User signup verification error:",
        error
      );

      setErr(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // BACK TO DETAILS
  // =====================================================

  const editDetails = () => {
    if (loading) return;

    setStep(1);

    setErr("");
    setSuccess("");

    setForm((prev) => ({
      ...prev,
      otp: "",
    }));
  };


  return (
    <div className="
      min-h-screen
      bg-[#020617]
      text-white
      px-4
      py-10
      md:py-14
      relative
      overflow-hidden
    ">

      {/* =================================
          BACKGROUND GLOW
      ================================= */}

      <div className="
        absolute
        top-[-180px]
        left-[-160px]
        w-[420px]
        h-[420px]
        rounded-full
        bg-blue-600/20
        blur-[130px]
        pointer-events-none
      " />

      <div className="
        absolute
        bottom-[-180px]
        right-[-150px]
        w-[450px]
        h-[450px]
        rounded-full
        bg-indigo-600/20
        blur-[140px]
        pointer-events-none
      " />

      <div className="
        absolute
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-[500px]
        h-[500px]
        rounded-full
        bg-cyan-500/5
        blur-[150px]
        pointer-events-none
      " />


      {/* =================================
          MAIN CONTAINER
      ================================= */}

      <div className="
        relative
        max-w-6xl
        mx-auto
      ">

        <div className="
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-white/[0.045]
          backdrop-blur-2xl
          shadow-[0_30px_100px_rgba(0,0,0,0.5)]
        ">

          <div className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
          ">


            {/* =================================
                LEFT BRAND PANEL
            ================================= */}

            <div className="
              relative
              hidden
              lg:flex
              flex-col
              justify-between
              p-10
              xl:p-12
              bg-gradient-to-br
              from-blue-600/25
              via-indigo-600/15
              to-transparent
              border-r
              border-white/10
              overflow-hidden
            ">

              {/* Decorative circles */}

              <div className="
                absolute
                -top-28
                -right-28
                w-72
                h-72
                rounded-full
                border
                border-blue-400/10
                pointer-events-none
              " />

              <div className="
                absolute
                -top-16
                -right-16
                w-48
                h-48
                rounded-full
                border
                border-blue-400/10
                pointer-events-none
              " />


              {/* LOGO */}

              <div className="relative">

                <div className="
                  flex
                  items-center
                  gap-3
                  mb-12
                ">

                  <div className="
                    w-12
                    h-12
                    bg-white
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    shadow-xl
                  ">

                    <img
                      src={logo}
                      alt="RoadsRiser"
                      className="
                        w-10
                        h-10
                        object-contain
                      "
                    />

                  </div>

                  <div>

                    <h2 className="
                      text-xl
                      font-extrabold
                    ">
                      Roads
                      <span className="text-blue-400">
                        Riser
                      </span>
                    </h2>

                    <p className="
                      text-[9px]
                      tracking-[0.25em]
                      text-gray-500
                    ">
                      ROADSIDE ASSISTANCE
                    </p>

                  </div>

                </div>


                {/* BADGE */}

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-emerald-400/10
                  border
                  border-emerald-400/20
                  text-emerald-400
                  text-xs
                  font-semibold
                  mb-5
                ">

                  <span className="
                    w-2
                    h-2
                    rounded-full
                    bg-emerald-400
                    animate-pulse
                  " />

                  DRIVER REGISTRATION

                </div>


                <h1 className="
                  text-4xl
                  xl:text-5xl
                  font-extrabold
                  leading-tight
                ">

                  Get help when

                  <span className="
                    block
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-blue-400
                    to-cyan-300
                  ">
                    you need it.
                  </span>

                </h1>


                <p className="
                  mt-5
                  text-gray-400
                  leading-7
                  max-w-md
                ">
                  Create your RoadsRiser account and
                  get quick access to trusted mechanics
                  and roadside assistance near you.
                </p>

              </div>


              {/* BENEFITS */}

              <div className="
                relative
                mt-12
                space-y-5
              ">

                <SignupBenefit
                  icon={<FaToolsIcon />}
                  title="Find Nearby Mechanics"
                  desc="Connect with mechanics around your location."
                />

                <SignupBenefit
                  icon={<FaShieldAlt />}
                  title="Trusted & Secure"
                  desc="Verified roadside assistance ecosystem."
                />

                <SignupBenefit
                  icon={<FaClock />}
                  title="24/7 Roadside Help"
                  desc="Get assistance whenever you need it."
                />

              </div>


              {/* QUOTE */}

              <div className="
                relative
                mt-10
                pt-8
                border-t
                border-white/10
              ">

                <p className="
                  text-sm
                  text-gray-500
                  leading-relaxed
                ">
                  "When the road stops, RoadsRiser
                  helps you move again."
                </p>

              </div>

            </div>


            {/* =================================
                RIGHT FORM
            ================================= */}

            <div className="
              p-6
              sm:p-8
              md:p-10
              xl:p-12
            ">


              {/* MOBILE LOGO */}

              <div className="
                lg:hidden
                flex
                items-center
                gap-3
                mb-10
              ">

                <div className="
                  w-11
                  h-11
                  bg-white
                  rounded-xl
                  flex
                  items-center
                  justify-center
                ">

                  <img
                    src={logo}
                    alt="RoadsRiser"
                    className="
                      w-9
                      h-9
                      object-contain
                    "
                  />

                </div>

                <div>

                  <h2 className="
                    font-extrabold
                    text-lg
                  ">
                    Roads
                    <span className="text-blue-400">
                      Riser
                    </span>
                  </h2>

                  <p className="
                    text-[8px]
                    tracking-[0.2em]
                    text-gray-500
                  ">
                    ROADSIDE ASSISTANCE
                  </p>

                </div>

              </div>


              {/* HEADER */}

              <div className="
                flex
                items-start
                justify-between
                gap-4
                mb-8
              ">

                <div>

                  <p className="
                    text-blue-400
                    text-xs
                    font-bold
                    tracking-[0.2em]
                    uppercase
                    mb-2
                  ">
                    Create Account
                  </p>

                  <h2 className="
                    text-3xl
                    md:text-4xl
                    font-extrabold
                    text-white
                  ">
                    Join RoadsRiser
                  </h2>

                  <p className="
                    mt-2
                    text-sm
                    text-gray-400
                  ">
                    Create your account in just a few
                    simple steps.
                  </p>

                </div>


                <div className="
                  shrink-0
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  rounded-xl
                  bg-blue-500/10
                  border
                  border-blue-500/20
                  text-blue-400
                  font-bold
                ">
                  {step}/2
                </div>

              </div>


              {/* STEP INDICATOR */}

              <div className="
                flex
                items-center
                mb-8
              ">

                <StepIndicator
                  number="1"
                  title="Details"
                  active={step === 1}
                  completed={step === 2}
                />

                <div
                  className={`
                    flex-1
                    h-[2px]
                    mx-3
                    ${
                      step === 2
                        ? "bg-blue-500"
                        : "bg-white/10"
                    }
                  `}
                />

                <StepIndicator
                  number="2"
                  title="Verify Email"
                  active={step === 2}
                />

              </div>


              {/* ERROR */}

              {err && (
                <div className="
                  mb-6
                  p-4
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                ">

                  <div className="
                    flex
                    items-start
                    gap-3
                  ">

                    <span className="text-red-400">
                      ⚠
                    </span>

                    <p className="
                      text-sm
                      text-red-300
                    ">
                      {err}
                    </p>

                  </div>

                </div>
              )}


              {/* SUCCESS */}

              {success && (
                <div className="
                  mb-6
                  p-4
                  rounded-xl
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                ">

                  <div className="
                    flex
                    items-start
                    gap-3
                  ">

                    <FaCheckCircle className="
                      text-emerald-400
                      mt-0.5
                    " />

                    <p className="
                      text-sm
                      text-emerald-300
                    ">
                      {success}
                    </p>

                  </div>

                </div>
              )}


              {/* =================================
                  STEP 1
              ================================= */}

              {step === 1 && (
                <div className="space-y-5">

                  <InputField
                    icon={<FaUser />}
                    label="Full Name"
                    placeholder="Enter your name"
                    value={form.name}
                    disabled={loading}
                    autoComplete="name"
                    onChange={(e) =>
                      handle(
                        "name",
                        e.target.value
                      )
                    }
                  />


                  <InputField
                    icon={<FaEnvelope />}
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                    disabled={loading}
                    autoComplete="email"
                    onChange={(e) =>
                      handle(
                        "email",
                        e.target.value
                      )
                    }
                  />


                  <InputField
                    icon={<FaPhoneAlt />}
                    label="Phone Number"
                    placeholder="10 digit mobile number"
                    value={form.phone}
                    disabled={loading}
                    inputMode="numeric"
                    maxLength={10}
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


                  <InputField
                    icon={<FaLock />}
                    label="Password"
                    placeholder="Minimum 6 characters"
                    type="password"
                    value={form.password}
                    disabled={loading}
                    autoComplete="new-password"
                    onChange={(e) =>
                      handle(
                        "password",
                        e.target.value
                      )
                    }
                  />


                  {/* SEND EMAIL OTP */}

                  <button
                    type="button"
                    onClick={sendOtpToUser}
                    disabled={loading}
                    className="
                      group
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-3
                      py-3.5
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      text-white
                      font-bold
                      shadow-lg
                      shadow-blue-600/20
                      hover:shadow-blue-600/40
                      hover:scale-[1.01]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition-all
                      mt-2
                    "
                  >

                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending Verification OTP...
                      </>
                    ) : (
                      <>
                        Continue to Email Verification
                        <FaArrowRight className="
                          group-hover:translate-x-1
                          transition-transform
                        " />
                      </>
                    )}

                  </button>


                  {/* LOGIN */}

                  <p className="
                    text-center
                    text-sm
                    text-gray-500
                    pt-2
                  ">

                    Already have an account?{" "}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        navigate("/user/login")
                      }
                      className="
                        font-semibold
                        text-blue-400
                        hover:text-blue-300
                        transition
                      "
                    >
                      Login
                    </button>

                  </p>

                </div>
              )}


              {/* =================================
                  STEP 2
              ================================= */}

              {step === 2 && (
                <div className="space-y-6">


                  {/* OTP INFO */}

                  <div className="
                    p-5
                    rounded-2xl
                    border
                    border-blue-500/20
                    bg-blue-500/5
                  ">

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">

                      <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/10
                        flex
                        items-center
                        justify-center
                        text-blue-400
                        text-xl
                      ">
                        <FaEnvelope />
                      </div>


                      <div>

                        <p className="
                          text-sm
                          font-semibold
                          text-white
                        ">
                          Verify your email
                        </p>

                        <p className="
                          text-xs
                          text-gray-400
                          mt-1
                        ">
                          OTP sent to
                        </p>

                        <p className="
                          text-sm
                          text-blue-400
                          font-medium
                          break-all
                        ">
                          {form.email}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* OTP */}

                  <div>

                    <label className="
                      block
                      text-xs
                      font-semibold
                      text-gray-400
                      mb-2
                    ">
                      Enter Verification OTP
                    </label>

                    <div className="relative">

                      <FaShieldAlt
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-500
                          z-10
                          pointer-events-none
                        "
                      />

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6 digit OTP"
                        value={form.otp}
                        disabled={loading}
                        autoComplete="one-time-code"
                        onChange={(e) =>
                          handle(
                            "otp",
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className="
                          user-signup-input
                          user-otp
                        "
                      />

                    </div>

                  </div>


                  {/* VERIFY BUTTON */}

                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={loading}
                    className="
                      group
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-3
                      py-3.5
                      rounded-xl
                      bg-gradient-to-r
                      from-emerald-500
                      to-cyan-500
                      text-white
                      font-bold
                      shadow-lg
                      shadow-emerald-500/10
                      hover:scale-[1.01]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition-all
                    "
                  >

                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Verifying Email...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Verify & Create Account
                      </>
                    )}

                  </button>


                  {/* BACK */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={editDetails}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      text-gray-300
                      hover:bg-white/[0.07]
                      transition
                    "
                  >

                    <FaArrowLeft />

                    Edit Details

                  </button>


                  {/* RESEND */}

                  <div className="
                    text-center
                    text-xs
                    text-gray-500
                  ">

                    Didn't receive the OTP?

                    <button
                      type="button"
                      disabled={
                        loading ||
                        resendCooldown > 0
                      }
                      onClick={sendOtpToUser}
                      className="
                        ml-1
                        text-blue-400
                        hover:text-blue-300
                        font-semibold
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    >

                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend"}

                    </button>

                  </div>

                </div>
              )}


              {/* TRUST */}

              <div className="
                mt-10
                pt-7
                border-t
                border-white/10
              ">

                <div className="
                  flex
                  flex-wrap
                  justify-center
                  gap-x-6
                  gap-y-3
                  text-xs
                  text-gray-500
                ">

                  <span className="
                    flex
                    items-center
                    gap-2
                  ">
                    <FaShieldAlt className="
                      text-emerald-400
                    " />
                    Secure Signup
                  </span>

                  <span className="
                    flex
                    items-center
                    gap-2
                  ">
                    <FaCheckCircle className="
                      text-blue-400
                    " />
                    Email Verified
                  </span>

                  <span className="
                    flex
                    items-center
                    gap-2
                  ">
                    <FaClock className="
                      text-purple-400
                    " />
                    24/7 Assistance
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          INPUT CSS
      ================================= */}

      <style>{`

        .user-signup-input {
          box-sizing: border-box;

          width: 100%;
          height: 56px;

          padding: 13px 15px 13px 50px;

          border-radius: 13px;

          border: 1px solid rgba(255,255,255,0.10);

          background: rgba(255,255,255,0.035);

          color: #ffffff;

          outline: none;

          font-size: 15px;

          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }


        .user-signup-input::placeholder {
          color: #64748b;
          opacity: 1;
        }


        .user-signup-input:hover {
          border-color:
            rgba(96,165,250,0.30);
        }


        .user-signup-input:focus {
          border-color:
            rgba(59,130,246,0.75);

          background:
            rgba(59,130,246,0.045);

          box-shadow:
            0 0 0 3px
            rgba(59,130,246,0.10);
        }


        .user-signup-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }


        .user-otp {
          text-align: center;

          padding-left: 58px;
          padding-right: 20px;

          letter-spacing: 0.45em;

          font-weight: 700;

          font-size: 18px;
        }


        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {

          -webkit-text-fill-color: white;

          -webkit-box-shadow:
            0 0 0px 1000px
            #0f172a inset;

          transition:
            background-color
            5000s
            ease-in-out
            0s;
        }

      `}</style>

    </div>
  );
}


// =========================================
// INPUT COMPONENT
// =========================================

function InputField({
  icon,
  label,
  ...props
}) {
  return (
    <div>

      <label className="
        block
        text-xs
        font-semibold
        text-gray-400
        mb-2
      ">
        {label}
      </label>

      <div className="relative">

        <span className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          z-10
          text-gray-500
          pointer-events-none
          flex
          items-center
          justify-center
          w-4
          h-4
        ">
          {icon}
        </span>

        <input
          {...props}
          className="user-signup-input"
        />

      </div>

    </div>
  );
}


// =========================================
// BENEFIT COMPONENT
// =========================================

function SignupBenefit({
  icon,
  title,
  desc,
}) {
  return (
    <div className="
      flex
      items-center
      gap-4
    ">

      <div className="
        shrink-0
        w-11
        h-11
        rounded-xl
        bg-white/5
        border
        border-white/10
        flex
        items-center
        justify-center
        text-blue-400
      ">
        {icon}
      </div>

      <div>

        <h3 className="
          text-sm
          font-semibold
          text-white
        ">
          {title}
        </h3>

        <p className="
          text-xs
          text-gray-500
          mt-1
        ">
          {desc}
        </p>

      </div>

    </div>
  );
}


// =========================================
// STEP INDICATOR
// =========================================

function StepIndicator({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="
      flex
      items-center
      gap-2
    ">

      <div
        className={`
          w-8
          h-8
          rounded-full
          flex
          items-center
          justify-center
          text-xs
          font-bold
          border
          transition-all

          ${
            active || completed
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-white/5 border-white/10 text-gray-500"
          }
        `}
      >

        {completed ? (
          <FaCheckCircle />
        ) : (
          number
        )}

      </div>

      <span
        className={`
          hidden
          sm:block
          text-xs
          font-semibold

          ${
            active || completed
              ? "text-gray-200"
              : "text-gray-600"
          }
        `}
      >
        {title}
      </span>

    </div>
  );
}


// =========================================
// TOOLS ICON
// =========================================

function FaToolsIcon() {
  return <FaTools />;
}