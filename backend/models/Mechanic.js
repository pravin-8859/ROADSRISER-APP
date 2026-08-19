import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC PROFILE
    // =====================================================

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    gst: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    garageName: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // =====================================================
    // PERMANENT GARAGE / SHOP LOCATION
    // =====================================================

    garageLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },

      coordinates: {
        type: [Number],
        validate: {
          validator: function (value) {
            // Location optional hai.
            if (value === undefined || value === null) {
              return true;
            }

            return (
              Array.isArray(value) &&
              value.length === 2 &&
              Number.isFinite(value[0]) &&
              Number.isFinite(value[1]) &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },

          message:
            "Garage coordinates must be [longitude, latitude].",
        },
      },
    },

    // =====================================================
    // CURRENT / LIVE MECHANIC LOCATION
    // =====================================================

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },

      coordinates: {
        type: [Number],
        validate: {
          validator: function (value) {
            // Location optional hai.
            if (value === undefined || value === null) {
              return true;
            }

            return (
              Array.isArray(value) &&
              value.length === 2 &&
              Number.isFinite(value[0]) &&
              Number.isFinite(value[1]) &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },

          message:
            "Current coordinates must be [longitude, latitude].",
        },
      },
    },

    // =====================================================
    // MECHANIC AVAILABILITY
    // =====================================================

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
    },

    // =====================================================
    // VERIFICATION
    // =====================================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    otpHash: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    // =====================================================
    // AUTH
    // =====================================================

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// EMAIL INDEX
// =====================================================

mechanicSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// =====================================================
// GEO-SPATIAL INDEXES
// =====================================================

mechanicSchema.index({
  garageLocation: "2dsphere",
});

mechanicSchema.index({
  currentLocation: "2dsphere",
});

// =====================================================
// ONLINE + CURRENT LOCATION INDEX
// =====================================================

mechanicSchema.index({
  isOnline: 1,
  activeRequest: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Request",
  default: null,
  index: true,
},
  currentLocation: "2dsphere",
});

// =====================================================
// PASSWORD HASHING
// =====================================================

mechanicSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || !this.password) {
      return next();
    }

    const saltRounds = 10;

    this.password = await bcrypt.hash(
      this.password,
      saltRounds
    );

    next();
  } catch (err) {
    next(err);
  }
});

// =====================================================
// PASSWORD COMPARISON
// =====================================================

mechanicSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!this.password || !enteredPassword) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

export default mongoose.model(
  "Mechanic",
  mechanicSchema
);