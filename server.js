require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());  // This will allow us to handle JSON bodies
app.use(cors());  // Enable cross-origin resource sharing (for mobile or different domains)

// Routes
const userRoutes = require("./models/routes/userRoutes");
const authRoutes = require("./models/routes/authRoutes");

// Use the routes
app.use("/users", userRoutes);  // Handle user-related routes
app.use("/api/auth", authRoutes);  // Handle auth-related routes

// Optional: debug log to check Mongo URI (ensure it doesn't leak sensitive data in production)
console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;  // Use a custom port or default to 5000
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);  // Display error message
  });

// Basic Route for checking server health
app.get("/", (req, res) => {
  res.send("🚀 Disaster Management API is Running!");
});
