const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const productModel = require("../../models/product.model");

class ProductMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, productModel);
    this.model = productModel;
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
        categoria: prod.categoria,
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
      categoria: prod.categoria,
      timeStamp,
    });
    return newProd;
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new ProductMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { ProductMongoDAO };
