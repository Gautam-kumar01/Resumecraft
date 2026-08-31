const assert = require('assert');
const { analyzeResume, matchResumeToJob } = require('./utils/resumeAnalysis');

const resume = {
  personalInfo: { fullName: 'Aarav Sharma', email: 'aarav@example.com' },
  summary: 'Frontend developer candidate focused on responsive React applications.',
  skills: ['React', 'JavaScript', 'Git'],
  projects: [{ name: 'Portfolio', description: 'Built a responsive portfolio with React.' }],
};

const ats = analyzeResume(resume);
assert(Number.isInteger(ats.score));
assert(ats.score >= 0 && ats.score <= 100);
assert(ats.metrics.sections >= 0 && ats.metrics.sections <= 100);

const match = matchResumeToJob(resume, 'We need a React developer who knows JavaScript and Docker.');
assert(match.matchedSkills.includes('react'));
assert(match.missingSkills.includes('docker'));
assert(match.score >= 0 && match.score <= 100);

console.log('resume-analysis-smoke-test: ok');
