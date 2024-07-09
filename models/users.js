var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  profile_picture: {
    type: String ,
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
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postal_code: {
      type: String,
      match: [/^\d{5}(-\d{4})?$/, "Please fill a valid postal code"],
    },
    country: {
      type: String,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
