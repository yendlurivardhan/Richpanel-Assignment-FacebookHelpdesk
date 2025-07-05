require("dotenv").config();
require("./config/passport");

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const facebookRoutes = require("./routes/facebookRoutes");
const userRoutes = require("./routes/userRoutes"); // Facebook PSID route

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/facebook", facebookRoutes);
app.use("/api/users", userRoutes);

// ✅ Facebook Webhook Route — this logs PSID from user messages
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach(entry => {
      const messagingEvent = entry.messaging[0];
      const psid = messagingEvent.sender.id;

      console.log("✅ PSID received:", psid);
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✅ MongoDB & Start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
