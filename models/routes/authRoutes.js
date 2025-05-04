const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../User"); // Adjust path if needed
const router = express.Router();

// 🔐 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    console.log("🔐 Signup endpoint hit:", req.body);

    const { fullName, address, username, email, phone, password, profilePicture } = req.body;

    if (!email || !username || !password) {
      console.warn("⚠️ Missing required signup fields");
      return res.status(400).json({ message: "Email, Username, and Password are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.warn("⚠️ User already exists");
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      address,
      username,
      email,
      phone,
      password: hashedPassword,
      profilePicture
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ New user created:", newUser._id);

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login endpoint hit:", req.body.emailOrUsername);

    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      console.warn("⚠️ Login failed: User not found");
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Login failed: Incorrect password");
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login successful:", user._id);

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        phone: user.phone || "",
        address: user.address || "",
        profilePicture: user.profilePicture || null
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔐 CHANGE PASSWORD
router.post("/change-password", async (req, res) => {
  try {
    console.log("🔐 Change password endpoint hit:", req.body.userId);

    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      console.warn("⚠️ Missing required fields for password change");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn("⚠️ Change password failed: User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.warn("⚠️ Change password failed: Incorrect current password");
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password updated for user:", user._id);

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change Password Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
