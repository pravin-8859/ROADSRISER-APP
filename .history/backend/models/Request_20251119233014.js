import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: { type: String }, coordinates: [Number] }, // GeoJSON [lng, lat]
  address: String,
  serviceType: String,
  status: { type: String, default: "pending" }, // pending, accepted, enroute, completed, cancelled
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", default: null },
  fare: Number,
  createdAt: { type: Date, default: Date.now }
});

requestSchema.index({ location: "2dsphere" });

export default mongoose.model("Request", requestSchema);
