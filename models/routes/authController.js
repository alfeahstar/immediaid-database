const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../User"); // ✅ Make sure this path is correct

// ✅ Signup Function
const registerUser = async (req, res) => {
  try {
    const { fullName, address, username, email, phone, password, profilePicture } = req.body;

    // 🔍 Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // 🔐 Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🆕 Create New User
    const newUser = new User({
      fullName,
      address,
      username,
      email,
      phone,
      password: hashedPassword,
      profilePicture,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("🔥 Signup Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Login Function
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // 🔍 Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // 🔐 Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // 🎟️ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ 
      message: "Login successful!", 
      token, 
      user: { fullName: user.fullName, email: user.email, username: user.username } 
    });

  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🏁 Export the functions
module.exports = { registerUser, loginUser };
