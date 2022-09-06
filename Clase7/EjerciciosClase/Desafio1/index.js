const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8081;
const server = app.listen(port, () => {
    console.log("servidor OK");
});

const frase = "hola mundo como estan";

app.get("/api/frase", (req, res) => {
    res.send(frase);
});
app.get("/api/frase/:indice", (req, res) => {
    if (!Number.isNaN(req.params.indice)) {
        const letra = frase.charAt(req.params.indice);
        letra
            ? res.send(letra)
            : res.json({ error: "el parametro esta fuera de rango" });
    } else {
        res.json({ error: "el parametro no es un numero" });
    }
});

app.get("/api/palabras/:indice", (req, res) => {
    if (!Number.isNaN(req.params.indice)) {
        const frases = frase.split(" ");

        const result = frases[req.params.indice];
        result
            ? res.send(result)
            : res.json({ error: "el parametro esta fuera de rango" });
    } else {
        res.json({ error: "el parametro no es un numero" });
    }
});

app.get("/api/sumar/:sumando1/:sumando2", (req, res) => {
    res.json({
        result: `el resultado de la suma es: ${
            parseInt(req.params.sumando1) + parseInt(req.params.sumando2)
        }`,
    });
});

app.get("/api/sumar", (req, res) => {
    res.json({
        result: `el resultado de la suma es: ${
            parseInt(req.query.sumando1) + parseInt(req.query.sumando2)
        }`,
    });
});

app.post("/api", (req, res) => {
    res.json({ ok: req.method });
});

app.put("/api", (req, res) => {
    res.json({ ok: req.method });
});

app.delete("/api", (req, res) => {
    res.json({ ok: req.method });
});
