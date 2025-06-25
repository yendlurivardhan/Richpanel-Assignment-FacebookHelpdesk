const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4714;

// Middleware
app.use(cors());
app.use(express.json());

// Session setup for Passport (used during Facebook OAuth if needed)
app.use(
  session({
    secret: "secret-session-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const facebookAuthRoutes = require("./routes/facebookAuth");
const webhookRoutes = require("./routes/facebookWebhook");

app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", messageRoutes);
app.use("/api", userRoutes);
app.use("/api", facebookAuthRoutes);
app.use("/api", webhookRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Facebook Helpdesk Backend is running!");
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
