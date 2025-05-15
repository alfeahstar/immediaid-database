const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema({
  message: String,
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  timestamp: String,
  details: String,
  resolved: { type: Boolean, default: false }, // New field to track resolution
});

const SOSAlert = mongoose.model("SOSAlert", sosAlertSchema);

module.exports = SOSAlert;
