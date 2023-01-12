const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
