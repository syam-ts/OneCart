const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required: true
    },
    mobile:{
        type:Number,
    },
    address:{
        type:String
    },
    pincode:{
        type:Number
    },
    city:{
        type:String

    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    addressType:{
        type:String
    }
});

module.exports = mongoose.model('Address',addressSchema);