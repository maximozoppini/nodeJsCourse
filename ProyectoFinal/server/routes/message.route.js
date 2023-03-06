const express = require("express");
const routerMessage = express.Router();
const messageController = require("../controllers/message.controller");

routerMessage.get("/", messageController.chat);
routerMessage.get("/:email/", messageController.chatUser);

module.exports = { routerMessage };
