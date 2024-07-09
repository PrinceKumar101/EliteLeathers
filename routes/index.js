var express = require("express");
var router = express.Router();

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const userModel = require("../models/users");

const {registerUser, loginUser, logout} = require("../controller/authController");
router.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded!");
});
const {isLoggedIn} = require("../middleware/isLoggedIn");

router.get("/uuid", (req, res) => {
  res.send(`Generated UUID: ${uuidv4()}`);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get('/profile', isLoggedIn, async (req, res) => {
  // Render the profile page or handle the profile logic
  res.render('profile'); // Ensure you have a 'profile.ejs' or appropriate view template
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});
router.post("/signup", registerUser);



router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/login", loginUser);





router.get("/logout", logout);


module.exports = router;
