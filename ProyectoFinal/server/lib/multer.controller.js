const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname.trim());
  },
});

const upload = multer({ storage });
module.exports = upload;
