const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
            tlsAllowInvalidCertificates: true
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        setTimeout(connectDB, 5000); 
    }
};

module.exports = connectDB;

