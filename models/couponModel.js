const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    couponCode : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    maximumAmount : {
        type : Number,
        required : true
    },
    expiryDate : {
        type : Date,
        required : true
    }
  });


module.exports = mongoose.model('Coupon',couponSchema);