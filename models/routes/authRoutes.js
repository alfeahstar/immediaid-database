const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../User"); // ✅ Make sure the path is correct
const router = express.Router(); // ✅ Define the router

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    console.log("Login Attempt:", emailOrUsername); // 🛠 Debugging

    // ✅ Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      console.log("User not found!"); // 🛠 Debugging
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("User Found:", user); // 🛠 Debugging

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password!"); // 🛠 Debugging
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Login Success for:", user.username); // 🛠 Debugging

    res.status(200).json({ 
      message: "Login successful!", 
      token, 
      user: { fullName: user.fullName, email: user.email, username: user.username } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Export the router
module.exports = router;
