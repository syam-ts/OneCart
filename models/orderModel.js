const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
        userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
        addressId:{type: mongoose.Schema.Types.ObjectId,ref: 'Address'},
        products:{type: Object,required:true,default: true},
        total:{type:Number,required:true},
        paymentMethod:{type:String,required:true},
        status:{type:String},
        createdate:{type:Date,default:Date.now},
        carts: {type: Object,required:true,default: true},
        discountPrice: {type: Number,required:true}
    });

module.exports = mongoose.model('Order',orderSchema);