const { FirebaseContainer } = require("../../containers/firebaseContainer");

class ProductFirebaseDAO extends FirebaseContainer {
  constructor(collection) {
    super(collection);
  }

  async getAll() {
    let docs = await super.getAll();
    if (docs) {
      return docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        descripcion: doc.data().descripcion,
        codigo: doc.data().codigo,
        url: doc.data().url,
        precio: doc.data().precio,
        stock: doc.data().stock,
        timeStamp: doc.data().timeStamp,
      }));
    }
    return null;
  }

  async save(prod) {
    const timeStamp = Date.now();
    let newProd = await super.save({
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
    try {
      const timeStamp = Date.now();
      let doc = await super.update(id);
      if (doc) {
        return await doc.update({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          codigo: prod.codigo,
          url: prod.url,
          precio: prod.precio,
          stock: prod.stock,
          timeStamp,
        });
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = { ProductFirebaseDAO };
