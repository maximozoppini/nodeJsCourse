const productFactory = require("../daos/product/product.dao.factory");
const { BaseService } = require("./base.service");

class ProductService extends BaseService {
  constructor() {
    super(productFactory(process.env.DAOTYPE));
  }

  // async save(product) {
  //   let newProd = await this.dao.save(product);
  //   return newProd;
  // }

  // async getDocument(filter) {
  //   return await this.dao.getDocument(filter);
  // }

  // async getById(id) {
  //   return await this.dao.getById(id);
  // }

  // async getAll() {
  //   return await this.dao.getAll();
  // }

  // async update(id, prod) {
  //   return await this.dao.update(id, prod);
  // }

  // async deleteById(id) {
  //   return await this.dao.deleteById(id);
  // }

  // async deleteAll() {
  //   return await this.dao.deleteAll();
  // }
}

module.exports = { ProductService };
