let productosInicialesArray = [
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

class ContenedorMemoria {
    constructor() {
        this.productos = productosInicialesArray;
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

    getAll() {
        try {
            return this.productos;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = { ContenedorMemoria };
