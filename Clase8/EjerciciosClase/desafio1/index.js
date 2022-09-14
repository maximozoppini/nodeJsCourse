const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log("hola router");
});

app.use("/prefijoVirtual", express.static("public"));

const mascotas = [
    {
        nombre: "gato",
        edad: 2,
    },
    {
        nombre: "perro",
        edad: 4,
    },
];
const personas = [
    {
        nombre: "maxi",
        edad: 33,
    },
    {
        nombre: "sol",
        edad: 35,
    },
];

const routerPersonas = express.Router();
const routerMascotas = express.Router();

//antes se hacia asi
//app.get("/personas", () => {});

//ahora indico que MIDDELWERE va a administrar la ruta. Como en anglar.
app.use("/personas", routerPersonas);
app.use("/mascotas", routerMascotas);

//configuro todas las rutas para este router y que deberia hacer cada una.
routerPersonas.get("/", (req, res) => {
    res.json(personas);
});

routerMascotas.get("/", (req, res) => {
    res.json(mascotas);
});
