const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const productModel = require("../../models/product.model");

class ProductMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async save(prod) {
    const timeStamp = Date.now();
    let newProd = await super.save(
      new productModel({
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        codigo: prod.codigo,
        url: prod.url,
        precio: prod.precio,
        stock: prod.stock,
        timeStamp,
      })
    );
    return newProd;
  }

  async update(id, prod) {
    const timeStamp = Date.now();
    const newProd = await super.update(id, {
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      codigo: prod.codigo,
      url: prod.url,
      precio: prod.precio,
      stock: prod.stock,
      timeStamp,
    });
    return newProd;
  }
}

module.exports = { ProductMongoDAO };
