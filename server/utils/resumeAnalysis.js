const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'candidate', 'could', 'for', 'from', 'has', 'have', 'help', 'into', 'is', 'job', 'looking', 'more', 'need', 'needs', 'knows', 'of', 'on', 'or', 'our', 'role', 'should', 'that', 'the', 'their', 'there', 'these', 'this', 'those', 'to', 'using', 'we', 'were', 'which', 'who', 'will', 'with', 'would', 'work', 'working', 'you', 'your', 'years', 'responsible', 'responsibilities', 'required', 'requirements', 'preferred', 'plus',
]);

const HTML_TAGS = /<[^>]+>/g;

const htmlToText = (value = '') => String(value)
  .replace(/<br\s*\/?>(\n)?/gi, '\n')
  .replace(/<\/p>/gi, '\n')
  .replace(/<li>/gi, '\n• ')
  .replace(HTML_TAGS, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

const resumeToText = (resume = {}) => [
  resume.personalInfo?.fullName,
  resume.personalInfo?.email,
  resume.personalInfo?.phone,
  resume.personalInfo?.address,
  resume.personalInfo?.linkedin,
  resume.personalInfo?.github,
  resume.personalInfo?.website,
  htmlToText(resume.summary),
  ...(resume.experience || []).flatMap((item) => [item.position, item.company, item.location, item.startDate, item.endDate, htmlToText(item.description)]),
  ...(resume.education || []).flatMap((item) => [item.degree, item.institution || item.school, item.startDate, item.endDate, htmlToText(item.description)]),
  ...(resume.skills || []),
  ...(resume.projects || []).flatMap((item) => [item.name, htmlToText(item.description), item.link, ...(item.technologies || [])]),
  ...(resume.certifications || []).flatMap((item) => [item.name, item.issuer, item.date]),
  ...(resume.achievements || []).flatMap((item) => [item.name, item.description]),
].filter(Boolean).join('\n');

const tokenize = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9+#.\-/ ]/g, ' ')
  .split(/\s+/)
  .map((token) => token.replace(/^[.+-]+|[.+-]+$/g, ''))
  .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const unique = (items) => [...new Set(items.map((item) => item.toLowerCase()))];

const getSectionScore = (resume) => {
  const sections = {
    'Contact information': Boolean(resume.personalInfo?.fullName && (resume.personalInfo?.email || resume.personalInfo?.phone)),
    Summary: Boolean(htmlToText(resume.summary).length >= 40),
    Experience: Boolean(resume.experience?.some((item) => item.position || item.company || htmlToText(item.description))),
    Education: Boolean(resume.education?.some((item) => item.degree || item.institution || item.school)),
    Skills: Boolean(resume.skills?.length),
    Projects: Boolean(resume.projects?.some((item) => item.name || htmlToText(item.description))),
  };
  const present = Object.values(sections).filter(Boolean).length;
  return { score: Math.round((present / Object.keys(sections).length) * 100), sections };
};

const getImpactScore = (text) => {
  const actionVerbCount = (text.match(/\b(achieved|built|created|delivered|designed|developed|drove|improved|increased|launched|led|managed|optimized|reduced|resolved|scaled|streamlined)\b/gi) || []).length;
  const metricCount = (text.match(/\b\d+(?:\.\d+)?\s*(?:%|x|k|m|bn|users?|projects?|clients?|days?|weeks?|months?)?\b/gi) || []).length;
  return Math.min(100, 45 + Math.min(30, actionVerbCount * 4) + Math.min(25, metricCount * 8));
};

const analyzeResume = (resume = {}, jobDescription = '') => {
  const text = resumeToText(resume);
  const tokens = unique(tokenize(text));
  const { score: sectionScore, sections } = getSectionScore(resume);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const bulletCount = (text.match(/•|<li>/g) || []).length;
  const formatting = Math.min(100, 65 + (resume.templateId ? 10 : 0) + (resume.customization ? 10 : 0) + (bulletCount > 0 ? 10 : 0) + (wordCount <= 900 ? 5 : 0));
  const readability = Math.max(55, Math.min(100, 100 - Math.max(0, wordCount - 650) / 10));
  const impact = getImpactScore(text);
  const keywordAnalysis = jobDescription ? matchResumeToJob(resume, jobDescription) : null;
  const keywords = keywordAnalysis ? keywordAnalysis.relevantKeywords : tokens.slice(0, 12);
  const keywordScore = keywordAnalysis ? keywordAnalysis.score : Math.min(100, 55 + Math.min(40, tokens.length * 2));
  const score = Math.round(sectionScore * 0.25 + keywordScore * 0.25 + formatting * 0.2 + readability * 0.15 + impact * 0.15);
  const recommendations = [];
  if (!sections.Summary) recommendations.push({ title: 'Add a focused summary', detail: 'Write a 2–4 line summary that names your target role and strongest evidence.' });
  if (!sections.Skills) recommendations.push({ title: 'Add relevant skills', detail: 'List skills you genuinely use and can discuss in an interview.' });
  if (!sections.Experience && !sections.Projects) recommendations.push({ title: 'Show evidence of your work', detail: 'Add experience, internships, projects, or volunteer work.' });
  if (impact < 75) recommendations.push({ title: 'Strengthen bullet points', detail: 'Start bullets with action verbs and add measurable outcomes only when you know the real numbers.' });
  if (wordCount > 900) recommendations.push({ title: 'Reduce dense text', detail: 'Keep the most relevant evidence and remove repetitive detail.' });
  if (jobDescription && keywordAnalysis.missingSkills.length) recommendations.push({ title: 'Review missing keywords', detail: `Compare your experience against: ${keywordAnalysis.missingSkills.slice(0, 6).join(', ')}.` });
  return {
    score,
    metrics: { sections: sectionScore, keywords: keywordScore, formatting, readability: Math.round(readability), impact },
    wordCount,
    recommendations,
    keywordAnalysis,
    disclaimer: 'This is an explainable guidance score, not a guarantee that any applicant tracking system will accept a resume.',
  };
};

const matchResumeToJob = (resume = {}, jobDescription = '') => {
  const resumeTokens = new Set(tokenize(resumeToText(resume)));
  const jobTokens = unique(tokenize(jobDescription)).filter((token) => token.length >= 3);
  const relevantKeywords = jobTokens.slice(0, 30);
  const matchedSkills = relevantKeywords.filter((keyword) => resumeTokens.has(keyword));
  const missingSkills = relevantKeywords.filter((keyword) => !resumeTokens.has(keyword)).slice(0, 15);
  const score = relevantKeywords.length ? Math.round((matchedSkills.length / relevantKeywords.length) * 100) : 0;
  return {
    score,
    matchedSkills,
    missingSkills,
    relevantKeywords,
    weakAreas: missingSkills.slice(0, 6).map((keyword) => `Review whether your resume has evidence for “${keyword}”.`),
    recommendedChanges: missingSkills.slice(0, 6).map((keyword) => `If you have used ${keyword}, reflect that experience in the most relevant section.`),
    disclaimer: 'Keyword matching highlights areas to review; it does not guarantee a hiring outcome or ATS result.',
  };
};

module.exports = { analyzeResume, matchResumeToJob, resumeToText, htmlToText };
