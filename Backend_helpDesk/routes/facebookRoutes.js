// ✅ routes/facebookRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// ✅ Send a Facebook message by PSID
router.post("/messages", async (req, res) => {
  const { sender, receiver, content } = req.body;

  if (!receiver || !content) {
    return res.status(400).json({ message: "Missing receiver or content" });
  }

  try {
    const fbRes = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: receiver },
        message: { text: content },
      }
    );

    return res.status(200).json({ success: true, data: fbRes.data });
  } catch (error) {
    console.error(
      "❌ Error sending Facebook message:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "Facebook message failed", error: error.message });
  }
});

// ✅ Get user profile by PSID
router.get("/user-profile/:psid", async (req, res) => {
  const { psid } = req.params;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${psid}`,
      {
        params: {
          fields: "first_name,last_name,profile_pic",
          access_token: PAGE_ACCESS_TOKEN,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "❌ Error fetching user profile:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
});

// ✅ Get conversation messages by PSID
router.get("/conversations/:psid", async (req, res) => {
  const { psid } = req.params;

  try {
    const convRes = await axios.get(
      `https://graph.facebook.com/v23.0/me/conversations`,
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
      }
    );

    const allConversations = convRes.data.data;
    let matchedConversation = null;

    for (const convo of allConversations) {
      const participantsRes = await axios.get(
        `https://graph.facebook.com/v23.0/${convo.id}/participants`,
        { params: { access_token: PAGE_ACCESS_TOKEN } }
      );

      const participants = participantsRes.data.data;
      const user = participants.find((p) => p.id === psid);

      if (user) {
        matchedConversation = convo.id;
        break;
      }
    }

    if (!matchedConversation) {
      return res
        .status(404)
        .json({ message: "No conversation found for this PSID" });
    }

    const msgRes = await axios.get(
      `https://graph.facebook.com/v23.0/${matchedConversation}/messages`,
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );

    res.status(200).json({ messages: msgRes.data.data });
  } catch (error) {
    console.error(
      "❌ Error fetching messages:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
});

module.exports = router;
