const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    resume: {
        resumeName: { type: String, required: true },
        resumeBuffer: { type: Buffer, required: true },
        resumeText: { type: String, required: true },
    },
    ats_score: { type: Number, default: 0 },
    skills: { type: [String] },
    experience: {
        totalYears: { type: Number, required: true },
        totalMonths: { type: Number, required: true },
        totalExperienceInMonths: { type: Number }
    },
    education: { type: String },
    applied_position: { type: String },
    date_applied: { type: Date, default: Date.now },
    location: { type: String },
    status: {
        type: String,
        enum: [
            "Profile Added",
            "Applied",
            "Under Review",
            "Shortlisted",
            "Interview Scheduled",
            "Interview Completed",
            "Offer Extended",
            "Offer Accepted",
            "Offer Declined",
            "Rejected",
            "On Hold",
            "Hired",
            "Withdrawn"
        ],
        default: "Profile Added"
    },
    category: { type: String },
    description: { type: String }
});

const Candidate = mongoose.model('Candidate', candidateSchema, 'candidates_list_updated');

module.exports = Candidate;
