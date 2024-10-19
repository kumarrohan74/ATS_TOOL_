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

const { ObjectId } = require("mongodb");
const { serverConsts, STATUS_CODES, mongoDBConsts, messages, END_POINTS, DATABASE_LISTS } = require('./Constants')
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

const { CANDIDATES_DB } = DATABASE_LISTS;
connectDB().then(() => {
    console.log(mongoDBConsts.mongodb_connection_established);
}).catch((error) => {
    console.error(mongoDBConsts.failed_to_connect_to_mongodb, error);
});

app.get('/api-health', async (req, res) => {
    res.json({ health: 'ok' });
});


app.get(END_POINTS.GET_CANDIDATES, async (req, res) => {
    const candidates = await fetchCandidates("true");
    res.json({ candidates });
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(END_POINTS.RESUME_UPLOAD, upload.single("resume"), async (req, res) => {
    const resumeBuffer = req.file.buffer;
    const resumeName = req.file.originalname;
    const jobDescription = req.body.jobDescription ? req.body.jobDescription : null;
    const applied_position = req.body.applied_position;
    const application_status = req.body.application_status;
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
            applied_position,
            status: application_status,
            resume: { resumeName, resumeBuffer }
        };
        const ats_db = await connectDB();
        const collection = await ats_db.collection(CANDIDATES_DB);
        const result = await collection.insertOne(extractedData);
        res.status(STATUS_CODES.CREATED).json({ atsScore: Number(extractedData.ats_score), message: messages.data_added, id: result.insertedId.toString() })
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).send(serverConsts.error_parsing_resume);
    }
});

app.get(END_POINTS.CANDIDATE_ID, async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.status(STATUS_CODES.SUCCESS).json(candidate);
});

app.patch(END_POINTS.CANDIDATE_ID, async (req, res) => {
    const { status, id } = req.body;
    console.log(status, new ObjectId(id))
    const ats_db = await connectDB();
    const collection = await ats_db.collection(CANDIDATES_DB);
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { status: status } }, { returnDocument: 'after' });
    res.json({ status: result.status, message: "Status updated" });
});
async function fetchCandidates(value) {
    try {
        const db = getDB();
        const candidatesCollection = db.collection(CANDIDATES_DB);
        let candidates
        if (value === "true") {
            candidates = await candidatesCollection.find({}, { projection: { skills: 0, education: 0, date_applied: 0, category: 0, id: 0, comments: 0, resume_url: 0 } }).sort({ _id: -1 }).toArray();
        }
        else {
            candidates = await candidatesCollection.findOne({ _id: new ObjectId(value) });
        }
        return candidates;
    } catch (error) {
        console.error(serverConsts.error_fetching_candidates, error);
        throw error;
    }
}


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`${serverConsts.server_running} ${PORT}`);
});