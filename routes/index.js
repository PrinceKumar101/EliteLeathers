var express = require("express");
var router = express.Router();

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");

router.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded!");
});

router.get("/uuid", (req, res) => {
  res.send(`Generated UUID: ${uuidv4()}`);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
