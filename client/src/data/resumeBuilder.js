export const EXPERIENCE_LEVELS = [
  { id: 'fresher', label: 'Fresher', description: 'I am starting my career' },
  { id: 'student', label: 'Student', description: 'I am still studying' },
  { id: '0-2', label: '0–2 years', description: 'Early career experience' },
  { id: '3-5', label: '3–5 years', description: 'Growing professional experience' },
  { id: '5+', label: '5+ years', description: 'Experienced professional' },
];

export const TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'UI/UX Designer',
  'Digital Marketer',
  'Accountant',
  'Teacher',
  'MBA',
  'BCA Fresher',
];

export const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern', category: 'Modern', description: 'Clean hierarchy with confident accents.', accent: '#f97316' },
  { id: 'executive', name: 'Executive', category: 'Executive', description: 'Structured and polished for leadership roles.', accent: '#0f172a' },
  { id: 'visual', name: 'Impact', category: 'Creative', description: 'A strong visual profile for standout applications.', accent: '#ea580c' },
  { id: 'elegant', name: 'Elegant', category: 'Professional', description: 'Classic typography with refined spacing.', accent: '#475569' },
  { id: 'government', name: 'Formal', category: 'ATS Friendly', description: 'Straightforward formatting for formal applications.', accent: '#111827' },
  { id: 'internship', name: 'Student', category: 'Student', description: 'Education-forward layout for students and freshers.', accent: '#2563eb' },
  { id: 'aurora', name: 'Aurora', category: 'Minimal', description: 'Editorial layout with a calm, modern rhythm.', accent: '#7c3aed' },
];

export const SECTION_DEFINITIONS = [
  { id: 'personal', label: 'Personal Information', shortLabel: 'Personal', icon: 'user' },
  { id: 'summary', label: 'Professional Summary', shortLabel: 'Summary', icon: 'file' },
  { id: 'experience', label: 'Work Experience', shortLabel: 'Experience', icon: 'briefcase' },
  { id: 'education', label: 'Education', shortLabel: 'Education', icon: 'graduation' },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills', icon: 'code' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: 'folder' },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certificates', icon: 'award' },
  { id: 'achievements', label: 'Achievements', shortLabel: 'Achievements', icon: 'sparkles' },
  { id: 'languages', label: 'Languages', shortLabel: 'Languages', icon: 'globe' },
  { id: 'volunteer', label: 'Volunteer Experience', shortLabel: 'Volunteer', icon: 'heart' },
  { id: 'interests', label: 'Interests', shortLabel: 'Interests', icon: 'star' },
  { id: 'custom', label: 'Custom Section', shortLabel: 'Custom', icon: 'plus' },
];

export const createEmptyResume = (overrides = {}) => ({
  title: '',
  targetRole: '',
  experienceLevel: '',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    profilePicture: '',
    ...(overrides.personalInfo || {}),
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  volunteer: [],
  interests: [],
  customSections: [],
  sectionOrder: SECTION_DEFINITIONS.map((section) => section.id),
  hiddenSections: [],
  customization: {
    fontFamily: 'Inter',
    fontSize: 14,
    headingSize: 13,
    lineSpacing: 1.45,
    sectionSpacing: 20,
    margin: 48,
    accentColor: '#f97316',
    ...(overrides.customization || {}),
  },
  templateId: 'modern',
  ...overrides,
});

export const normalizeResume = (resume = {}) => {
  const normalized = createEmptyResume(resume);
  normalized.personalInfo = { ...createEmptyResume().personalInfo, ...(resume.personalInfo || {}) };
  normalized.customization = { ...createEmptyResume().customization, ...(resume.customization || {}) };
  normalized.sectionOrder = Array.isArray(resume.sectionOrder) && resume.sectionOrder.length
    ? resume.sectionOrder
    : SECTION_DEFINITIONS.map((section) => section.id);
  normalized.hiddenSections = Array.isArray(resume.hiddenSections) ? resume.hiddenSections : [];
  normalized.certifications = Array.isArray(resume.certifications) ? resume.certifications : [];
  normalized.achievements = Array.isArray(resume.achievements) ? resume.achievements : [];
  normalized.languages = Array.isArray(resume.languages) ? resume.languages : [];
  normalized.volunteer = Array.isArray(resume.volunteer) ? resume.volunteer : [];
  normalized.interests = Array.isArray(resume.interests) ? resume.interests : [];
  normalized.customSections = Array.isArray(resume.customSections) ? resume.customSections : [];
  return normalized;
};

export const htmlToPlainText = (value = '') => String(value)
  .replace(/<br\s*\/?>(\n)?/gi, '\n')
  .replace(/<\/p>/gi, '\n')
  .replace(/<li>/gi, '• ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

export const resumeToPlainText = (resume = {}) => {
  const sections = [
    resume.personalInfo?.fullName,
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.address,
    resume.personalInfo?.linkedin,
    resume.personalInfo?.github,
    resume.personalInfo?.website,
    htmlToPlainText(resume.summary),
    ...(resume.experience || []).flatMap((item) => [item.position, item.company, item.location, item.startDate, item.endDate, htmlToPlainText(item.description)]),
    ...(resume.education || []).flatMap((item) => [item.degree, item.institution || item.school, item.startDate, item.endDate, htmlToPlainText(item.description)]),
    ...(resume.skills || []),
    ...(resume.projects || []).flatMap((item) => [item.name, htmlToPlainText(item.description), item.link, ...(item.technologies || [])]),
    ...(resume.certifications || []).flatMap((item) => [item.name, item.issuer, item.date]),
  ];
  return sections.filter(Boolean).join('\n');
};
