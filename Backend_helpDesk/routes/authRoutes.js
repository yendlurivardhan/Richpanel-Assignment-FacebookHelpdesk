const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables");
}

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, Email, and Password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "Password login not available for this user" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Protected Route
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "✅ Access granted to protected route",
    user: req.user,
  });
});

// Facebook Login Start
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "pages_show_list", "pages_messaging", "pages_read_engagement"],
  })
);

// Facebook Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    const redirectURL = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/connect`
      : "https://google.com"; // fallback redirect if FRONTEND_URL not set

    res.redirect(redirectURL);
  }
);

module.exports = router;
