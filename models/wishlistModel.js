const mongoose = require('mongoose');

const whislistSchema = mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' 
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' 
            }
        });


module.exports = mongoose.model('Whislist',whislistSchema);