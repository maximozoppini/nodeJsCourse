const { Contenedor } = require("./contenedor");
const express = require("express");

const app = express();
const contenedor = new Contenedor("productos.txt");

app.get('/',(req, res) => {
    res.send("primera llamada GET con express")
});
app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll();
    res.send(productos);
});

app.get('/productoRandom', async (req, res) => {
    const productos = await contenedor.getAll();
    if(productos.length == 0){
      res.send("no hay productos");
      return;
    }
    const productosCount = productos.length;
    res.send(productos[(Math.floor(Math.random() * productosCount) + 1)-1]);
});

const listener = app.listen(8080, function() {
  console.log("Your app is listening on PUERTO " + listener.address().port);
});
