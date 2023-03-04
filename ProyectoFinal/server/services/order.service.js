const orderFactory = require("../daos/orders/order.dao.factory");
const { BaseService } = require("./base.service");

class orderService extends BaseService {
  constructor() {
    super(orderFactory(process.env.DAOTYPE));
  }
}

module.exports = { orderService };
