const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.4ao1e.mongodb.net/ATS_master_data?retryWrites=true&w=majority&ssl=true&appName=Cluster0`;

const { ObjectId } = mongoose.Types;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = { connectDB, ObjectId };

