const { FileSystemContainer } = require("../../containers/FileSystemContainer");

class ProductFileSystemDAO extends FileSystemContainer {
  constructor(fileName) {
    super(fileName + ".txt");
  }

  async save(prod) {
    const timeStamp = Date.now();
    const newProd = await super.save({
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

module.exports = { ProductFileSystemDAO };
