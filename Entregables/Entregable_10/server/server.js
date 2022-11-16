const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const MongoDBStore = require("connect-mongodb-session")(session);
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { routerSession } = require("./routes/routerSession");
const { ProductMongoDAO } = require("./daos/products/productMongo.dao");
const { MessageMongoDAO } = require("./daos/messages/messageMongo.dao");
const productModel = require("./models/product.model");
const messageModel = require("./models/message.model");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:4200",
  },
});
const productosDao = new ProductMongoDAO(process.env.MONGODBURL, productModel);
const mensajesDao = new MessageMongoDAO(process.env.MONGODBURL, messageModel);

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.CONNECTION_MONGODB_SECRET,
    name: "session-id",
    store: new MongoDBStore({
      uri: process.env.MONGODBURL,
      collection: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
    resave: true,
    saveUninitialized: false,
  })
);

//router para test
//app.use("/api/productos-test", routerTest);
//router para session
app.use("/api", routerSession);

app.set("socketio", io);
io.on("connection", async (socket) => {
  console.log("alguien se conecto");

  socket.emit("productos", await productosDao.getAll());
  socket.on("producto", async (data) => {
    await productosDao.save(data);
    io.sockets.emit("productos", await productosDao.getAll());
  });

  socket.emit("mensajes", await mensajesDao.getAll());
  socket.on("mensaje", async (data) => {
    await mensajesDao.save(data);
    io.sockets.emit("mensajes", await mensajesDao.getAll());
  });
});

const connectedServer = httpServer.listen(process.env.PORT || 8081, () => {
  console.log(
    `server conectado en el puerto: ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) => console.log(error));
