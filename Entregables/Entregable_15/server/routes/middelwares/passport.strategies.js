const bcrypt = require("bcrypt");
const passport = require("passport");
const defaultLogger = require("../../config/logger");
const { UserService } = require("../../services/user.service");
const LocalStrategy = require("passport-local").Strategy;

const userService = new UserService();

//passport
passport.use(
  "register",
  new LocalStrategy(async (username, password, done) => {
    try {
      //----- Revisando que el usuario no existe
      let user = await userService.getDocument({ username: username });
      if (user) {
        return done(null, false, { message: "user already exists" });
      }
      //create user if not found
      let newUser = await userService.save({
        username,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
      });

      if (newUser) {
        defaultLogger.info("registracion existosa");
        return done(null, newUser);
      }
    } catch (e) {
      defaultLogger.error("error en la registracion");
      return done(e);
    }
  })
);
passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userService.getDocument({ username });
      if (!user) {
        defaultLogger.warn("usuario inexistente");
        return done(null, false, { message: "usuario inexistente" });
      }
      if (!isValidPassword(user, password)) {
        defaultLogger.warn("constraseña incorrecta");
        return done(null, false, { message: "contraseña incorrecta" });
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

module.exports = { passport };
