require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
  sendRegEmailToAdmin,
  sendRegEmailToUser,
} = require("./lib/mail.controller");
const userFactory = require("./daos/users/user.dao.factory");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs-extra");

const MongoDBStore = require("connect-mongodb-session")(session);

const { routerProduct } = require("./rutas/routerProductos");
const { routerCart } = require("./rutas/routerCarrito");
const { routerUsuario } = require("./rutas/routerUsuario");

const userDao = userFactory(process.env.DAOTYPE);
const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStragety = require("passport-jwt").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

//router para logueo
app.use(routerUsuario);
//router para los productos
app.use("/productos", routerProduct);
//router para el carrito
app.use("/carrito", routerCart);

//passport
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
        let user = await userDao.getDocument({ username: username });
        if (user) {
          await deleteUploadImg(req);
          return done(null, false, { message: "user already exists" });
        }
        checkUserAvatar(req);
        //create user if not found
        let newUser = await userDao.save({
          username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          name: req.body.name,
          direction: req.body.direction,
          age: req.body.age,
          phone: req.body.phone,
          avatar: req.body.avatar,
        });
        if (newUser) {
          await sendRegEmailToAdmin(newUser);
          await sendRegEmailToUser(username, req.body.name);
          return done(null, newUser);
        }
      } catch (e) {
        return done(e);
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
        return done(null, false, { message: "usuario inexistente" });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { message: "contraseña incorrecta" });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

passport.use(
  "jwt",
  new JWTStragety(
    {
      secretOrKey: process.env.JWT_PK,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook",
      profileFields: ["id", "displayName", "link", "photos", "emails"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        //----- Revisando que el usuario no existe
        let user = await userDao.getDocument({
          username: profile.emails[0].value,
        });
        if (user) {
          return done(null, user);
        }
        //create user if not found
        let newUser = await userDao.save({
          username: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          social_id: profile.id,
        });
        if (newUser) {
          await sendRegEmailToAdmin(newUser);
          await sendRegEmailToUser(username, req.body.name);
          return done(null, newUser);
        }
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google",
      profileFields: ["id", "displayName", "link", "photos", "emails"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        //----- Revisando que el usuario no existe
        let user = await userDao.getDocument({
          username: profile.emails[0].value,
        });
        if (user) {
          return done(null, user);
        }
        //create user if not found
        let newUser = await userDao.save({
          username: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          social_id: profile.id,
        });
        if (newUser) {
          await sendRegEmailToAdmin(newUser);
          await sendRegEmailToUser(username, req.body.name);
          return done(null, newUser);
        }
      } catch (e) {
        return done(e);
      }
    }
  )
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

async function deleteUploadImg(req) {
  if (req.body.avatar_type != "0") {
    req.body.avatar = req.file.filename;
    await fs.remove(path.join(__dirname, "../uploads/") + req.file.filename);
  }
  return;
}

function checkUserAvatar(req) {
  if (req.body.avatar_type != "0")
    if (req.file) req.body.avatar = "./uploads/" + req.file?.filename;
    else req.body.avatar = "./uploads/default.png";
  else if (req.body.avatar == "") req.body.avatar = "./uploads/default.png";
}

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));
