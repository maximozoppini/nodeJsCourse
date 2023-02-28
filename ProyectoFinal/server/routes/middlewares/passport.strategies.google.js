const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { UserService } = require("../../services/user.service");
const userService = new UserService();
const {
  sendRegEmailToAdmin,
  sendRegEmailToUser,
} = require("../../lib/mail.controller");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.DOMAIN_NAME + "/auth/google",
      profileFields: ["id", "displayName", "link", "photos", "emails"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Check if the fb profile has an email associated.
        if (!profile.emails || !profile.emails[0]) {
          return done(null, false, {
            message:
              "Google Account is not registered with email. Please sign in using other methods",
          });
        }

        // Check if email exist in DB
        let user = await userService.getDocument({
          username: profile.emails[0].value,
        });
        if (user) {
          if (user.provider != "Google")
            return done(null, false, {
              message:
                "Email is alredy registered with " +
                user.provider +
                " account. Please login with that provider.",
            });

          return done(null, user);
        }

        // Create user if not found
        let newUser = await userService.save({
          username: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          social_id: profile.id,
          provider: "Google",
        });
        if (newUser) {
          await sendRegEmailToAdmin(newUser);
          await sendRegEmailToUser(newUser);
          return done(null, newUser);
        }
      } catch (e) {
        return done(e);
      }
    }
  )
);
