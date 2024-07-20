var express = require("express");
var router = express.Router();
const flash = require("connect-flash");

const upload = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken, resetToken} = require('../utils/token_generator');
const { checkLogin } = require("../middleware/isLoggedIn");
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");
const { token } = require("morgan");

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

  module.exports.change_password = async function(req, res, next) {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      let { old_password, new_password, confirm_new_password } = req.body;
  
      const isMatch = await bcrypt.compare(old_password, user.password);
      console.log(isMatch);
  
      if (new_password === confirm_new_password) {
        console.log("Passwords match");
        
        if (isMatch) {
          console.log("Old password is correct");
  
          const salt = await bcrypt.genSalt(10);
          const hashedNewPassword = await bcrypt.hash(new_password, salt);
  
          user.password = hashedNewPassword;
          await user.save();
          console.log("Password changed");
  
          res.redirect("/edit-profile");
        } else {
          res.status(400).send("Old password is incorrect");
        }
      } else {
        res.status(400).send("New passwords do not match");
      }
    } catch (err) {
      res.send(err.message);
    }
  };

  module.exports.forgot_password = async function (req, res, next) {
    try {
      const email = req.body.email;
      const user = await userModel.findOne({ email_id: email });

      if(user){
        random_token = randomstring.generate({
          charset: 'alphanumeric',
          length: 20,
        });
        console.log(random_token);
        user.token = random_token;
        

      }else{
        res.send("user not found");
      }

      res.redirect("/forgot-password");
    } catch (err) {
      res.send(err.message);
    }
  };

  
