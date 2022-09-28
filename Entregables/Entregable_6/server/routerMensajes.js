const express = require("express");
const cors = require("cors");

const routerMensaje = express.Router();
routerMensaje.use(cors());

const { ContenedorArchivo } = require("./contenedorArchivo");
const contenedorArchivo = new ContenedorArchivo("mensajes.txt");

routerMensaje.get("/", (req, res) => {
    res.send(" ");
});

module.exports = { routerMensaje, contenedorArchivo };
