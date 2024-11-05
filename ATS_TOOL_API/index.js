const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const pdfParse = require("pdf-parse");
require('dotenv').config();
const { connectDB } = require('./db');
const Candidate = require('./models/candidate');
const { compareText, extractCurrentOrganization, extractEmail, extractExperience, extractLocation,
    extractName, extractPhone, extractSkills, extractCandidateDescription } = require("./utils/textMatch");
const { serverConsts, STATUS_CODES, mongoDBConsts, messages, END_POINTS, DATABASE_LISTS } = require('./Constants')

const app = express();

connectDB();

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

app.get('/api-health', async (req, res) => {
    res.json({ health: 'ok' });
});

app.get(END_POINTS.GET_CANDIDATES, async (req, res) => {
    const candidates = await fetchCandidates("true");
    res.json({ candidates });
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(END_POINTS.RESUME_UPLOAD, upload.array("resume"), async (req, res) => {
    const jobDescription = req.body.jobDescription ? req.body.jobDescription : null;
    const applied_position = req.body.applied_position;

    try {

        const data_list = [];
        for (let file of req.files) {
            console.log(file)
            const resumeBuffer = file.buffer;
            const resumeName = file.originalname;
            const resumeData = await pdfParse(resumeBuffer);
            const resumeText = resumeData.text;
            const newCandidate = new Candidate({
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
                resume: { resumeName, resumeBuffer, resumeText },
                remarks: "no remarks yet"
            })
            data_list.push(newCandidate);
        }

        if (jobDescription !== null && req.files.length === 1) {
            res.status(201).json({ atsScore: data_list[0].ats_score, message: 'ATS score successfully generated' })
        }else{
            const savedCandidate = await Candidate.insertMany(data_list);
            res.status(201).json(savedCandidate);
        }
       

    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).send(serverConsts.error_parsing_resume);
    }
});

app.get(END_POINTS.CANDIDATE_ID, async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.status(STATUS_CODES.SUCCESS).json(candidate);
});

app.patch(`${END_POINTS.CANDIDATE_ID}`, async (req, res) => {
    const { id } = req.body;
    const key = req.query.key;
    const value = req.query.value;
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            { $set: { [key]: value } },
            { new: true }
        );
        if (!updatedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.json({ [key]: updatedCandidate[key], message: `${req.query.key} updated`, updatedData: updatedCandidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating candidate status" });
    }
});

async function fetchCandidates(value) {
    try {
        let candidates;
        if (value === "true") {
            candidates = candidates = await Candidate.find().select('name email location applied_position status experience').sort({ date_applied: -1 });
        }
        else {
            candidates = await Candidate.findById(value)
        }
        return candidates;
    } catch (error) {
        console.error(serverConsts.error_fetching_candidates, error);
        throw error;
    }
}

app.get(END_POINTS.CANDIDATE_ID, async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.json(candidate)
});

app.get(END_POINTS.DOWNLOAD_RESUME, async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate || !candidate.resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${candidate.resume.resumeName}`,
        });
        res.send(candidate.resume.resumeBuffer);
    } catch (error) {
        console.error("Error downloading resume:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post(END_POINTS.GET_CANDIDATES_BY_SCORE, async (req, res) => {
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
        const candidates = await Candidate.find({});
        const candidatePromises = candidates.map(async (candidate) => {
            const atsGeneratedScore = generateScoreByResume(candidate.resume.resumeText, jobDescription);

            if (atsGeneratedScore >= atsScore) {
                candidate.ats_score = atsGeneratedScore;
                await candidate.save();
                const { resume, ...selectedCandidate } = candidate.toObject();
                return selectedCandidate;
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
    console.log(`${serverConsts.server_running} ${PORT}`);
});