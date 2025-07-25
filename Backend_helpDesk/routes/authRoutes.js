const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, Email, and Password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login request body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("🔍 User from DB:", user);

    if (!user) {
      console.log("❌ No user found for:", email);
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", match);

    if (!match) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 Login Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

// ✅ Facebook OAuth Step 1
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: [
      "email",
      "public_profile",
      "pages_show_list",
      "pages_read_engagement",
      "pages_messaging",
    ],
  })
);

// ✅ Facebook OAuth Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      console.log("✅ Facebook callback triggered");

      const user = req.user;
      const accessToken = req.accessToken;

      console.log("👤 Facebook user:", user);
      console.log("📘 accessToken from req:", accessToken);

      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const redirectUrl = `${process.env.FRONTEND_URL}/connect?token=${jwtToken}&access_token=${accessToken}`;
      console.log("🔁 Redirecting to:", redirectUrl);

      res.redirect(redirectUrl);
    } catch (err) {
      console.error("❌ Error in Facebook callback:", err.message);
      res.redirect(`${process.env.FRONTEND_URL}/connect?error=callback_failed`);
    }
  }
);

module.exports = router;
