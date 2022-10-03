const fs = require("fs");

class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.lastId = 1;
        if (fs.existsSync(this.nombreArchivo)) {
            const data = JSON.parse(fs.readFileSync(this.nombreArchivo));
            const dataArray = Array.from(data);
            if (dataArray.length > 0) {
                let max = dataArray[0].id;
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].id > max) {
                        max = dataArray[i].id;
                    }
                }
                this.lastId = max + 1;
            }
        } else {
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
            objetoAGuardar.id = this.lastId;
            datosJson = [...datosJson, objetoAGuardar];

            //guardo en el archivo el arreglo de elementos.
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(datosJson, null, 2)
            );

            this.lastId++;
            return objetoAGuardar.id;
        } catch (error) {
            throw new Error(error);
        }
    }

    async update(id, objetoAGuardar) {
        try {
            //leo el archivo
            let datosAlmacenados = await this.getAll();
            let datosJson = Array.from(datosAlmacenados);

            if (!datosJson) {
                throw new Error("el archivo no tiene el formato valido");
            }

            //obtengo el index del objeto a reemplazar
            const index = datosJson.findIndex((x) => x.id === id);
            //si lo encuentro lo actualizo
            if (index >= 0) {
                datosJson.splice(index, 1, { ...objetoAGuardar, id });
                await fs.promises.writeFile(
                    this.nombreArchivo,
                    JSON.stringify(datosJson, null, 2)
                );
                return objetoAGuardar;
            } else {
                //caso contrario retorno null
                return null;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            const datosAlmacenados = await this.getAll();
            const datosJson = Array.from(datosAlmacenados);

            const result = datosJson.find((objeto) => objeto.id === id);

            return result ?? null;
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

    async deleteById(id) {
        try {
            let datosAlmacenados = await this.getAll();
            let datosJson = Array.from(datosAlmacenados);

            //si encuentro el objeto lo elimino
            datosJson = [...datosJson.filter((dato) => dato.id !== id)];

            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(datosJson, null, 2)
            );

            return id;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteAll() {
        try {
            this.lastId = 1;
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify([], null, 2)
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = { Contenedor };
