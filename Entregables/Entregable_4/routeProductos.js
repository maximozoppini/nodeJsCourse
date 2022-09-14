const express = require("express");
const routerProducto = express.Router();
const { Contenedor } = require("./contenedor");

const contenedor = new Contenedor();

routerProducto.get("/", async (req, res) => {
    const productos = await contenedor.getAll();
    res.json(productos);
});

routerProducto.get("/:id", async (req, res) => {
    if (!Number.isNaN(req.params.id)) {
        const producto = await contenedor.getById(req.params.id);
        res.json(producto ?? { error: "producto no encontrado" });
    } else {
        res.json({ error: "el parametro no es un numero" });
    }
});

routerProducto.post("/", async (req, res) => {
    if (req.body.title && !Number.isNaN(req.body.price) && req.body.thumbnail) {
        let { title, price, thumbnail } = req.body;
        const producto = await contenedor.save({
            title,
            price,
            thumbnail,
        });
        res.json(producto ?? { error: "no se pudo registrar el producto" });
    } else {
        res.json({
            error: "no se pudo registrar el producto, verifique el objeto enviado",
        });
    }
});

routerProducto.put("/:id", async (req, res) => {
    if (
        !Number.isNaN(req.params.id) &&
        req.body.title &&
        !Number.isNaN(req.body.price) &&
        req.body.thumbnail
    ) {
        let { title, price, thumbnail } = req.body;
        const producto = await contenedor.update(Number(req.params.id), {
            title,
            price,
            thumbnail,
        });
        res.json(producto ?? { error: "producto no encontrado" });
    } else {
        res.json({
            error: "no se pudo registrar el producto, verifique el objeto enviado",
        });
    }
});

routerProducto.delete("/:id", async (req, res) => {
    if (!Number.isNaN(req.params.id)) {
        const result = await contenedor.deleteById(Number(req.params.id));
        res.json(
            result !== null
                ? { mensaje: `se elimino el producto con el id: ${result}` }
                : { error: "producto no encontrado" }
        );
    } else {
        res.json({ error: "el parametro enviado no es un numero" });
    }
});

module.exports = { routerProducto };
