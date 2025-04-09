const express = require("express");
const User = require("../User"); // ✅ Correct import path
const router = express.Router();

// ✅ GET LOGGED-IN USER BY ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
