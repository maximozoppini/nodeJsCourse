const express = require("express");
const { Server: HttpServer } = require("http");

//destructuracion, sacar la variable Server y asignarla en la variable IOServer
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const mensajes = [];

app.use(express.static("public"));

const connectedServer = httpServer.listen(3001, () => {
    console.log("server ON");
});

io.on("connection", (socket) => {
    console.log("alguien se conecto");

    socket.emit("mensajes", mensajes);

    socket.on("mensaje", (data) => {
        mensajes.push({ socketId: socket.id, mensaje: data });
        console.log(
            "🚀 ~ file: server.js ~ line 24 ~ stream.on ~ mensajes",
            mensajes
        );

        io.sockets.emit("mensajes", mensajes);
    });
});
