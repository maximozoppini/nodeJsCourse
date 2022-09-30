const express = require("express");
const { Contenedor } = require("./contenedor.js");
var index = require("./index.js");
// const cors = require("cors");

const routerProductos = express.Router();
const contenedorProductos = new Contenedor("productos.txt");

routerProductos.use(handleErrors);
// routerMensaje.use(cors());

routerProductos.get("/:id", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const producto = await contenedorProductos.getById(req.params.id);
            res.status(200).json(
                producto ?? { error: "producto no encontrado" }
            );
        } else {
            res.status(400).json({ error: "el parametro no es un numero" });
        }
    } catch (error) {
        next(error);
    }
});

routerProductos.post("/", checkUser, async (req, res, next) => {
    try {
        if (
            req.body.nombre &&
            !Number.isNaN(req.body.precio) &&
            req.body.codigo &&
            !Number.isNaN(req.body.stock)
        ) {
            const timeStamp = Date.now();
            let { nombre, descripcion, codigo, url, precio, stock } = req.body;
            const producto = await contenedorProductos.save({
                nombre,
                descripcion,
                codigo,
                url,
                precio,
                stock,
                timeStamp,
            });
            res.status(200).json(
                producto ?? { error: "no se pudo registrar el producto" }
            );
        } else {
            res.status(400).json({
                error: "no se pudo registrar el producto, verifique el objeto enviado",
            });
        }
    } catch (error) {
        next(error);
    }
});

routerProductos.put("/:id", checkUser, async (req, res, next) => {
    try {
        if (
            req.body.nombre &&
            !Number.isNaN(req.body.precio) &&
            req.body.codigo &&
            !Number.isNaN(req.body.stock)
        ) {
            let { nombre, descripcion, codigo, url, precio, stock } = req.body;
            const producto = await contenedorProductos.update(
                Number(req.params.id),
                {
                    nombre,
                    descripcion,
                    codigo,
                    url,
                    precio,
                    stock,
                }
            );
            res.status(200).json(
                producto ?? { error: "no se pudo actualizar el producto" }
            );
        } else {
            res.status(400).json({
                error: "no se pudo actualizar el producto, verifique el objeto enviado",
            });
        }
    } catch (error) {
        next(error);
    }
});

routerProductos.delete("/:id", checkUser, async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const result = await contenedorProductos.deleteById(
                Number(req.params.id)
            );
            res.status(200).json(
                result !== null
                    ? { mensaje: `se elimino el producto con el id: ${result}` }
                    : { error: "producto no encontrado" }
            );
        } else {
            res.status(400).json({
                error: "el parametro enviado no es un numero",
            });
        }
    } catch (error) {
        next(error);
    }
});

function checkUser(req, res, next) {
    if (!index.logged) {
        res.status(401).json({
            error: -1,
            descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
        });
    }
    next();
}

function handleErrors(err, req, res, next) {
    console.log(err);
    res.status(500).send("An internal server error occurred");
}

module.exports = { routerProductos };
