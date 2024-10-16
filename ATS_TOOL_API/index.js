const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require("multer");
const pdfParse = require("pdf-parse");
require('dotenv').config();
const { connectDB, getDB } = require('./db');
const { compareText, extractCurrentOrganization, extractEmail, extractExperience, extractLocation,
extractName, extractPhone, extractSkills } = require("./utils/textMatch");

const { ObjectId } = require("mongodb")
let objID;

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
    res.json({ candidates });
});

const upload = multer({ dest: "uploads/" });

app.post("/resume-upload", upload.single("resume"), async (req, res) => {

    const resumePath = req.file.path;
    const jobDescription = req.body.jobDescription;

    try {
        const resumeBuffer = fs.readFileSync(resumePath);
        const resumeData = await pdfParse(resumeBuffer);
        const resumeText = resumeData.text;
        // const name = extractName(resumeText); 
        // const email = extractEmail(resumeText);
        // const phone_number = extractPhone(resumeText);
        // const ats_score = compareText(resumeText, jobDescription);
        // const location = extractLocation(resumeText);
        // const skills = extractSkills(resumeText);
        // const experience = extractExperience(resumeText)
        // const currentOrganisation = extractCurrentOrganization(resumeText)
        const extractedData = {
            name: extractName(resumeText),
            email: extractEmail(resumeText),
            phone_number: extractPhone(resumeText),
            ats_score: compareText(resumeText, jobDescription),
            location: extractLocation(resumeText),
            skills: extractSkills(resumeText),
            experience: extractExperience(resumeText),
            currentOrganisation: extractCurrentOrganization(resumeText),
        };
        const ats_db = await connectDB();
        const collection = await ats_db.collection(candidates_db);
        const result = await collection.insertOne(extractedData);
        res.status(201).json({ atsScore: Number(extractedData.ats_score), message: 'Data added', id: result.insertedId.toString() })
    } catch (error) {
        res.status(500).send("Error parsing resume");
    }
});
app.get('/resume-upload', (req, res) => {
    res.json({ id: objID })
});

app.get('/candidate/:id', async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.json(candidate)
});


async function fetchCandidates(value) {

    try {
        const db = getDB();
        const candidatesCollection = db.collection(candidates_db);
        let candidates
        if (value === "true") {
            candidates = await candidatesCollection.find({}, { projection: { skills: 0, education: 0, date_applied: 0, category: 0, id: 0, comments: 0, resume_url: 0 } }).sort({ _id: -1 }).toArray();
        }
        else {
            candidates = await candidatesCollection.findOne({ _id: new ObjectId(value) });
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