const bcrypt = require("bcrypt");
const passport = require("passport");
const path = require("path");
const fs = require("fs-extra");

const defaultLogger = require("../../config/logger.config");

const {
  sendRegEmailToAdmin,
  sendRegEmailToUser,
} = require("../../lib/mail.controller");

const { UserService } = require("../../services/user.service");

const LocalStrategy = require("passport-local").Strategy;
// const JWTStragety = require("passport-jwt").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userService = new UserService();

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "username",
      passwordField: "password",
    },
    async (req, username, password, done) => {
      try {
        //----- Revisando que el usuario no existe
        let user = await userService.getDocument({ username: username });
        if (user) {
          await deleteUploadImg(req);
          if (user.provider != "Local")
            return done(null, false, {
              message:
                "Email is alredy registered with " +
                user.provider +
                " account. Please login with that provider.",
            });
          return done(null, false, { message: "user already exists" });
        }
        checkUserAvatar(req);
        //create user if not found
        let newUser = await userService.save({
          username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          name: req.body.name,
          direction: req.body.direction,
          age: req.body.age,
          phone: req.body.phone,
          avatar: req.body.avatar,
          provider: "Local",
        });

        if (newUser) {
          defaultLogger.info("registracion existosa");
          await sendRegEmailToAdmin(newUser);
          await sendRegEmailToUser(newUser);
          return done(null, newUser);
        }
      } catch (e) {
        defaultLogger.error("error en la registracion");
        return done(e);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userService.getDocument({ username });
      if (!user) {
        defaultLogger.warn("usuario inexistente");
        return done(null, false, { message: "user do not exist" });
      }
      if (!isValidPassword(user, password)) {
        defaultLogger.warn("constraseña incorrecta");
        return done(null, false, { message: "incorrect password" });
      }
      defaultLogger.info("logueo exitoso");
      return done(null, user);
    } catch (e) {
      defaultLogger.error("error en el logueo");
      return done(e);
    }
  })
);

//serializar y deserializar
passport.serializeUser((user, done) => {
  done(null, user?._id);
});
passport.deserializeUser(async (id, done) => {
  let user = await userService.getById(id);
  done(null, user);
});

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

async function deleteUploadImg(req) {
  if (req.body.avatar_type != "0") {
    req.body.avatar = req.file.filename;
    await fs.remove(
      path.join(__dirname, "./public/uploads/") + req.file.filename
    );
  }
  return;
}

function checkUserAvatar(req) {
  if (req.body.avatar_type != "0")
    if (req.file) req.body.avatar = "/uploads/" + req.file?.filename;
    else req.body.avatar = "/uploads/default.png";
  else if (req.body.avatar == "") req.body.avatar = "/uploads/default.png";
}
