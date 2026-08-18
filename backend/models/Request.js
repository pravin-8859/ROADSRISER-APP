import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    address: {
      type: String,
      default: "",
    },

    vehicleType: {
      type: String,
      default: "",
    },

    problem: {
      type: String,
      default: "",
    },

    serviceType: {
      type: String,
      default: "",
    },

    description: {
      type: String,
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
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    fare: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index({
  location: "2dsphere",
});

export default mongoose.model("Request", requestSchema);