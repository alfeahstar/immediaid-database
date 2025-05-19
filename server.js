require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require("./models/routes/userRoutes");
const authRoutes = require("./models/routes/authRoutes");
const sosRoutes = require("./models/routes/sosRoutes"); // Import SOS route
const newsRoutes = require("./models/routes/news");

// Use the routes
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/news", newsRoutes); // Register SOS API endpoint

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Disaster Management API is Running!");
});
