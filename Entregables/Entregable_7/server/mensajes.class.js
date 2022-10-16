const { ContenedorBd } = require("./contenedorBd");
const { options } = require("./connectionOptions");

class Mensajes {
  constructor() {
    this.bd = new ContenedorBd("Mensajes", options.sqlite3);
  }

  async getAll() {
    return await this.bd.getAll();
  }

  async save(mensaje) {
    return await this.bd.save(mensaje);
  }
}

module.exports = { Mensajes };
