import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    // ================= USER =================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= LOCATION =================
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      // GeoJSON format: [longitude, latitude]
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message:
            "Coordinates must be [longitude, latitude] with valid values.",
        },
      },
    },

    // ================= ADDRESS =================
    address: {
      type: String,
      trim: true,
      default: "",
    },

    // ================= VEHICLE =================
    vehicleType: {
      type: String,
      trim: true,
      default: "",
    },

    // ================= PROBLEM =================
    problem: {
      type: String,
      trim: true,
      default: "",
    },

    // ================= SERVICE =================
    serviceType: {
      type: String,
      trim: true,
      default: "",
    },

    // ================= DESCRIPTION =================
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "enroute",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // ================= MECHANIC =================
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    // ================= FARE =================
    fare: {
      type: Number,
      min: 0,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

// ================= GEO LOCATION INDEX =================
requestSchema.index({
  location: "2dsphere",
});

// ================= EXPORT =================
export default mongoose.model("Request", requestSchema);