
const CoverLetter = require('../models/CoverLetter');
const starterCoverLetters = require('../data/starterCoverLetters');

// @desc    Get all cover letters for a user
// @route   GET /api/cover-letters
// @access  Private
exports.getCoverLetters = async (req, res) => {
    try {
        const coverLetters = await CoverLetter.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.json(coverLetters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get cover letter by ID
// @route   GET /api/cover-letters/:id
// @access  Private
exports.getCoverLetterById = async (req, res) => {
    try {
        const coverLetter = await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }

        if (coverLetter.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(coverLetter);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new cover letter
// @route   POST /api/cover-letters
// @access  Private
exports.createCoverLetter = async (req, res) => {
    try {
        const newCoverLetter = new CoverLetter({
            ...req.body,
            user: req.user.id
        });

        const coverLetter = await newCoverLetter.save();
        res.status(201).json(coverLetter);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update cover letter
// @route   PUT /api/cover-letters/:id
// @access  Private
exports.updateCoverLetter = async (req, res) => {
    try {
        let coverLetter = await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }

        if (coverLetter.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        coverLetter = await CoverLetter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(coverLetter);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete cover letter
// @route   DELETE /api/cover-letters/:id
// @access  Private
exports.deleteCoverLetter = async (req, res) => {
    try {
        const coverLetter = await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }

        if (coverLetter.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await coverLetter.deleteOne();
        res.json({ message: 'Cover letter removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get starter cover letters
// @route   GET /api/cover-letters/starters
// @access  Public
exports.getStarters = async (req, res) => {
    res.json(starterCoverLetters);
};
