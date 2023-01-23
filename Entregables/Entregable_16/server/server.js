const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { routerProcess } = require("./routes/routerProcess");
const { routerSession } = require("./routes/user.router");

const MongoDBStore = require("connect-mongodb-session")(session);
const defaultLogger = require("./config/logger");
const yargs = require("yargs");
const { passport } = require("./routes/middelwares/passport.strategies");
const app = express();

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
