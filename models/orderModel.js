const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
            userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            },
            address:{
            type: Object,
            default: true
            },
            products:[{
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                },
                quantity:{
                    type:Number
                }
                }],
                total:{
                    type:Number
                },
                paymetMethod:{
                    type:String,
                    
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