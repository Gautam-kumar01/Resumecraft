const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const SECTION_ALIASES = {
  summary: ['summary', 'professional summary', 'profile', 'objective', 'career objective'],
  experience: ['experience', 'work experience', 'employment', 'professional experience'],
  education: ['education', 'academic background', 'qualifications'],
  skills: ['skills', 'technical skills', 'core skills', 'competencies'],
  projects: ['projects', 'selected projects', 'personal projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
  achievements: ['achievements', 'awards', 'honors'],
  languages: ['languages'],
};

const normalizeLine = (line) => String(line || '').replace(/[\t ]+/g, ' ').trim();
const nonEmptyLines = (text) => String(text || '').split(/\r?\n/).map(normalizeLine).filter(Boolean);

const headingToSection = (line) => {
  const normalized = line.toLowerCase().replace(/[:\-]/g, '').trim();
  return Object.entries(SECTION_ALIASES).find(([, aliases]) => aliases.includes(normalized))?.[0] || null;
};

const extractSections = (text) => {
  const sections = { header: [] };
  let current = 'header';
  nonEmptyLines(text).forEach((line) => {
    const section = headingToSection(line);
    if (section) {
      current = section;
      sections[current] = [];
    } else {
      sections[current].push(line);
    }
  });
  return sections;
};

const firstMatch = (text, regex) => text.match(regex)?.[0] || '';

const extractContact = (text) => ({
  fullName: nonEmptyLines(text).find((line) => {
    const looksLikeName = /^[A-Za-z][A-Za-z .'-]{2,60}$/.test(line);
    const notHeading = !headingToSection(line);
    return looksLikeName && notHeading && !/resume|curriculum vitae|email|phone|linkedin|github/i.test(line);
  }) || '',
  email: firstMatch(text, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i),
  phone: firstMatch(text, /(?:\+?\d[\d ()-]{8,}\d)/),
  linkedin: firstMatch(text, /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,)]+/i),
  github: firstMatch(text, /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|,)]+/i),
  website: firstMatch(text, /https?:\/\/(?!www\.)?(?!linkedin\.com|github\.com)[^\s|,)]+/i),
  address: '',
});

const toHtmlList = (lines) => lines.length ? `<ul>${lines.map((line) => `<li>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}</ul>` : '';

const parseExperience = (lines) => {
  if (!lines.length) return [];
  const blocks = [];
  let current = [];
  lines.forEach((line) => {
    if (/\b(19|20)\d{2}\b/.test(line) && current.length) {
      blocks.push(current);
      current = [line];
    } else current.push(line);
  });
  if (current.length) blocks.push(current);
  return blocks.slice(0, 8).map((block) => ({
    position: block[0] || '',
    company: block[1] || '',
    location: '',
    startDate: firstMatch(block.join(' '), /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}/i),
    endDate: firstMatch(block.join(' '), /(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4})/i),
    description: toHtmlList(block.slice(2).filter((line) => !/^(?:present|current|\d{4})$/i.test(line))),
  }));
};

const parseEducation = (lines) => lines.slice(0, 8).map((line) => ({ institution: line, school: line, degree: '', startDate: '', endDate: '', description: '' }));
const parseNamedItems = (lines) => lines.flatMap((line) => line.split(/[|,;]/).map((item) => item.trim())).filter(Boolean).map((name) => ({ name, issuer: '', date: '' }));

const buildResumeFromText = (text) => {
  const sections = extractSections(text);
  const contact = extractContact(text);
  const summary = (sections.summary || []).join(' ');
  const skills = (sections.skills || []).flatMap((line) => line.split(/[,|•]/).map((skill) => skill.trim())).filter(Boolean);
  const projects = (sections.projects || []).length ? [{ name: sections.projects[0], description: toHtmlList(sections.projects.slice(1)), link: '', technologies: [] }] : [];
  return {
    title: contact.fullName ? `${contact.fullName} Resume` : 'Imported Resume',
    targetRole: '',
    personalInfo: contact,
    summary,
    experience: parseExperience(sections.experience || []),
    education: parseEducation(sections.education || []),
    skills,
    projects,
    certifications: parseNamedItems(sections.certifications || []),
    achievements: parseNamedItems(sections.achievements || []),
    languages: parseNamedItems(sections.languages || []),
    importText: text.slice(0, 20000),
  };
};

const parseResumeFile = async (file) => {
  const extension = file.originalname.toLowerCase().split('.').pop();
  let text = '';
  if (extension === 'pdf') {
    const result = await pdfParse(file.buffer);
    text = result.text;
  } else if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  } else {
    throw new Error('Only PDF and DOCX files are supported.');
  }
  if (!text.trim()) throw new Error('No readable text was found in this file.');
  return buildResumeFromText(text);
};

module.exports = { parseResumeFile };
