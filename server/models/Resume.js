
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
    targetRole: String,
    experienceLevel: String,
    summary: String,
    education: [{
        institution: String,
        school: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    experience: [{
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        description: String,
    }],
    skills: [String],
    projects: [{
        name: String,
        description: String,
        link: String,
        technologies: [String],
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: String,
        link: String,
    }],
    achievements: [{
        name: String,
        description: String,
        date: String,
    }],
    languages: [{ name: String, proficiency: String }],
    volunteer: [{
        role: String,
        organization: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    interests: [String],
    customSections: [{ title: String, content: String }],
    sectionOrder: [String],
    hiddenSections: [String],
    customization: {
        fontFamily: String,
        fontSize: Number,
        headingSize: Number,
        lineSpacing: Number,
        sectionSpacing: Number,
        margin: Number,
        accentColor: String,
    },
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
