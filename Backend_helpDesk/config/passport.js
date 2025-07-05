const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
require("dotenv").config();
const accessToken = process.env.PAGE_ACCESS_TOKEN;
console.log("✅ passport-facebook strategy loaded");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
      enableProof: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Facebook Strategy Triggered");
        console.log("📘 accessToken:", accessToken);
        console.log("👤 Facebook Profile:", profile);
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            facebookId: profile.id,
          });
        }

        // ✅ Attach token to req for frontend redirect
        req.accessToken = accessToken;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
