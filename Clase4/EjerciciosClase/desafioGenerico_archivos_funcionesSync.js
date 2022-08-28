const fs = require("fs");

try {
    fs.unlinkSync("./archivos/fyh.txt");
} catch (error) {
    console.log("no se pudo eliminar el archivo");
}

let fechaHora = new Date();
console.log(`se va a guardar: ${fechaHora.toString()}`);

try {
    //guardamos archivo
    fs.writeFileSync("./archivos/fyh.txt",fechaHora.toString(),"utf-8");
    //leemos el archivo creado
    let data = fs.readFileSync("./archivos/fyh.txt","utf-8");
    console.log(data);
} catch (error) {
    console.log(error);
}

