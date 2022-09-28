const express = require("express");
const cors = require("cors");

const routerProducto = express.Router();
routerProducto.use(cors());
routerProducto.use(express.json());
routerProducto.use(express.urlencoded({ extended: true }));

const { ContenedorMemoria } = require("./contenedorMemoria");
const contenedor = new ContenedorMemoria();

routerProducto.post("/", (req, res) => {
    if (req.body.title && !Number.isNaN(req.body.price) && req.body.thumbnail) {
        let { title, price, thumbnail } = req.body;
        const producto = contenedor.save({
            title,
            price,
            thumbnail,
        });

        req.app.get("socketio").emit("productos", contenedor.getAll());

        res.json(producto ?? { error: "no se pudo registrar el producto" });
    } else {
        res.json({
            error: "no se pudo registrar el producto, verifique el objeto enviado",
        });
    }
});

module.exports = { routerProducto, contenedor };
