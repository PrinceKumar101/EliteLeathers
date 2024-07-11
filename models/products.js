var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  image:{
    type: Buffer,

  },
  name:{
    type: String,
  },
  price:{
    type: Number,

  },
  discount: {
    type: Number,
    default: 0,

  },
  description:{
    type: String,

  },
  quantity: {
    type: Number,
    default:1,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
    
  }

  
});


module.exports = mongoose.model("Products", ProductsSchema);
