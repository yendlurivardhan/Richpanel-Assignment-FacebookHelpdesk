require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4714;

// ✅ CORS Configuration
const allowedOrigins = "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB Connection + Session
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.use(
      session({
        secret: process.env.SESSION_SECRET || "defaultSecret123",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
      })
    );

    // ✅ Routes
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/auth", require("./routes/facebookAuth"));
    app.use("/api", require("./routes/facebookWebhook")); // /webhook
    app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/messages", require("./routes/messageRoutes"));
    app.use("/api", require("./routes/protectedRoutes")); // optional

    // ✅ Health Check
    app.get("/", (req, res) => {
      res.send("Hello from Facebook Helpdesk backend!");
    });

    // ✅ Start Server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
