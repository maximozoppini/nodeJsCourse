require("dotenv").config();

const express = require("express");
const cors = require("cors");
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
const { routerProduct } = require("./rutas/routerProductos");
const { routerCart } = require("./rutas/routerCarrito");
const { routerUsuario } = require("./rutas/routerUsuario");

const userDao = userFactory(process.env.DAOTYPE);
const passport = require("passport");
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

//middlewares passport
app.use(passport.initialize());

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
        let newUser = await userDao.save({
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
passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userDao.getDocument({ username });
      if (!user) {
        return done(null, false, { message: "user do not exist" });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { message: "incorrect password" });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

// var cookieExtractor = function (req) {
//   var token = null;
//   if (req && req.cookies) token = req.cookies["auth"];
//   console.log("🚀 ~ file: index.js:132 ~ cookieExtractor ~ token:", token);

//   return token;
// };

passport.use(
  "jwt",
  new JWTStragety(
    {
      secretOrKey: process.env.JWT_PK,
      // jwtFromRequest: cookieExtractor,
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
        let user = await userDao.getDocument({
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
        let newUser = await userDao.save({
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
        let user = await userDao.getDocument({
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
        let newUser = await userDao.save({
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

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));
