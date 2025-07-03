const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, Email, and Password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    if (!user.password) {
      return res.status(401).json({ message: "Password login not available for this user" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get current user (from JWT)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// Protected route (for testing)
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "✅ Access granted to protected route",
    user: req.user,
  });
});

// Facebook Login - Step 1
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "pages_show_list", "pages_messaging", "pages_read_engagement"],
  })
);

// Facebook Callback - Step 2
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    if (!req.user || !req.user._id) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=NoUserId`);
    }

    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const redirectURL = `${process.env.FRONTEND_URL}/connect?token=${token}`;
    res.redirect(redirectURL);
  }
);

module.exports = router;
