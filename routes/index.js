var express = require("express");
var router = express.Router();

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const userModel = require("../models/users");
const productModel = require("../models/products");
const sellerModel = require("../models/seller");

const {registerUser, loginUser, logout, change_password,forgot_password } = require("../controller/authController");

const {isLoggedIn, checkLogin} = require("../middleware/isLoggedIn");
const products = require("../models/products");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

/* GET home page. */
router.get("/", async function (req, res, next) {
  try{
    const products = await productModel.find();
  const user = await userModel.findOne({email : req?.user?.email});
  const if_logged_in =await checkLogin(req);
  res.render("index",{products, user, message : req.flash('message'), sucess_message : req.flash('sucess_message'), if_logged_in });
  }
  catch(err){
    res.send(err.message);

  }
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({email : req.user.email})
  .populate("products").populate("cart");
  const if_logged_in =await checkLogin(req);
  
  res.render('profile', {user, message: req.flash('message'), sucess_message: req.flash('sucess_message'), if_logged_in}); 
});

router.get("/edit-profile",isLoggedIn, async function(req, res ,next){
  try {
    const user = await userModel.findOne({email : req.user.email});
  const if_logged_in = await checkLogin(req);
  res.render("edit-profile.ejs", {user, if_logged_in});
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/edit-profile", isLoggedIn, async function(req,res, nex){
  try {
    const user = await userModel.findOne({ email: req.user.email });
    let { username, email_id, contact_number, address } = req.body;
    const updated_data = { username, email_id, contact_number, address };
    for (let key in updated_data) {
      if (updated_data[key].length > 3) {
        if (updated_data[key] && updated_data[key] !== user[key]) {
          user[key] = updated_data[key];
        }
      }
    }
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/change-password", isLoggedIn, change_password);

router.get("/forgot-password", async function (req, res, next) {
  try {
    const if_logged_in = await checkLogin(req);
    res.render("forgotPassword", { if_logged_in });
  } catch (err) {
    res.send(err.message);
  }
});
router.post("/reset-password",forgot_password);

router.get("/set-new-password?:token", function(req,res,next){
  const token = req.query.token;
  res.render("reset-token",{token});
});

router.post("/set-new-password", async function (req, res, next) {
  try {
    const { token, password, confirm_password } = req.body;

    if (!token || !password || !confirm_password) {
      return res.status(400).send("All fields are required");
    }

    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }

    const user = await userModel.findOne({ token: token });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.token = ''; // Clear the token after successful password reset
    await user.save();

    res.status(200).send("Password updated successfully");

  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get("/signup", async function (req, res, next) {
  const if_logged_in =await checkLogin(req);
  res.render("signup", {if_logged_in});
});
router.post("/signup", registerUser);

router.get("/login", async function (req, res, next) {
  const if_logged_in =await checkLogin(req);
  res.render("login", {if_logged_in});
});

router.post("/login", loginUser);

router.get("/logout", logout);

router.post("/upl-profile-picture", isLoggedIn,upload.single("upl-img"),async function(req,res, next){
  const user = await userModel.findOne({email: req.user.email});
  user.profile_picture = req.file.buffer;
  await user.save();
    res.redirect("/profile");

});

router.get("/delete-profile-picture", isLoggedIn,async function(req,res, next){
  try {
    const user = await userModel.findOne({ email: req.user.email });
    user.profile_picture = "";

    await user.save();
    req.flash("message" , "Sucessfully removed")
    res.redirect("/profile", );
  } catch (error) {
    
    res.redirect("/edit-profile",{ message: req.flash(error.message)} );
  }

});

router.get("/add-product",isLoggedIn, async function(req, res, next){
  const if_logged_in =await checkLogin(req);
  res.render("addProduct", {if_logged_in});
});

router.post("/add-product", isLoggedIn, upload.single("image"), async function(req, res, next){
  try {
    const user = await userModel.findOne({ email: req.user.email });

    if (user && user.seller) {
      let product = await productModel.create({
        user: user._id,
        image: req.file.buffer,
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        description: req.body.description,
        quantity: req.body.quantity,
      });

      user.products.push(product._id);
      await user.save();
      req.flash("message", "Product added");

      res.redirect("/profile");
    } else {
      res.send("Not a seller");
    }
  } catch (err) {
    res.send(err.message);
  }
  
  
});

router.get("/become-seller",isLoggedIn, function(req, res, next){
  res.render("seller.ejs")
});

router.post("/become-seller", isLoggedIn, async function(req, res, next) {
  try {
      const user = await userModel.findOne({ email: req.user.email });

      if (user) {
          let newSeller = await sellerModel.create({
              name: req.body.name,
              bankAccount: req.body.bankAccount,
              gstNumber: req.body.gstNumber,
              aadharNumber: req.body.aadharNumber,
              panCard: req.body.panCard,
              user: req.user._id,
          });

          await newSeller.save();

          user.seller = true;
          await user.save();

          req.flash("sucess_message", "Congrats on becoming a merchant");
      } else {
          req.flash("message", "User not found");
      }

      res.redirect("/profile");
  } catch (err) {
      console.error(err);
      req.flash("message", "Something went wrong");
      res.status(500).redirect("/profile");
  }
});

router.get("/add-to-cart/:product_id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const productId = req.params.product_id;


    user.cart.push(productId);
    await user.save();
    req.flash("sucess_message", "Added successfully");
    res.redirect("/");
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/show/cart", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({email : req.user.email})
  .populate("cart");
  const if_logged_in =await checkLogin(req);
  res.render("cart",{user, if_logged_in});

});


router.get("/show/products", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({email : req.user.email})
  .populate("products");
  const if_logged_in =await checkLogin(req);
  res.render("showProducts",{user, if_logged_in});

});


router.get("/cart/remove/:itemId", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ email: req.user.email })
    .populate("cart");
    
    const productIdToRemove = req.params.itemId; 
    if (!productIdToRemove) {
      return res.status(400).send("Invalid product ID");
    }

    user.cart = user.cart.pull({_id:productIdToRemove});
    await user.save();


    res.redirect("/show/cart");
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).send("Failed to remove product from cart");
  }
});

router.get("/products/remove/:itemId", isLoggedIn,async function(req, res, next){
  try{
    const user = await userModel.findOne({email: req.user.email})
    .populate("products");
    const products = await productModel.find({user : req.user._id});

    let productIdToRemove = req.params.itemId;
    if(!productIdToRemove){
      return res.send("Invalid product Id to remove");
    }
    await productModel.findByIdAndDelete(productIdToRemove);
    await user.products.pull({_id : productIdToRemove});

    await user.save();

    res.redirect("/show/products");


  }
  catch(err){
    res.send(err.message);

  }
})







  





module.exports = router;
