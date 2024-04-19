const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    createdOn : {
        type : Date,
        required : true
    },
    expireOn : {
        type : Date,
        required : true
    },
    offerPrice : {
        type : Number,
        required : true
    },
    minimumPrice : {
        type : Number,
        required : true
    }
        });


module.exports = mongoose.model('Coupon',couponSchema);