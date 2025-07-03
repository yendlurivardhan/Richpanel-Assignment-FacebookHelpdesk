const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
console.log("✅ passport-facebook strategy loaded");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "no-email";

        // ✅ Try finding by Facebook ID first
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          // ✅ If not found by Facebook ID, try by email
          user = await User.findOne({ email });

          if (user) {
            // ✅ If user exists, just link Facebook ID to existing user
            user.facebookId = profile.id;
            await user.save();
          } else {
            // ✅ Else create new user
            user = await User.create({
              facebookId: profile.id,
              name: profile.displayName,
              email,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
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
