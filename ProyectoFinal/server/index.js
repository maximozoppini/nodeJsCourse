const express = require("express");
const cors = require("cors");
const { routerProductos } = require("./routerProductos");

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
    console.log(module);
    res.send("hola, server ONLINE " + userLogged);
});
app.post("/login", (req, res) => {
    module.exports.logged = true;
    res.status(200).json("user logged in");
});
//router para los productos
app.use("/productos", routerProductos);
//router para el carrito
// app.use("/carrito", routerProducto);

module.exports.logged = userLogged;
