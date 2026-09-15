const JobMatch = require('../models/JobMatch');

const owned = (doc, userId) => doc && doc.user.toString() === userId.toString();

exports.listJobMatches = async (req, res) => {
  try { res.json(await JobMatch.find({ user: req.user.id }).sort({ updatedAt: -1 })); }
  catch (error) { res.status(500).json({ message: 'Unable to load job matches.' }); }
};

exports.getJobMatch = async (req, res) => {
  try {
    const item = await JobMatch.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Job match not found.' });
    if (!owned(item, req.user.id)) return res.status(403).json({ message: 'Not authorized.' });
    res.json(item);
  } catch (error) { res.status(500).json({ message: 'Unable to load job match.' }); }
};

exports.createJobMatch = async (req, res) => {
  try {
    const { title, company, jobUrl, jobDescription, resumeText, matchResult, status, coverLetter, notes } = req.body;
    if (!jobDescription?.trim() || !resumeText?.trim()) return res.status(400).json({ message: 'Resume text and job description are required.' });
    const item = await JobMatch.create({ user: req.user.id, title, company, jobUrl, jobDescription, resumeText, matchResult, status, coverLetter, notes });
    res.status(201).json(item);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateJobMatch = async (req, res) => {
  try {
    const item = await JobMatch.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Job match not found.' });
    if (!owned(item, req.user.id)) return res.status(403).json({ message: 'Not authorized.' });
    const allowed = ['title', 'company', 'jobUrl', 'jobDescription', 'resumeText', 'matchResult', 'status', 'coverLetter', 'notes'];
    allowed.forEach(key => { if (req.body[key] !== undefined) item[key] = req.body[key]; });
    await item.save();
    res.json(item);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.deleteJobMatch = async (req, res) => {
  try {
    const item = await JobMatch.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Job match not found.' });
    if (!owned(item, req.user.id)) return res.status(403).json({ message: 'Not authorized.' });
    await item.deleteOne();
    res.json({ message: 'Job match removed.' });
  } catch (error) { res.status(500).json({ message: 'Unable to remove job match.' }); }
};
