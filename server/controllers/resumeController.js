
const Resume = require('../models/Resume');
// const puppeteer = require('puppeteer');
const starterResumes = require('../data/starterResumes');

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            if (resume.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
    const {
        title,
        templateId,
        personalInfo,
        summary,
        education,
        experience,
        skills,
        projects
    } = req.body;

    console.log('Create Resume Request:', { title, user: req.user?._id });

    try {
        if (!req.user) {
            console.error('Create Resume Error: req.user is missing');
            return res.status(401).json({ message: 'User context missing' });
        }

        const resume = new Resume({
            userId: req.user._id,
            title: title || 'Untitled Resume',
            templateId: templateId || 'modern',
            personalInfo: personalInfo || {
                fullName: req.user.name || '',
                email: req.user.email || '',
            },
            summary: summary || '',
            education: education || [],
            experience: experience || [],
            skills: skills || [],
            projects: projects || []
        });

        console.log('Attempting to save resume...');
        const createdResume = await resume.save();
        console.log('Resume created successfully:', createdResume._id);
        res.status(201).json(createdResume);
    } catch (error) {
        console.error('Create Resume Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
    const {
        title,
        personalInfo,
        summary,
        education,
        experience,
        skills,
        projects,
        templateId,
        isPublic,
    } = req.body;

    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            if (resume.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            resume.title = title || resume.title;
            resume.personalInfo = personalInfo || resume.personalInfo;
            resume.summary = summary || resume.summary;
            resume.education = education || resume.education;
            resume.experience = experience || resume.experience;
            resume.skills = skills || resume.skills;
            resume.projects = projects || resume.projects;
            resume.templateId = templateId || resume.templateId;
            resume.isPublic = isPublic !== undefined ? isPublic : resume.isPublic;

            const updatedResume = await resume.save();
            res.json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            if (resume.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await resume.deleteOne();
            res.json({ message: 'Resume removed' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public resume by ID
// @route   GET /api/resumes/public/:id
// @access  Public
const getPublicResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume && resume.isPublic) {
            res.json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found or not public' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate PDF (Disabled on Vercel)
// @route   POST /api/resumes/pdf
// @access  Private
const generatePDF = async (req, res) => {
    res.status(501).json({
        message: 'Backend PDF generation is currently disabled on Vercel due to environment limits. Please use the "Download PDF" button in the editor for high-fidelity frontend generation.'
    });
}

// @desc    Get starter resume templates
// @route   GET /api/resumes/starters
// @access  Public
const getStarters = async (req, res) => {
    res.json(starterResumes);
};

module.exports = {
    getResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    getPublicResume,
    generatePDF,
    getStarters
};
