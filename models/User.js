const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // ✅ Now unique
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String }, // ✅ Optional profile picture
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
