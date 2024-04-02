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
                },
                total:{
                    type:Number
                }
            }],
        });


module.exports = mongoose.model('Order',orderSchema);