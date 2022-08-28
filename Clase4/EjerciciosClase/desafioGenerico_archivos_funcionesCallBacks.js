const fs = require("fs");
fs.readFile("./package.json","utf-8",(error, data) => {
    if(error)
    {
        console.log(`No se pudo leer el archivo, error: ${error}`);
        throw new Error(error);
    }
    else{
        const info = {
            contenidoStr: data,
            contenidoObj: JSON.parse(data),
        };
        info.size = fs.statSync("./package.json").size;
        console.log(info);
        
        fs.writeFile("info.txt", JSON.stringify(info,null,2), error => {
            if(error)
            {
                console.log(`No se pudo escribir el archivo, error: ${error}`);
                throw new Error(error);
            }
            else{
                console.log("exito!");
            }
        });
    }
});