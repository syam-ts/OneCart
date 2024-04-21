const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
            categoryName:{
            type: String,
            required: true
            },
            description:{
            type: String,
            required: true
            },
            deleted:{
            type: Boolean,
            default: false
            }
        });


module.exports = mongoose.model('Category',categorySchema);