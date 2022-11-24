const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

require("dotenv").config();

const MongoDBStore = require("connect-mongodb-session")(session);
const { Server: HttpServer } = require("http");
// const { Server: IOServer } = require("socket.io");
const { routerSession } = require("./routes/routerSession");

// const { ProductMongoDAO } = require("./daos/products/productMongo.dao");
// const { MessageMongoDAO } = require("./daos/messages/messageMongo.dao");
const { UserMongoDAO } = require("./daos/users/userMongo.dao");
// const productModel = require("./models/product.model");
// const messageModel = require("./models/message.model");
const userModel = require("./models/user.model");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer, {
//   cors: {
//     origin: "http://localhost:4200",
//   },
// });

// const productosDao = new ProductMongoDAO(process.env.MONGODBURL, productModel);
// const mensajesDao = new MessageMongoDAO(process.env.MONGODBURL, messageModel);
const userDao = new UserMongoDAO(process.env.MONGODBURL, userModel);

app.use(
  cors({
    origin: "http://localhost:4200",
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

//router para session
app.use(routerSession);

//passport
passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        //----- Revisando que el usuario no existe
        let user = await userDao.getDocument({ username: username });
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        //create user if not found
        let newUser = await userDao.save({
          username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        });

        if (newUser) {
          return done(null, newUser);
        }
      } catch (e) {
        return done(e, null);
      }
    }
  )
);
passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userDao.getDocument({ username });
      if (!user) {
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (e) {
      return done(e, null);
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

// app.set("socketio", io);
// io.on("connection", async (socket) => {
//   console.log("alguien se conecto");

//   socket.emit("productos", await productosDao.getAll());
//   socket.on("producto", async (data) => {
//     await productosDao.save(data);
//     io.sockets.emit("productos", await productosDao.getAll());
//   });

//   socket.emit("mensajes", await mensajesDao.getAll());
//   socket.on("mensaje", async (data) => {
//     await mensajesDao.save(data);
//     io.sockets.emit("mensajes", await mensajesDao.getAll());
//   });
// });

const connectedServer = httpServer.listen(process.env.PORT || 8081, () => {
  console.log(
    `server conectado en el puerto: ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) => console.log(error));
