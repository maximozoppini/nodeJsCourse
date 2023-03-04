const productCategoryFactory = require("../daos/productCategory/productCategory.dao.factory");
const { BaseService } = require("./base.service");

class ProductCategoryService extends BaseService {
  constructor() {
    super(productCategoryFactory(process.env.DAOTYPE));
  }
}

module.exports = { ProductCategoryService };
