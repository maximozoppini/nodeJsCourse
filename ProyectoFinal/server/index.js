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

const { routerProduct } = require("./routes/product.route");
const { routerCart } = require("./routes/cart.route");
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
app.use("/productos", routerProduct);

//router para el carrito
//TODO: VER SI PUEDO AGREGAR EL MIDDELWARE DE JWT PARA VALIDAR TODA LA RUTA
app.use("/carrito", routerCart);

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));
