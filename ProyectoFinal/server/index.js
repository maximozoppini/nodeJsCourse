require("dotenv").config();

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const passport = require("passport");

require("./routes/middlewares/passport.strategies.local");
require("./routes/middlewares/passport.strategies.jwt");
require("./routes/middlewares/passport.strategies.facebook");
require("./routes/middlewares/passport.strategies.google");

const { routerProduct } = require("./routes/product.route");
const { routerProductCategory } = require("./routes/product.category.route");
const { routerCart } = require("./routes/cart.route");
const { routerUser } = require("./routes/user.route");
const { routerOrder } = require("./routes/order.route");
const { routerMessage } = require("./routes/message.route");
const { messageService } = require("./services/message.service");

//express init
const app = express();
//socket.io init en el path /chat
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, { path: "/onlineChat" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Msg service for socket
const msgService = new messageService();

//Socket io connection and events
io.on("connection", async (socket) => {
  console.log("alguien se conecto");

  //wellcome msg
  socket.emit("messages", "Welcome to Ecommerce chat!");

  //send all prev msg to new client
  socket.emit("messages", await msgService.getAll());

  //listen to new msg from clients
  socket.on("msgFromUser", async (msg) => {
    //save user msg to db
    await msgService.save({
      ...msg,
      tipo: "Usuario",
    });
    //send new msg to the rest of connected users except the current user
    socket.broadcast.emit("messages", msg);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    console.log("alguien se desconecto");
  });
});

//middlewares passport
app.use(passport.initialize());

//router para logueo
app.use(routerUser);
//router para mensajes
app.use("/chat", routerMessage);
//router para los productos
app.use("/productos", routerProduct);
//router para los productos
app.use("/categoriaProductos", routerProductCategory);

//router para el carrito
app.use(
  "/carrito",
  passport.authenticate("jwt", { session: false }),
  routerCart
);
//router para las ordenes
app.use(
  "/ordenes",
  passport.authenticate("jwt", { session: false }),
  routerOrder
);

const listener = httpServer.listen(process.env.PORT || 8080, function () {
  console.log(`Your app is listening to port: ${listener.address().port}`);
});
listener.on("error", (error) => console.log(`error en el servidor: ${error}`));
