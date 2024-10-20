const { MongoClient } = require('mongodb');
const {mongoDBConsts, DATABASE_LISTS} = require('./Constants');
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.4ao1e.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0`;

let dbConnection;

async function connectDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true });
        await client.connect();
        console.log(mongoDBConsts.mongodb_connected);
        dbConnection = client.db(DATABASE_LISTS.ATS_MASTER_DATA);
        return dbConnection;
    } catch (error) {
        console.error(mongoDBConsts.error_connecting_to_mongodb, error);
        throw error;
    }
}

function getDB() {
    if (!dbConnection) {
        throw new Error(mongoDBConsts.database_not_initialized);
    }
    return dbConnection;
}

module.exports = { connectDB, getDB };

