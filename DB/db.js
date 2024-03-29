const mongoose = require('mongoose');

// Function to establish MongoDB connection
const connectDB = async () => {
    try {
        // Database connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      };

        // MongoDB connection URI (replace username, password, and dbname with actual values)
        // MongoDB connection URI with direct connection, server selection timeout, and application name
const uri = 'mongodb://127.0.0.1:27017/OneCart';


        // Establish the database connection
        await mongoose.connect(uri, options);

    } catch (error) {
        console.error('Database connection failed:');
        // Optionally, you can choose to gracefully exit the application if the database connection fails
        // process.exit(1);
    }
};

module.exports = connectDB;
