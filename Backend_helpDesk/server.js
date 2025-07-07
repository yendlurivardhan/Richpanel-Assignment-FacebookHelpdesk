const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config(); // ✅ Loads .env variables

const app = express();
const PORT = process.env.PORT || 4714;

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Passport Setup
require("./config/passport"); // Must exist and export a strategy
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes")); // <-- make sure this file exists
app.use("/api/facebook", require("./routes/facebookRoutes")); // <-- make sure this file exists
app.use("/api", require("./routes/facebookWebhook")); // <-- must export /webhook route

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🎉 Facebook Helpdesk Server is Running");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
