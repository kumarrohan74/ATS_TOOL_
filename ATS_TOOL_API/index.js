const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {ObjectId} = require("mongodb")
require('dotenv').config();
const { connectDB, getDB } = require('./db');
//express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//db connection
const candidates_db = 'candidates_list';
connectDB().then(() => {
    console.log('MongoDB connection established.');
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});

app.get('/api-health', async (req, res) => {
    res.json({ health: 'ok' });
}); 


app.get('/get-candidates', async (req, res) => {
    const candidates = await fetchCandidates("true");
    res.json({candidates});
});
app.get('/candidate/:id',async (req,res)=>{
    const candidate = await fetchCandidates(req.params.id);
    res.json(candidate)
   })
async function fetchCandidates(value) {
    try {
        const db = getDB();
        const candidatesCollection = db.collection(candidates_db);
        let candidates
        if(value==="true"){
           candidates = await candidatesCollection.find({},{projection:{ skills : 0, education : 0, date_applied : 0, category : 0, id : 0, comments : 0, resume_url:0}}).toArray();
          }
        else{
            candidates = await candidatesCollection.findOne({_id:new ObjectId(value)});
        }    
                
        return candidates;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        throw error;
    }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});