require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4714;

// ✅ Enable CORS before any other middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-vercel-frontend.vercel.app"],
    credentials: true,
  })
);

// ✅ Parse incoming JSON requests
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    app.use(
      session({
        secret: process.env.SESSION_SECRET || "defaultSecret123",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
      })
    );

    // Sample route
    app.get("/", (req, res) => {
      res.send("Hello from Facebook Helpdesk backend!");
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
