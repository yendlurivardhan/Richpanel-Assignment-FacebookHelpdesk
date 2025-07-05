const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Get Facebook user's name & photo using PSID
router.get("/:psid", async (req, res) => {
  const { psid } = req.params;
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Facebook error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Facebook user profile" });
  }
});

module.exports = router;
