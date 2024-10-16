const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.4ao1e.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0`;

let dbConnection;

async function connectDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true });
        await client.connect();
        console.log("MongoDB Connected");
        dbConnection = client.db('ATS_master_data');
        return dbConnection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

function getDB() {
    if (!dbConnection) {
        throw new Error('Database not initialized');
    }
    return dbConnection;
}

module.exports = { connectDB, getDB };

