const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require("multer");
const pdfParse = require("pdf-parse");
require('dotenv').config();
const { connectDB, getDB } = require('./db');
const { compareText } = require("./utils/textMatch");
const { ObjectId } = require("mongodb")
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
  res.json({ candidates });
});

const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

// Regex for phone number extraction
const extractPhone = (text) => {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d-.]{7,10}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

// Basic function for name extraction (can vary depending on the resume)
const extractName = (text) => {
  const commonNonNameWords = [
    'resume', 'email', 'phone', 'address', 'objective', 'profile', 'education',
    'experience', 'skills', 'summary', 'computer science', 'bachelor', 'master',
    'phd', 'certifications', 'linkedin', 'github', 'science', 'technology',
    'engineering', 'degree', 'university', 'college'
  ];

  // Helper function to check if a word is common and not likely to be a name
  const isCommonWord = (word) => commonNonNameWords.includes(word.toLowerCase());

  // Helper function to detect fully capitalized words (potentially names)
  const isFullyCapitalized = (word) => /^[A-Z]+$/.test(word);

  // Helper function to detect section headers like "Education", "Experience", etc.
  const isSectionHeader = (line) => {
    return /(education|experience|skills|summary|certifications)/i.test(line.trim().toLowerCase());
  };

  // Heuristic search for "Name" or similar labels
  let nameMatch = text.match(/(?:Name|Candidate|Resume of|Applicant)\s*:\s*([A-Za-z\s]+)/i);
  if (nameMatch) {
    let name = nameMatch[1].trim();
    if (!isCommonWord(name)) {
      return name;
    }
  }

  // Split the resume text into lines and iterate through them
  let lines = text.split('\n').filter(line => line.trim() !== '');

  for (let i = 0; i < Math.min(10, lines.length); i++) {
    let line = lines[i].trim();

    // Skip the line if it's a section header (like "Education")
    if (isSectionHeader(line)) {
      continue;
    }

    let words = line.split(/\s+/);

    // Filter out common words, allow capitalized or fully capitalized names
    let nameCandidates = words.filter(word => {
      const isCapitalized = /^[A-Z][a-z]+$/.test(word);   // First letter capitalized
      const isFullyCap = isFullyCapitalized(word);        // Entirely uppercase
      return (isCapitalized || isFullyCap) && !isCommonWord(word);
    });

    // Assume the name will be 1 to 3 capitalized or fully capitalized words
    if (nameCandidates.length >= 1 && nameCandidates.length <= 3) {
      return nameCandidates.join(' ');
    }
  }

  // Return fallback if no name found
  return 'Name not found';
};






const upload = multer({ dest: "uploads/" });


app.post("/resume-upload", upload.single("resume"), async (req, res) => {

  const resumePath = req.file.path;
  const jobDescription = req.body.jobDescription;

  try {
    const resumeBuffer = fs.readFileSync(resumePath);
    const resumeData = await pdfParse(resumeBuffer);
    const resumeText = resumeData.text;
    const name = extractName(resumeText);   // You'll need logic for this
    const email = extractEmail(resumeText);
    const phone = extractPhone(resumeText);
    const atsScore = compareText(resumeText, jobDescription);
    res.json({ atsScore: Number(atsScore), name, phone, email });
  } catch (error) {
    res.status(500).send("Error parsing resume");
  }
});

async function fetchCandidates() {

  app.get('/candidate/:id', async (req, res) => {
    const candidate = await fetchCandidates(req.params.id);
    res.json(candidate)
  })
  async function fetchCandidates(value) {

    try {
      const db = getDB();
      const candidatesCollection = db.collection(candidates_db);
      let candidates
      if (value === "true") {
        candidates = await candidatesCollection.find({}, { projection: { skills: 0, education: 0, date_applied: 0, category: 0, id: 0, comments: 0, resume_url: 0 } }).toArray();
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
}

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });