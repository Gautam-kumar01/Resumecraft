
const Resume = require('../models/Resume');
const puppeteer = require('puppeteer');

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
    const { title, templateId } = req.body;

    try {
        const resume = new Resume({
            userId: req.user._id,
            title,
            templateId,
            personalInfo: {
                fullName: req.user.name,
                email: req.user.email,
            },
        });

        const createdResume = await resume.save();
        res.status(201).json(createdResume);
    } catch (error) {
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

// @desc    Generate PDF
// @route   POST /api/resumes/pdf
// @access  Private
// note: in a real app, you might render a specific HTML template string or URL.
// for simplicity here, we will just return a message or basic PDF.
// Client side PDF generation is often better for immediate feedback, but requirements asked for backend.
const generatePDF = async (req, res) => {
    const { html } = req.body; // Expecting HTML content from client to render

    if (!html) {
        return res.status(400).json({ message: 'No HTML content provided' });
    }

    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
        res.send(pdf);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'PDF generation failed' });
    }
}

module.exports = {
    getResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    getPublicResume,
    generatePDF
};
