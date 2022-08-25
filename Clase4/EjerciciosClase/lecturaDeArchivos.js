const fs = require("fs");

const data = fs.readFileSync("./texto.txt","utf-8");
console.log(data);

try {
    fs.writeFileSync("./textoEscrito.txt","guardado desde nodejs");
} catch (error) {
    console.log("el archivo ya existe");
} 