const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("multer destination", file);
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    console.log("multer filename", file);
    callback(null, Date.now() + "-" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
