const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
            orderName:{
            type: String,
            required: true
            },
            deleted:{
            type: Boolean,
            default: false
            }
        });


module.exports = mongoose.model('Order',orderSchema);