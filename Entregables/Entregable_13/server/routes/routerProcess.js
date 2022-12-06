const express = require("express");
const { fork } = require("child_process");

const forked = fork("./child.js");
const routerProcess = express.Router();

routerProcess.get("/info", (req, res) => {
  const info = [
    {
      pid: process.pid,
      version: process.version,
      id: process.id,
      memoria: process.memoryUsage().rss,
      sistemaOperativo: process.platform,
      carpeta: process.cwd(),
      path: process.argv[0],
    },
  ];
  if (info) {
    res.status(200).json(info);
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

routerProcess.get("/api/randoms", (req, res) => {
  const random = req.query.cant || 100000000;
  forked.send(random);
  forked.on("message", (msg) => {
    res.end(msg);
  });
});

module.exports = { routerProcess };
