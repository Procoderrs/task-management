import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🟢 Signup route
router.post("/signup", async (req, res) => {
      console.log("🟢 Incoming signup data:", req.body); // 👈 add this line

  try {
    const { name, email, password } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    if(err.name==='validationError'){
      return res.status(400).json({message:err.message})
    }
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// 🟢 Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

export default router;
