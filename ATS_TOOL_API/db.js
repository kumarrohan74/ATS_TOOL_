const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://ATS_TOOL_ADMIN:password_ats@cluster0.4ao1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let dbConnection;

async function connectDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("MongoDB Connected");
        dbConnection = client.db('ATS_master_data');
        return dbConnection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Function to get the connected database instance
function getDB() {
    if (!dbConnection) {
        throw new Error('Database not initialized');
    }
    return dbConnection;
}

module.exports = { connectDB, getDB };

