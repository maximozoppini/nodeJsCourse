const { Contenedor } = require("../datos/contenedor");
const { Productos } = require("./productos.class");

class Carrito {
    constructor() {
        this.contenedor = new Contenedor("carritos.txt");
        this.productos = new Productos();
    }

    async getById(id) {
        return await this.contenedor.getById(id);
    }

    async getProductos(id) {
        return await this.getById(id).productos;
    }

    async save() {
        const carrito = await this.contenedor.save({
            timeStamp: Date.now(),
            productos: [],
        });
        return carrito;
    }

    async saveProducto(id, producto) {
        let carrito = await this.getById(id);
        if (!carrito) {
            return null;
        }

        const productoNuevo = await this.productos.getById(producto.id);
        if (!productoNuevo) {
            return null;
        }

        carrito.productos.push({
            ...productoNuevo,
            cantidad: producto.cantidad,
        });

        return await this.contenedor.update(id, carrito);
    }

    async delete(id) {
        return await this.contenedor.deleteById(id);
    }

    async deleteProducto(id, idProducto) {
        let carrito = await this.getById(id);
        if (!carrito) {
            return null;
        }

        carrito.productos = [
            ...carrito.productos.filter((dato) => dato.id !== idProducto),
        ];

        return await this.contenedor.update(id, carrito);
    }
}

module.exports = { Carrito };
