const { ContenedorBd } = require("./contenedorBd");
const { options } = require("./connectionOptions");

class Productos {
  constructor() {
    this.bd = new ContenedorBd("Productos", options.mysql);
  }

  async getAll() {
    return await this.bd.getAll();
  }

  async save(producto) {
    return await this.bd.save(producto);
  }
}

module.exports = { Productos };
