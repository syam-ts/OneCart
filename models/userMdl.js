const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true},
        phone:{type:Number,required:true},
        password:{type:String,required:true},
        isBlock:{type:Boolean,value:false},
        otp: {type: String},
        userImage:{type:String},
        gender:{type:String}
  });


module.exports = mongoose.model('User',userSchema);