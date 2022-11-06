const express = require("express");
const routerTest = express.Router();
const { faker } = require("@faker-js/faker");

routerTest.get("/", (req, res) => {
  let response = [];
  for (let index = 0; index <= 5; index++) {
    response.push({
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: faker.image.abstract(300, 300, true),
    });
  }
  res.json(response);
});

module.exports = { routerTest };
