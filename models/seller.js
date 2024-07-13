const mongoose = require('mongoose');

// Define schema
const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String
    },
    aadharNumber: {
        type: Number,
        required: true
    },
    panCard: {
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

// Create model
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
