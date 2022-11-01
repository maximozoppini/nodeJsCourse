const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { routerProduct } = require("./rutas/routerProductos");
const { routerCart } = require("./rutas/routerCarrito");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));

var userLogged = false;

//root de la app
app.get("/", (req, res) => {
  res.status(200).json({ msg: "proyecto final zoppini" });
});
app.post("/login", (req, res) => {
  module.exports.logged = true;
  res.status(200).json({ msg: "user logged in" });
});

//router para los productos
app.use("/productos", routerProduct);
//router para el carrito
app.use("/carrito", routerCart);

module.exports.logged = userLogged;
