const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
      userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
      amount: {type: Number,default: 0},
      status: {type: String, default: "Active"}
  });

module.exports = mongoose.model('Wallet',walletSchema);