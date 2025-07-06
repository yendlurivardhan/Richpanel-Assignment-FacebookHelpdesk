const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
require("dotenv").config();

console.log("✅ passport-facebook strategy loaded");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email", "name"], // Ensure 'name' is included
      enableProof: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Facebook Strategy Triggered");
        console.log("📘 Access Token:", accessToken);
        console.log("👤 Facebook Profile:", profile);
        console.log("📛 Name:", profile.name);
        console.log("🧑 DisplayName:", profile.displayName);
        console.log("📧 Emails:", profile.emails);
        console.log("🖼️ Photos:", profile.photos);

        // Construct name fallback if displayName is missing
        const fullName =
          profile.displayName ||
          `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim();

        // Find or create user
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = await User.create({
            name: fullName,
            email: profile.emails?.[0]?.value || null,
            facebookId: profile.id,
          });
          console.log("🆕 New user created:", user);
        } else {
          console.log("👤 Existing user found:", user);
        }

        // Attach token to req for frontend redirect
        req.accessToken = accessToken;

        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Facebook Strategy:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
