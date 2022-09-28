const fs = require("fs");

class ContenedorArchivo {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        if (!fs.existsSync(this.nombreArchivo)) {
            fs.writeFileSync(this.nombreArchivo, JSON.stringify([], null, 2));
        }
    }

    async save(objetoAGuardar) {
        try {
            //leo el archivo
            let datosAlmacenados = await this.getAll();
            let datosJson = Array.from(datosAlmacenados);

            if (!datosJson) {
                throw new Error("el archivo no tiene el formato valido");
            }
            datosJson = [...datosJson, objetoAGuardar];

            //guardo en el archivo el arreglo de elementos.
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(datosJson, null, 2)
            );
            return objetoAGuardar;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAll() {
        try {
            let datosAlmacenados = await fs.promises.readFile(
                this.nombreArchivo
            );
            if (!datosAlmacenados) {
                return null;
            }
            return JSON.parse(datosAlmacenados);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify([], null, 2)
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = { ContenedorArchivo };
