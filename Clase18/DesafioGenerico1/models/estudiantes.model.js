const { Schema, model } = require("mongoose");

const estudiantesSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true },
  edad: { type: Number, required: true },
  nota: { type: Number, required: true },
  curso: { type: String, required: true },
});

module.exports = model("estudiantes", estudiantesSchema);
