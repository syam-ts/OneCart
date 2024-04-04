const mongoose = require('mongoose')
const connectDB = async () => {
    try {
const uri = 'mongodb://127.0.0.1:27017/OneCart';
        await mongoose.connect(uri);

    } catch (error) {
        console.error('Database connection failed:');
    }
};

module.exports = connectDB;
