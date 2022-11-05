const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { Productos } = require("./productos.class");
const { Mensajes } = require("./mensajes.class");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:4200",
  },
});
const productos = new Productos();
const mensajes = new Mensajes();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("socketio", io);
io.on("connection", async (socket) => {
  console.log("alguien se conecto");

  socket.emit("productos", await productos.getAll());
  socket.on("producto", async (data) => {
    await productos.save(data);
    io.sockets.emit("productos", await productos.getAll());
  });

  socket.emit("mensajes", await mensajes.getAll());
  socket.on("mensaje", async (data) => {
    const fecha = new Date();
    await mensajes.save({
      ...data,
      fecha: fecha.toLocaleString("es-AR"),
    });
    io.sockets.emit("mensajes", await mensajes.getAll());
  });
});

const connectedServer = httpServer.listen(process.env.PORT || 8081, () => {
  console.log(
    `server conectado en el puerto: ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) => console.log(error));
