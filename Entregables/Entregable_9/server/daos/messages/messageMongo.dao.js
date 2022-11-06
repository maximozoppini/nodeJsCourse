const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const messageModel = require("../../models/message.model");
const { normalize, schema } = require("normalizr");
const util = require("util");

class MessageMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async save(msg) {
    const timeStamp = Date.now();
    let newMsg = await super.save(
      new messageModel({
        author: {
          email: msg.email,
          alias: msg.alias,
          apellido: msg.apellido,
          avatar: msg.avatar,
          edad: msg.edad,
          nombre: msg.nombre,
        },
        timeStamp: timeStamp,
        text: msg.mensaje,
      })
    );
    return newMsg;
  }

  async getAll() {
    let messages = { messages: await super.getAll() };

    //console.log("info de mongo", util.inspect(messages, false, Infinity));
    const authorSchemaNmlz = new schema.Entity(
      "authors",
      {},
      { idAttribute: "email" }
    );
    const messageSchemaNmlz = new schema.Entity("message", {
      author: authorSchemaNmlz,
    });
    const messagesSchemaNmlz = { messages: [messageSchemaNmlz] };
    const normalizado = normalize(messages, messagesSchemaNmlz);

    //console.log(util.inspect(normalizado, false, 5));
    return normalizado;
  }
}

module.exports = { MessageMongoDAO };
