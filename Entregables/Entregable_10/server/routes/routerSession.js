const express = require("express");
const { faker } = require("@faker-js/faker");

const routerSession = express.Router();

routerSession.get("/productos-test", (req, res) => {
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

routerSession.get("/login", (req, res) => {
  const username = req.session?.username;
  console.log(username);
  if (username) {
    res.status(200).json({
      username: req.session.username,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Algo salio mal al traer info de user",
    });
  }
});

routerSession.post("/login", (req, res) => {
  const { username } = req.body;
  try {
    req.session.username = username;
    res.status(200).json({
      status: "success",
      message: "Inicio de sesion correctamente",
      id: req.session.id,
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Algo salio mal al hacer login" });
  }
});

routerSession.get("/logout", async (req, res) => {
  try {
    await req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).json({
      status: "success",
      message: "Session cerrada",
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Algo salio mal al hacer logout" });
  }
});

module.exports = { routerSession };
