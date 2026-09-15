const mongoose = require('mongoose');

const JobMatchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true, default: 'Untitled job match' },
  company: { type: String, trim: true, default: '' },
  jobUrl: { type: String, trim: true, default: '' },
  jobDescription: { type: String, required: true, maxlength: 30000 },
  resumeText: { type: String, required: true, maxlength: 30000 },
  matchResult: { type: mongoose.Schema.Types.Mixed, default: null },
  status: { type: String, enum: ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'], default: 'Saved' },
  coverLetter: { type: mongoose.Schema.Types.Mixed, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.JobMatch || mongoose.model('JobMatch', JobMatchSchema);
