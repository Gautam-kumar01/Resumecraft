
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        linkedin: String,
        github: String,
        website: String,
        profilePicture: String,
    },
    summary: String,
    education: [{
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    experience: [{
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    skills: [String],
    projects: [{
        name: String,
        description: String,
        link: String,
        technologies: [String],
    }],
    templateId: {
        type: String,
        default: 'modern',
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
