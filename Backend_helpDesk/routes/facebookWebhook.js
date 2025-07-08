const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "MyFBverify123";

// In-memory PSID store (for demo purposes)
let psidList = [];

// ✅ GET: Webhook Verification
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  res.sendStatus(403);
});

// ✅ POST: Incoming Messages
router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const messagingEvent = entry.messaging[0];

      const senderPsid = messagingEvent.sender.id;
      const message = messagingEvent.message?.text;

      console.log("📩 Message from PSID:", senderPsid);
      console.log("📝 Message:", message);

      // Store PSID (you can save to DB here)
      if (!psidList.includes(senderPsid)) {
        psidList.push(senderPsid);
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✅ GET: Get known PSIDs
router.get("/facebook/psids", (req, res) => {
  res.status(200).json({ psids: psidList });
});

module.exports = router;
