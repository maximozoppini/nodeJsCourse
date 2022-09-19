const express = require("express");
const { routerProducto } = require("./routeProductos");
const handlebars = require("express-handlebars");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");

const PORT = 8080;
const listener = app.listen(PORT, function () {
    console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));

//recurso estatico
app.use(express.static("public"));
//root de la app
app.get("/", (req, res) => {
    res.send("hola, server ONLINE");
});
//router para los productos
app.use("/api/productos", routerProducto);
