const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
            userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            },
            address:{
            type: Object,
            required:true,
            default: true
            },
            products:[{
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                },
                quantity:{
                    type:Number
                },
                total:{
                    type:Number
                }
                }],
                total:{
                    type:Number,
                    required:true
                },
                paymentMethod:{
                    type:String,
                    required:true
                },
                status:{
                    type:String
                },
                createdate:{
                    type:Date,
                    default:Date.now
                }
        });


module.exports = mongoose.model('Order',orderSchema);