const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.9wmq7.mongodb.net/OnlineCodeIDE?retryWrites=true&w=majority';
        const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
