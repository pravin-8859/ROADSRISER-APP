import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,

        validate: {
          validator: function (value) {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value.every((num) => Number.isFinite(num)) &&
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

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    vehicleType: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    problem: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },

    serviceType: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

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
      index: true,
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
      index: true,
    },

    /*
     * =====================================================
     * MECHANIC CANCELLATION HISTORY
     * =====================================================
     *
     * Har mechanic jo request release/cancel karega
     * uska record yahan save hoga.
     *
     * Isse same mechanic ko wahi request dobara nahi milegi.
     */

    declinedMechanics: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mechanic",
  },
],

    cancellationHistory: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },

        mechanic: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mechanic",
          required: true,
        },

        cancelledAt: {
          type: Date,
          default: Date.now,
        },

        reassignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mechanic",
          default: null,
        },

        reassignedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    /*
     * =====================================================
     * USER CANCELLATION
     * =====================================================
     */

    cancelledBy: {
      type: String,
      enum: ["user", "mechanic"],
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

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

/*
 * User active/history queries
 */
requestSchema.index({
  user: 1,
  status: 1,
  createdAt: -1,
});

/*
 * Mechanic cancellation filtering
 */
requestSchema.index({
  "cancellationHistory.mechanic": 1,
});

/*
 * Mechanic request queries
 */
requestSchema.index({
  mechanic: 1,
  status: 1,
  createdAt: -1,
});

/*
 * Mechanic declined request filtering
 */
requestSchema.index({
  declinedMechanics: 1,
});

/*
 * Geo queries
 */
requestSchema.index({
  location: "2dsphere",
});

export default mongoose.model(
  "Request",
  requestSchema
);