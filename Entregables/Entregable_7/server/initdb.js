require("dotenv").config();
const { options } = require("./connectionOptions");

options.mysql.connection.database = null;
let knex = require("knex")(options.mysql);

knex
  .raw(`CREATE DATABASE IF NOT EXISTS ${process.env.mysql_db}`)
  .then(function () {
    knex.destroy();
    options.mysql.connection.database = process.env.mysql_db;

    let knexMySql = require("knex")(options.mysql);
    generarTablas(knexMySql);
  });

generarTablas(require("knex")(options.sqlite3));

function generarTablas(knex) {
  knex.schema
    .createTable("Productos", function (table) {
      table.increments("id");
      table.string("title");
      table.double("price");
      table.string("thumbnail");
    })
    .createTable("Mensajes", function (table) {
      table.increments("id");
      table.string("email");
      table.string("mensaje");
      table.string("fecha");
    })
    .then(function () {
      console.log("tablas creadas");
      knex.destroy();
    })
    .catch((error) => {
      console.log("tablas ya creadas");
    })
    .finally(() => {
      knex.destroy();
    });
}
