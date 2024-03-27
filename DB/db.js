const mongoose = require('mongoose');

const connectDB = mongoose.connect('mongodb://127.0.0.1:27017/OneCart');

connectDB.then(()=>console.log('Database connected'))
.catch(()=>{console.log(' Database connection failed')})
