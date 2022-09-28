const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const cors = require("cors");

const { routerMensaje, contenedorArchivo } = require("./routerMensajes");
const { routerProducto, contenedor } = require("./routerProductos");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
// const io = new IOServer(httpServer, {
//     cors: {
//         origin: "http://localhost:4200",
//     },
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/mensajes", routerMensaje);
app.use("/api/productos", routerProducto);

app.set("socketio", io);
io.on("connection", async (socket) => {
    console.log("alguien se conecto");
    let mensajes = await contenedorArchivo.getAll();

    socket.emit("productos", contenedor.getAll());
    socket.on("producto", (data) => {
        contenedor.save(data);
        io.sockets.emit("productos", contenedor.getAll());
    });

    socket.emit("mensajes", mensajes);
    socket.on("mensaje", async (data) => {
        const fecha = new Date();
        await contenedorArchivo.save({
            ...data,
            fecha: fecha.toLocaleString("es-AR"),
        });
        let mensajes = await contenedorArchivo.getAll();
        io.sockets.emit("mensajes", mensajes);
    });
});

const connectedServer = httpServer.listen(process.env.PORT || 8080, () => {
    console.log(
        `server conectado en el puerto: ${connectedServer.address().port}`
    );
});
connectedServer.on("error", (error) => console.log(error));
