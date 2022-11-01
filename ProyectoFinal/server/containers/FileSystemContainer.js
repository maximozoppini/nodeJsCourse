const fs = require("fs");

class FileSystemContainer {
  constructor(fileName) {
    this.fileName = fileName;
    this.lastId = 1;
    if (fs.existsSync(this.fileName)) {
      const rawData = JSON.parse(fs.readFileSync(this.fileName));
      const dataArray = Array.from(rawData);
      if (dataArray.length > 0) {
        let max = dataArray[0].id;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].id > max) {
            max = dataArray[i].id;
          }
        }
        this.lastId = max + 1;
      }
    } else {
      fs.writeFileSync(this.fileName, JSON.stringify([], null, 2));
    }
  }

  async save(newObj) {
    try {
      let storedData = await this.getAll();
      let jsonArray = Array.from(storedData);

      if (!jsonArray) {
        throw new Error("el archivo no tiene el formato valido");
      }
      newObj.id = this.lastId;
      jsonArray = [...jsonArray, newObj];

      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(jsonArray, null, 2)
      );

      this.lastId++;
      return newObj.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, newObj) {
    try {
      //leo el archivo
      let storedData = await this.getAll();
      let jsonArray = Array.from(storedData);

      if (!jsonArray) {
        throw new Error("el archivo no tiene el formato valido");
      }

      //obtengo el index del objeto a reemplazar
      const index = jsonArray.findIndex((x) => x.id === id);
      //si lo encuentro lo actualizo
      if (index >= 0) {
        jsonArray.splice(index, 1, { ...newObj, id });
        await fs.promises.writeFile(
          this.fileName,
          JSON.stringify(jsonArray, null, 2)
        );
        return newObj;
      } else {
        //caso contrario retorno null
        return null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      let storedData = await this.getAll();
      let jsonArray = Array.from(storedData);

      const result = jsonArray.find((obj) => obj.id === id);

      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      let storedData = await fs.promises.readFile(this.fileName);
      if (!storedData) {
        return null;
      }
      return JSON.parse(storedData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      let storedData = await this.getAll();
      let jsonArray = Array.from(storedData);

      //si encuentro el objeto lo elimino
      jsonArray = [...jsonArray.filter((obj) => obj.id !== id)];

      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(jsonArray, null, 2)
      );

      return id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      this.lastId = 1;
      await fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2));
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { FileSystemContainer };
