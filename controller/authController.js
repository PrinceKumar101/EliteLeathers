var express = require("express");
var router = express.Router();
const flash = require("connect-flash");

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require('../utils/token_generator');

module.exports.registerUser =  ( async function (req, res, next) {
    try{
     let {
       fullname,
       email_id,
       contact_number,
       gender,
       password,
       date_of_birth,
     } = req.body;

     const user = await userModel.findOne({
      email_id : email_id
     });
     if(user) return res.send("user already exits, please login");
   
     bcrypt.genSalt(10, function(err, salt) {
       bcrypt.hash(password, salt, async function(err, hash) {
           // Store hash in your password DB.
           if(err){
             return res.send(err.message);
           }
           else{
             const user =  await userModel.create({
               fullname,
               password: hash,
               email_id,
               contact_number,
               gender,
               date_of_birth,
             });
             let token = generateToken(user);
             res.cookie("token", token);
             res.redirect("/profile")
   
           }
       });
   });
     
    } catch(err){
     console.log(err.message);
    }
   });

   module.exports.loginUser = async function (req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email_id: email });
  
      if (!user) {
        console.log("User not found");
        req.flash('message', 'user not found');
        return res.redirect("/");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        req.flash("message", "Login succesfull")
        return res.redirect('/profile');
      } else {
        req.flash("message", "Invalid email or password");
        return res.redirect("/");
        
      }
    } catch (err) {
      console.error("Error during login:", err);
      next(err);
    }
  };

  module.exports.logout = function (req, res, next) {
    // Clear the 'token' cookie by setting it to an empty value and an expiration date in the past
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    
    // Redirect the user to the homepage
    res.redirect("/");
  };
  
