const productFactory = require("../daos/product/product.dao.factory");
const { BaseService } = require("./base.service");

class ProductService extends BaseService {
  constructor() {
    super(productFactory(process.env.DAOTYPE));
  }
}

module.exports = { ProductService };
