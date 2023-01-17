const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const bcrypt = require("bcrypt");
const yargs = require("yargs");

const MongoDBStore = require("connect-mongodb-session")(session);
const { routerProcess } = require("./routes/routerProcess");
const { routerSession } = require("./routes/routerSession");
const { UserMongoDAO } = require("./daos/users/userMongo.dao");
const userModel = require("./models/user.model");
const defaultLogger = require("./logger");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const userDao = new UserMongoDAO(process.env.MONGODBURL, userModel);

app.use(
  cors({
    origin: [
      "http://localhost:7979",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:8083",
      "http://localhost:8084",
      "http://localhost:8085",
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.CONNECTION_MONGODB_SECRET,
    name: "session-id",
    store: new MongoDBStore({
      uri: process.env.MONGODBURL,
      collection: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
    resave: true,
    saveUninitialized: false,
  })
);

//middlewares passport
app.use(passport.initialize());
app.use(passport.session());

//router para session y process
app.use(routerSession);
app.use(routerProcess);

//middelware para loguear toda consulta
app.use((req, res, next) => {
  defaultLogger.info(`Ruta: ${req.url}, metodo: ${req.method}`);
  next();
});
app.use("*", (req, res) => {
  defaultLogger.warn("Ruta incorrecta: " + req.url);
  defaultLogger.info("Ruta incorrecta: " + req.url);
  res.send("ruta incorrecta");
});

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

/*
  - escucha de parametros con yargs
*/
const args = yargs(process.argv.slice(2))
  .alias({
    m: "modo",
    p: "puerto",
    d: "debug",
  })
  .default({
    modo: "prod",
    puerto: 8080,
    debug: false,
  }).argv;

const connectedServer = app.listen(args.p, () => {
  console.log(
    `server conectado en el puerto: ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) => console.log(error));
