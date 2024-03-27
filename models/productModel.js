const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
            productName:{
            type:String,
            required:true
            },
            productImage:{
            type:String,
            required:true
            },
            category:{
            type:String,
            required:true
            },
            description:{
            type:String,
            required:true
            },
            brand:{
            type:String,
            required:true
            },
            color:{
            type:String,
            required:true
            },
            price:{
            type:Number,
            required:true
            },   
            size:{
            type:Number,
            required: true    
            },
            stock:{
            type:Number,
            required:true
            },
            deleted: {
            type: Boolean,
            default: false,
              }
        });


module.exports = mongoose.model('Product',productSchema);