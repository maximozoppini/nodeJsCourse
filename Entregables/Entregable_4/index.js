const express = require("express");
const { routerProducto } = require("./routeProductos");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const listener = app.listen(PORT, function () {
    console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));

//recurso estatico
app.use("/public", express.static("public"));
//root de la app
app.get("/", (req, res) => {
    res.send("hola, server ONLINE");
});
//router para los productos
app.use("/api/productos", routerProducto);
