const mongoose = require('mongoose')
const connectDB = async () => {
    try {
const uri = 'mongodb+srv://syamnandhu3:WF71wWF0bCF4JI2R@cluster0.doa7cbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(uri);

    } catch (error) {
        console.error('Database connection failed:');
    }
};

module.exports = connectDB;
