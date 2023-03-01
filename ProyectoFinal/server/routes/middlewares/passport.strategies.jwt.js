const passport = require("passport");
const JWTStragety = require("passport-jwt").Strategy;

passport.use(
  "jwt",
  new JWTStragety(
    {
      secretOrKey: process.env.JWT_PK,
      jwtFromRequest: (req) => req.cookies.auth,
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);
