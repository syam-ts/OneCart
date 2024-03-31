const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
        userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User' 
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product' 
                },
                quantity: {
                    type: Number,
                    default: 1 
                },
                total: {
                    type: Number,
                    default: 0 
                }
         });


module.exports = mongoose.model('Cart',cartSchema);