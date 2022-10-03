const express = require("express");
const { Productos } = require("../logica/productos.class");
var index = require("../index");
// const cors = require("cors");

const routerProductos = express.Router();
const logicaProductos = new Productos();

routerProductos.use(handleErrors);
// routerMensaje.use(cors());

routerProductos.get("/", async (req, res, next) => {
    try {
        const productos = await logicaProductos.getAll();
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
});

routerProductos.get("/:id", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const producto = await logicaProductos.getById(
                Number(req.params.id)
            );
            res.status(200).json(
                producto ?? { error: "producto no encontrado" }
            );
        } else {
            res.status(400).json({ error: "parametro incorrecto" });
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
            const producto = await logicaProductos.save(req.body);
            console.log(producto);
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
            const producto = await logicaProductos.update(
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
            const result = await logicaProductos.delete(Number(req.params.id));
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
