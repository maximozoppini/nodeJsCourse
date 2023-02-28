const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { UserService } = require("../../services/user.service");
const userService = new UserService();
const {
  sendRegEmailToAdmin,
  sendRegEmailToUser,
} = require("../../lib/mail.controller");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.DOMAIN_NAME + "/auth/facebook",
      profileFields: ["id", "displayName", "link", "photos", "emails"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Check if the fb profile has an email associated.
        if (!profile.emails || !profile.emails[0]) {
          return done(null, false, {
            message:
              "Facebook Account is not registered with email. Please sign in using other methods",
          });
        }

        // Check if email exist in DB
        let user = await userService.getDocument({
          username: profile.emails[0].value,
        });
        // Return user if exists
        if (user) {
          if (user.provider != "Facebook")
            return done(null, false, {
              message:
                "Email is alredy registered with " +
                user.provider +
                " account. Please login with that provider.",
            });

          return done(null, user);
        }

        //create user if not found
        let newUser = await userService.save({
          username: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          social_id: profile.id,
          provider: "Facebook",
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
