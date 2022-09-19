const fs = require("fs");
let productosArray = [
    {
        title: "Escuadra",
        price: 123.45,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: 1,
    },
    {
        title: "Calculadora",
        price: 234.56,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        id: 2,
    },
    {
        title: "Globo Terráqueo",
        price: 345.67,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        id: 3,
    },
];

class Contenedor {
    constructor() {
        this.productos = productosArray;
        this.lastId = 1;
        if (this.productos.length > 0) {
            let max = this.productos[0].id;
            for (let i = 0; i < this.productos.length; i++) {
                if (this.productos[i].id > max) {
                    max = this.productos[i].id;
                }
            }
            this.lastId = max + 1;
        }
    }

    save(objetoAGuardar) {
        try {
            //obtengo los productos
            let datosAlmacenados = this.getAll();
            //asigno prox id
            objetoAGuardar.id = this.lastId;
            //agrego el producto al arreglo
            datosAlmacenados = [...datosAlmacenados, objetoAGuardar];

            //guardo en memoria el mismo
            this.productos = datosAlmacenados;
            //incremento el contador de id´s
            this.lastId++;

            return objetoAGuardar;
        } catch (error) {
            throw new Error(error);
        }
    }

    update(id, objetoAGuardar) {
        try {
            //obtengo los productos
            let datosAlmacenados = this.getAll();
            //obtengo el index del objeto a reemplazar
            const index = datosAlmacenados.findIndex((x) => x.id === id);
            //si lo encuentro lo actualizo
            if (index >= 0) {
                datosAlmacenados.splice(index, 1, { ...objetoAGuardar, id });
                this.productos = datosAlmacenados;
                return objetoAGuardar;
            } else {
                //caso contrario retorno null
                return null;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    getById(id) {
        try {
            let datosAlmacenados = this.getAll();
            const result = datosAlmacenados.find((objeto) => objeto.id == id);
            return result ?? null;
        } catch (error) {
            throw new Error(error);
        }
    }

    getAll() {
        try {
            return this.productos;
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteById(id) {
        try {
            //obtengo los productos
            let datosAlmacenados = this.getAll();
            //obtengo el index del objeto a eliminar
            const index = datosAlmacenados.findIndex((x) => x.id === id);
            //si lo encuentro lo actualizo
            if (index >= 0) {
                this.productos = [
                    ...datosAlmacenados.filter((dato) => dato.id !== id),
                ];
                return id;
            } else {
                return null;
            }
            //si encuentro el objeto lo elimino
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = { Contenedor };
