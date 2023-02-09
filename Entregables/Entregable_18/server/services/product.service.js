const productFactory = require("../daos/products/product.dao.factory");

require("dotenv").config();

class ProductService {
  constructor() {
    this.dao = productFactory(process.env.DAOTYPE);
  }

  async save(product) {
    let newProd = await this.dao.save(product);
    return newProd;
  }

  async getDocument(filter) {
    return await this.dao.getDocument(filter);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async update(id, prod) {
    return await this.dao.update(id, prod);
  }

  async deleteById(id) {
    return await this.dao.deleteById(id);
  }

  async deleteAll() {
    return await this.dao.deleteAll();
  }
}

module.exports = { ProductService };
