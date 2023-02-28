require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

const passport = require("passport");
require("./routes/middlewares/passport.strategies.local");
require("./routes/middlewares/passport.strategies.jwt");
require("./routes/middlewares/passport.strategies.facebook");
require("./routes/middlewares/passport.strategies.google");

// const { routerProduct } = require("./routes/routerProduct");
// const { routerCart } = require("./routes/routerCart");
const { routerUser } = require("./routes/user.route");

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
app.use(routerUser);
//router para los productos
// app.use("/productos", routerProduct);
// //router para el carrito
// app.use("/carrito", routerCart);

// var cookieExtractor = function (req) {
//   var token = null;
//   if (req && req.cookies) token = req.cookies["auth"];
//   console.log("🚀 ~ file: index.js:132 ~ cookieExtractor ~ token:", token);

//   return token;
// };

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));
