const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const multer = require("multer");
const pdfParse = require("pdf-parse");
require('dotenv').config();
const { connectDB } = require('./db');
const Candidate = require('./models/candidate');
const { serverConsts, STATUS_CODES, mongoDBConsts, messages, END_POINTS, DATABASE_LISTS, ANALYSE_RESUME_URL, GET_ATS_SCORE_URL } = require('./Constants')

const app = express();

connectDB();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',  // This will allow requests from any origin
}));

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
            const resumeBuffer = file.buffer;
            const resumeBase64 = resumeBuffer.toString('base64');

            const analyzeResponse = await analyseresume(resumeBase64, jobDescription);
            console.log(analyzeResponse)

            let skills = [];
            if (Array.isArray(analyzeResponse?.data.skills)) {
                skills = analyzeResponse.data.skills.flat(Infinity); 
            } else if (typeof analyzeResponse?.data.skills === 'object' && analyzeResponse?.data.skills !== null) {
                skills = Object.values(analyzeResponse.data.skills).flat(Infinity);
            } else {
                skills = [];
            }

            const parsedResume = await pdfParse(resumeBuffer);
            const resumeText = parsedResume.text;

            const newCandidate = new Candidate({
                name: analyzeResponse?.data?.personal_details?.name,
                email: analyzeResponse?.data?.personal_details?.email,
                phone_number: analyzeResponse?.data?.personal_details?.phone,
                ats_score: jobDescription === null ? 0 : analyzeResponse?.data?.ats_score,
                profileSummary: analyzeResponse?.data?.profile_summary,
                location: analyzeResponse?.data?.personal_details.location,
                skills,
                experience: analyzeResponse?.data?.total_experience,
                currentOrganisation: analyzeResponse?.data?.work_experience[0]?.company,
                currentPosition: analyzeResponse?.data?.work_experience[0]?.position,
                candidateDescription: analyzeResponse?.data?.profile_summary,
                applied_position,
                resume: { resumeName: file.originalname, resumeBuffer, resumeText },
                remarks: "NO Remarks Added"
            });

            data_list.push(newCandidate);
        }

        if (jobDescription !== null && req.files.length === 1) {
            res.status(201).json({ atsScore: data_list[0].ats_score, message: 'ATS score successfully generated' })
        } else {
            const savedCandidate = await Candidate.insertMany(data_list);
            res.status(201).json(savedCandidate);
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ error: "Error parsing resume or saving data" });
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


const generateScoreByResume = async(candidateBase64, jobDescription) => {
    const analyzeResponse = await analyseresume(candidateBase64, jobDescription);
    let atsScore = analyzeResponse.data.ats_score;
    return atsScore;
}

const getATSScore = async(file, jobDescription) => {
    try {
        var analyze_Response = await axios.post(
            `${GET_ATS_SCORE_URL}`,
            { file, job_description: jobDescription },
            { headers: { 'Content-Type': 'application/json' },
            withCredentials: true }
        );
    } catch (err) {
        console.error("Error calling analyze_resume API:", err.response?.data || err.message);
    }
    return analyze_Response;
}

const analyseresume = async(file, jobDescription) => {
    try {
        var analyze_Response = await axios.post(
            `${ANALYSE_RESUME_URL}`,
            { file, job_description: jobDescription },
            { headers: { 'Content-Type': 'application/json' },
            withCredentials: true }
        );
    } catch (err) {
        console.error("Error calling analyze_resume API:", err.response?.data || err.message);
    }
    return analyze_Response;
}

async function fetchCandidatesByScore(jobDescription, atsScore) {
    try {
        const candidates = await Candidate.find({});
        const candidatePromises = candidates.map(async (candidate) => {
            const candidateBase64 = candidate.resume.resumeBuffer.toString('base64');
            const atsGeneratedScore = await generateScoreByResume(candidateBase64, jobDescription);

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
