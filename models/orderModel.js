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
            products: {
                type: Object,
            required:true,
            default: true
            },
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
                },
                carts: {
                    type: Object,
                required:true,
                default: true
                }
        });


module.exports = mongoose.model('Order',orderSchema);