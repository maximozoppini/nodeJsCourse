const bcrypt = require("bcrypt");
const passport = require("passport");
const defaultLogger = require("../../config/logger");
const LocalStrategy = require("passport-local").Strategy;

const { UserMongoDAO } = require("../../daos/users/userMongo.dao");
const userModel = require("../../models/user.model");
const userDao = new UserMongoDAO(process.env.MONGODBURL, userModel);

//passport
passport.use(
  "register",
  new LocalStrategy(async (username, password, done) => {
    try {
      //----- Revisando que el usuario no existe
      let user = await userDao.getDocument({ username: username });
      if (user) {
        return done(null, false, { message: "user already exists" });
      }
      //create user if not found
      let newUser = await userDao.save({
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
      let user = await userDao.getDocument({ username });
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
  let user = await userDao.getById(id);
  done(null, user);
});

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = { passport };
