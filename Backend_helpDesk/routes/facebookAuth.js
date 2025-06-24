const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");
const PageConnection = require("../models/PageConnection");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

// 🔹 Step 1: Facebook OAuth Redirect
router.get("/auth/facebook",
  passport.authenticate("facebook", {
    scope: [
      "public_profile",
      "email",
      "pages_show_list",
      "pages_messaging",
      "pages_manage_metadata",
      "pages_read_engagement"
    ],
  })
);

// 🔹 Step 2: OAuth Callback
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// 🔹 Step 3: Login with Graph API (Optional)
router.post("/facebook-login", async (req, res) => {
  const { id, name, email } = req.body;

  try {
    let user = await User.findOne({ facebookId: id });

    if (!user) {
      user = await User.create({
        facebookId: id,
        name,
        email,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// 🔹 Step 4: Exchange Token & Save Pages
router.post("/facebook/exchange-token", authMiddleware, async (req, res) => {
  const { accessToken } = req.body;
  const userId = req.user.userId;

  try {
    const fbRes = await axios.get(`https://graph.facebook.com/me/accounts`, {
      params: { access_token: accessToken },
    });

    const pages = fbRes.data.data;
    const savedPages = [];

    for (const page of pages) {
      const exists = await PageConnection.findOne({ pageId: page.id, user: userId });

      if (!exists) {
        const newPage = await PageConnection.create({
          user: userId,
          pageId: page.id,
          pageName: page.name,
          pageAccessToken: page.access_token,
        });

        savedPages.push(newPage);

        // Subscribe this page to app
        await axios.post(
          `https://graph.facebook.com/v19.0/${page.id}/subscribed_apps`,
          {},
          { params: { access_token: page.access_token } }
        );
      }
    }

    res.status(200).json({ message: "Pages saved", pages: savedPages });
  } catch (err) {
    console.error("Token exchange error", err.response?.data || err.message);
    res.status(500).json({ message: "Error connecting page", error: err.message });
  }
});

// 🔹 Step 5: Get all pages connected to this user
router.get("/pages", authMiddleware, async (req, res) => {
  try {
    const pages = await PageConnection.find({ user: req.user.userId });
    res.status(200).json({ pages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pages", error: err.message });
  }
});

module.exports = router;
