const firebase = require("firebase-admin");
//const config_file = require(process.env.FIREBASE_CONFIG_FILE);

class FirebaseContainer {
  constructor(collection) {
    this.collectionName = collection;
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert({
          projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
          private_key: process.env.FIREBASE_CONFIG_PRIVATE_KEY,
          client_email: process.env.FIREBASE_CONFIG_CLIENT_EMAIL,
        }),
      });
    }
    this.db = firebase.firestore();
    this.collection = this.db.collection(collection);
  }

  async save(newModel) {
    try {
      return await this.collection.doc().create(newModel);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id) {
    try {
      return this.collection.doc(`${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      let result = await this.collection.doc(`${id}`);
      let item = await result.get();
      if (item) {
        return { id: item.id, ...item.data() };
      }
      return null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      let result = await (await this.collection.get()).docs;
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const doc = this.collection.doc(`${id}`);
      return await doc.delete();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      this.db.recursiveDelete(this.db.collection(this.collectionName));
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { FirebaseContainer };
