
const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Cover Letter'
    },
    recipientName: String,
    companyName: String,
    companyAddress: String,
    date: {
        type: String,
        default: () => new Date().toLocaleDateString()
    },
    subject: String,
    salutation: String,
    introduction: String,
    bodyParagraph1: String,
    bodyParagraph2: String,
    conclusion: String,
    closing: String,
    userName: String,
    userTitle: String,
    templateId: {
        type: String,
        default: 'modern'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
