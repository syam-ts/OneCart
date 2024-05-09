const mongoose = require('mongoose');
const uuid = require('uuid');

const orderSchema = mongoose.Schema({
        userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
        address:{type: Object,required:true,default: true},
        products:{type: Object,required:true,default: true},
        total:{type:Number,required:true},
        paymentMethod:{type:String,required:true},
        status:{type:String},
        createdate:{type:Date,default:Date.now},
        carts: {type: Object,required:true,default: true},
        discountPrice: {type: Number,required:true},
        return:{type:{return:Boolean, reason:String}},
        ordId: { type: String, default: uuid.v4, unique: true },
        cancelReason: { type: String }
    });

module.exports = mongoose.model('Order',orderSchema);