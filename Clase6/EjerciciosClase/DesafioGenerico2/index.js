const express = require("express");
const { Contenedor } = require("./contenedor");

//inicializo mi APP
const app = express();
let contador = 0;

app.get('/',(req, res) => {
    let contenedor = new Contenedor("productos.txt");
    res.send("primera llamada GET con express");
});
app.get('/hola',(req, res) => {
    res.send("primera llamada GET a una ruta distinta con express")
});
app.get('/wellcome',(req, res) => {
    res.send(`<h1 style="color:blue;">Bienvenidos al servidor express</h1>`)
});
app.get('/visitas',(req, res) => {
    res.send(`la cantidad de visitas a este enpoint es de: ${contador++}`);
});
app.get('/fyh',(req, res) => {
    res.send(`fyh: ${new Date().toLocaleString()}`);
});
const PORT = 8082;
const server = app.listen(PORT, () => {
    console.log(`el server esta escuchando en: ${server.address().port}`);
});

server.on("error", error => console.log(`error en el servidor: ${error}`));