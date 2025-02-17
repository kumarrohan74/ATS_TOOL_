const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String },
    phone_number: { type: String },
    resume: {
        resumeName: { type: String },
        resumeBuffer: { type: Buffer },
        resumeText: { type: String },
    },
    ats_score: { type: Number, default: 0 },
    skills: { type: mongoose.Schema.Types.Mixed },
    education: { type: String },
    experience: { type: Number },
    applied_position: { type: String },
    currentOrganisation: { type: String },
    currentPosition: { type: String },
    profileSummary: { type: String },
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
    description: { type: String },
    remarks: { type: String, required: false }
});

const Candidate = mongoose.model('Candidate', candidateSchema, 'candidates_list_updated1');

module.exports = Candidate;
