var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const { array } = require("../config/multer");
const products = require("./products");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    unique:false,
  },
  profile_picture: {
    type: Buffer ,
    default: Buffer.alloc(0),
  },
  email_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  contact_number: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please fill a valid 10-digit contact number"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    default: "",


  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  seller:{
    type: Boolean,
    default: false,
  },
  products: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Products"
    }
  ],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Products",
  }]
  
});


module.exports = mongoose.model("User", UserSchema);
