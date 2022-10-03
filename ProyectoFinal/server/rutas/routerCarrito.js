const express = require("express");
const { Carrito } = require("../logica/carrito.class");
// const cors = require("cors");

const routerCarrito = express.Router();
const logicaCarrito = new Carrito();

routerCarrito.use(handleErrors);
// routerMensaje.use(cors());

routerCarrito.get("/:id/productos", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const carrito = await logicaCarrito.getById(Number(req.params.id));
            res.status(200).json(
                carrito?.productos ?? { error: "carrito no encontrado" }
            );
        } else {
            res.status(400).json({ error: "parametro incorrecto" });
        }
    } catch (error) {
        next(error);
    }
});

routerCarrito.post("/", async (req, res, next) => {
    try {
        const carrito = await logicaCarrito.save();
        res.status(200).json(
            carrito ?? { error: "no se pudo registrar el carrito" }
        );
    } catch (error) {
        next(error);
    }
});

routerCarrito.delete("/:id", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const result = await logicaCarrito.delete(Number(req.params.id));
            res.status(200).json(
                result !== null
                    ? { mensaje: `se elimino el carrito con el id: ${result}` }
                    : { error: "carrito no encontrado" }
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

routerCarrito.post("/:id/productos", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id)) {
            const result = await logicaCarrito.saveProducto(
                Number(req.params.id),
                req.body
            );
            res.status(200).json(
                result !== null
                    ? {
                          mensaje: `se agrego al carrito con el id: ${result.id}, el producto: ${req.body.id}`,
                      }
                    : { error: "carrito o producto no encontrado" }
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

routerCarrito.delete("/:id/productos/:id_prod", async (req, res, next) => {
    try {
        if (!Number.isNaN(req.params.id) && !Number.isNaN(req.params.id_prod)) {
            const result = await logicaCarrito.deleteProducto(
                Number(req.params.id),
                Number(req.params.id_prod)
            );
            res.status(200).json(
                result !== null
                    ? {
                          mensaje: `se elimino del carrito con el id: ${result.id} el producto`,
                      }
                    : { error: "carrito o producto no encontrado" }
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

function handleErrors(err, req, res, next) {
    console.log(err);
    res.status(500).send("An internal server error occurred");
}

module.exports = { routerCarrito };
