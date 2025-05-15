const express = require("express");
const router = express.Router();
const SOSAlert = require("../SosAlert"); // Correct import

// GET all SOS alerts
router.get("/", async (req, res) => {
    try {
      const alerts = await SOSAlert.find({ resolved: false }).sort({ timestamp: -1 });
      res.json(alerts);
    } catch (error) {
      console.error("❌ Error fetching SOS alerts:", error);
      res.status(500).json({ error: "Failed to fetch SOS alerts." });
    }
  });

// POST a new SOS alert
router.post("/", async (req, res) => {
  const { message, timestamp, name, address, latitude, longitude, details } = req.body;

  console.log("📩 Incoming SOS:", req.body); // Debugging log

  try {
    const newSosAlert = new SOSAlert({
      message,
      timestamp,
      name,
      address,
      latitude,
      longitude,
      details,
    });

    await newSosAlert.save();

    res.status(201).json({ message: "🆘 SOS alert sent successfully!", sosAlert: newSosAlert });
  } catch (error) {
    console.error("❌ Error sending SOS:", error);
    res.status(500).json({ error: "Failed to send SOS alert." });
  }
});

// PATCH request to mark an SOS alert as resolved
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const alert = await SOSAlert.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "❗SOS alert not found." });
    }

    res.status(200).json({ message: "✅ SOS alert resolved successfully.", alert });
  } catch (error) {
    console.error("❌ Error resolving SOS alert:", error);
    res.status(500).json({ message: "Failed to resolve SOS alert." });
  }
});

module.exports = router;
