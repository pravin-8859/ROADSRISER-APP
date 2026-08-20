import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaUserCircle,
  FaUserPlus,
  FaTimes,
  FaShieldAlt,
  FaRoad,
} from "react-icons/fa";

export default function LoginRequiredModal({
  isOpen,
  onClose,
  redirectTo = "/request-help",
}) {
  const navigate = useNavigate();

  // ESC key se modal close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goToLogin = () => {
    onClose();

    navigate("/user/login", {
      state: {
        redirectTo,
      },
    });
  };

  const goToSignup = () => {
    onClose();

    navigate("/user/signup", {
      state: {
        redirectTo,
      },
    });
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        px-4 py-6
        bg-black/75
        backdrop-blur-md
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full max-w-[460px]
          overflow-hidden
          rounded-[28px]
          border border-white/10
          bg-[#0b1220]
          text-white
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
        "
      >
        {/* GLOW */}
        <div className="absolute -top-32 -right-28 w-72 h-72 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="absolute -bottom-32 -left-28 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute top-4 right-4 z-20
            w-10 h-10
            rounded-full
            flex items-center justify-center
            bg-white/5
            border border-white/10
            text-gray-400
            hover:text-white
            hover:bg-white/10
            transition
          "
        >
          <FaTimes />
        </button>

        <div className="relative p-6 sm:p-8 md:p-9">
          {/* BRAND */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="
                w-11 h-11
                rounded-xl
                flex items-center justify-center
                bg-gradient-to-br
                from-blue-600 to-indigo-600
                shadow-lg shadow-blue-600/20
              "
            >
              <FaRoad />
            </div>

            <div>
              <h3 className="font-extrabold text-lg">
                Roads
                <span className="text-blue-400">
                  Riser
                </span>
              </h3>

              <p className="text-[9px] tracking-[0.22em] text-gray-500">
                ROADSIDE ASSISTANCE
              </p>
            </div>
          </div>

          {/* LOCK */}
          <div
            className="
              mx-auto
              w-16 h-16
              rounded-2xl
              flex items-center justify-center
              bg-blue-500/10
              border border-blue-500/20
              text-blue-400
              text-2xl
              shadow-[0_0_35px_rgba(59,130,246,0.12)]
            "
          >
            <FaLock />
          </div>

          {/* CONTENT */}
          <div className="text-center mt-6">
            <p
              className="
                text-blue-400
                text-[11px]
                font-bold
                tracking-[0.22em]
                uppercase
                mb-2
              "
            >
              Authentication Required
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Login to request help
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-400 leading-6">
              To request roadside assistance, please sign in to your
              RoadsRiser account or create a new account.
            </p>
          </div>

          {/* SECURITY INFO */}
          <div
            className="
              mt-6
              flex items-start gap-3
              p-4
              rounded-2xl
              border border-emerald-500/15
              bg-emerald-500/[0.06]
            "
          >
            <FaShieldAlt className="text-emerald-400 mt-0.5 shrink-0" />

            <div>
              <p className="text-sm font-semibold text-gray-200">
                Secure roadside requests
              </p>

              <p className="text-xs text-gray-500 mt-1 leading-5">
                Login helps us connect your request, location and mechanic
                securely with your account.
              </p>
            </div>
          </div>

          {/* LOGIN */}
          <button
            type="button"
            onClick={goToLogin}
            className="
              group
              mt-7
              w-full
              flex items-center justify-center gap-3
              py-3.5
              rounded-xl
              bg-gradient-to-r
              from-blue-600 to-indigo-600
              text-white
              font-bold
              shadow-lg shadow-blue-600/20
              hover:shadow-blue-600/40
              hover:scale-[1.01]
              transition-all
            "
          >
            <FaUserCircle />

            Login to Continue
          </button>

          {/* SIGNUP */}
          <button
            type="button"
            onClick={goToSignup}
            className="
              mt-3
              w-full
              flex items-center justify-center gap-3
              py-3.5
              rounded-xl
              border border-white/10
              bg-white/[0.035]
              text-gray-200
              font-semibold
              hover:bg-white/[0.07]
              hover:border-blue-500/30
              transition
            "
          >
            <FaUserPlus />

            Create New Account
          </button>

          {/* CONTINUE */}
          <button
            type="button"
            onClick={onClose}
            className="
              block
              mx-auto
              mt-5
              text-sm
              text-gray-500
              hover:text-gray-300
              transition
            "
          >
            Continue browsing
          </button>

          <div className="mt-7 pt-5 border-t border-white/10">
            <p className="text-[11px] text-center text-gray-600">
              24/7 roadside assistance • Verified mechanics • Secure requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}