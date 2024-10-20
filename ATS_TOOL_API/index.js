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
    extractName, extractPhone, extractSkills, extractCandidateDescription } = require("./utils/textMatch");

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

const candidates_db = 'candidates_list_updated';
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/resume-upload", upload.single("resume"), async (req, res) => {

    const resumeBuffer = req.file.buffer;
    const resumeName = req.file.originalname;
    const jobDescription = req.body.jobDescription ? req.body.jobDescription : null;

    try {
        const resumeData = await pdfParse(resumeBuffer);
        const resumeText = resumeData.text;
        const extractedData = {
            name: extractName(resumeText),
            email: extractEmail(resumeText),
            phone_number: extractPhone(resumeText),
            ats_score: jobDescription === null ? 0 : compareText(resumeText, jobDescription),
            location: extractLocation(resumeText),
            skills: extractSkills(resumeText),
            experience: extractExperience(resumeText),
            currentOrganisation: extractCurrentOrganization(resumeText),
            candidateDescription: extractCandidateDescription(resumeText),
            resume: { resumeName, resumeBuffer, resumeText }
        };
        if (jobDescription !== null) {
            res.status(201).json({ atsScore: Number(extractedData.ats_score), message: 'ATS score successfully generated' })
        }
        else {
            const ats_db = await connectDB();
            const collection = await ats_db.collection(candidates_db);
            const result = await collection.insertOne(extractedData);
            res.status(201).json({ atsScore: Number(extractedData.ats_score), message: 'Data added', id: result.insertedId.toString() })
        }
    } catch (error) {
        res.status(500).send("Error parsing resume");
    }
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

app.get('/candidate/:id', async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.json(candidate)
});

app.post('/getCandidatesByScore', async (req, res) => {
    const selectedCandidates = [];
    const response = await fetchCandidatesByScore(req.body.jobDescription, req.body.score)
    selectedCandidates.push(response)
    res.json({ response: selectedCandidates })
});


const generateScoreByResume = (resumeText, jobDescription) => {
    let atsScore = compareText(resumeText, jobDescription)
    return atsScore;
}

async function fetchCandidatesByScore(jobDescription, atsScore) {
    try {
        const ats_db = await connectDB();
        const collection = await ats_db.collection(candidates_db);
        const result = await collection.find({}).toArray();
        const candidatePromises = result.map(async (candidate) => {
            const atsGeneratedScore = generateScoreByResume(candidate.resume.resumeText, jobDescription);
            if (atsGeneratedScore >= atsScore) {
                const updatedScore = await collection.updateOne(
                    { _id: candidate._id },
                    { $set: { ats_score: atsGeneratedScore } }
                );
                const selectedCandidate = await collection.find(
                    { _id: candidate._id },
                    { projection: { resume: 0 } }
                ).toArray();
                return selectedCandidate[0];
            }
        });
        const resolvedCandidates = await Promise.all(candidatePromises);
        const filteredCandidates = resolvedCandidates.filter(candidate => candidate !== undefined);
        return filteredCandidates;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        throw error;
    }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});