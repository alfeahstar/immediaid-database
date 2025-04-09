require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // ✅ Initialize `app` first
app.use(express.json());
app.use(cors());

// ✅ Import routes AFTER initializing `app`
const userRoutes = require("./models/routes/userRoutes");
const authRoutes = require("./models/routes/authRoutes");

// ✅ Use the routes
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);

// 🔗 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // ✅ Start the server ONLY if MongoDB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// 🔎 Basic API Route
app.get("/", (req, res) => {
  res.send("🚀 Disaster Management API is Running!");
});
