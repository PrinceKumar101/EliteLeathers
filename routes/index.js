var express = require("express");
var router = express.Router();

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const userModel = require("../models/users");
const productModel = require("../models/products");
const sellerModel = require("../models/seller");

const {registerUser, loginUser, logout} = require("../controller/authController");

const {isLoggedIn} = require("../middleware/isLoggedIn");
const products = require("../models/products");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try{
    const products = await productModel.find();
  const user = await userModel.findOne({email : req?.user?.email});
  res.render("index",{products, user, message : req.flash('message'), sucess_message : req.flash('sucess_message')});
  }
  catch(err){
    res.send(err.message);

  }
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({email : req.user.email})
  .populate("products").populate("cart");
  
  res.render('profile', {user, message: req.flash('message')}); 
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

router.post("/upl-profile-picture", isLoggedIn,upload.single("upl-img"),async function(req,res, next){
  const user = await userModel.findOne({email: req.user.email});
  user.profile_picture = req.file.buffer;
  await user.save();
    res.redirect("/profile");

})

router.get("/add-product",isLoggedIn, function(req, res, next){
  res.render("addProduct");
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

router.post("/become-seller",isLoggedIn, async function(req, res, next){
    try {
    const user = await userModel.findOne({ email: req.user.email });

        
        // Create new seller record
        let newSeller = await sellerModel.create({
            name:req.body.name,
            bankAccount:req.body.bankAccount,
            gstNumber:req.body.gstNumber,
            aadharNumber: req.body.aadharNumber,
            panCard: req.body.panCard,
            user: req.user._id,
        });
        await newSeller.save();

        user.seller = true;
        await user.save();

        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting seller application');
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
  res.render("cart",{user});

});


router.get("/show/products", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({email : req.user.email})
  .populate("products");
  res.render("showProducts",{user});

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
