
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import express from "express";
const router = express.Router();

router.post("/register", async (req, res) => {
 try {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
   return res.status(400).json({ message: "All fields are required." });
  }

  // 🔒 If trying to register as admin → check if admin already exists
  if (role === "admin") {
   const adminCount = await User.countDocuments({ role: "admin" });

   if (adminCount >= 1) {
    return res.status(403).json({
     message: "Admin already exists. Only one admin allowed."
    });
   }
  }

  // ✅ Hash password
  const hash = await bcrypt.hash(password, 10);

  // ✅ Create user
  const user = await User.create({
   name,
   email,
   password: hash,
   role
  });

  res.json({ message: "Registered successfully" });

 } catch (err) {
  console.error("Register Error:", err);
  res.status(500).json({ message: "Server error" });
 }
});

router.post("/login", async (req, res) => {
 try {
  const { email, password } = req.body;
  if (!email || !password) {
   return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });

  // ✅ Check if user exists
  if (!user) {
   return res.status(400).json({ message: "User not found. Please register." });
  }

  // ✅ Compare password safely
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
   return res.status(400).json({ message: "Invalid password." });
  }

  // ✅ Generate token
  const token = jwt.sign(
   { id: user._id, role: user.role },
   process.env.JWT_SECRET || "secret",
   { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });

 } catch (err) {
  console.error("Login Error:", err);
  res.status(500).json({ message: "Server error" });
 }
});
export default router;