const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const https = require('https');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { analyzeResume, matchResumeToJob, resumeToText, htmlToText } = require('../utils/resumeAnalysis');
const { parseResumeFile } = require('../utils/resumeParser');

dotenv.config();

// Helper to call DeepSeek API using built-in https module to avoid dependency issues
const callDeepSeek = async (prompt, isJson = true) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DeepSeek API Key is missing");

    return new Promise((resolve, reject) => {
        console.log("AI: Attempting generation with DeepSeek (deepseek-chat)...");
        
        const data = JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a professional resume writer and career coach." },
                { role: "user", content: prompt }
            ],
            response_format: isJson ? { type: "json_object" } : { type: "text" },
            temperature: 0.7
        });

        const options = {
            hostname: 'api.deepseek.com',
            path: '/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 30000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(response.choices[0].message.content);
                    } else {
                        reject(new Error(`DeepSeek API failed (${res.statusCode}): ${response.error?.message || body}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse DeepSeek response: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => reject(new Error(`DeepSeek Request Error: ${e.message}`)));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('DeepSeek Request Timeout'));
        });
        
        req.write(data);
        req.end();
    });
};

// Helper to call Groq API
const callGroq = async (prompt, isJson = true) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing");

    return new Promise((resolve, reject) => {
        console.log("AI: Attempting generation with Groq (llama-3.3-70b-versatile)...");
        
        const data = JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a professional resume writer and career coach." },
                { role: "user", content: prompt }
            ],
            response_format: isJson ? { type: "json_object" } : { type: "text" },
            temperature: 0.7
        });

        const options = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 30000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(response.choices[0].message.content);
                    } else {
                        reject(new Error(`Groq API failed (${res.statusCode}): ${response.error?.message || body}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse Groq response: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => reject(new Error(`Groq Request Error: ${e.message}`)));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Groq Request Timeout'));
        });
        
        req.write(data);
        req.end();
    });
};

// Helper to call Manus AI API
const callManus = async (prompt, isJson = true) => {
    const apiKey = process.env.MANUS_API_KEY;
    if (!apiKey) throw new Error("Manus API Key is missing");

    return new Promise((resolve, reject) => {
        console.log("AI: Attempting generation with Manus AI (manus-1.6-adaptive)...");
        
        const data = JSON.stringify({
            model: process.env.MANUS_MODEL || "manus-1.6-adaptive",
            messages: [
                { role: "system", content: "You are a professional resume writer and career coach." },
                { role: "user", content: prompt }
            ],
            ...(isJson ? { response_format: { type: "json_object" } } : {}),
            temperature: 0.7
        });

        const options = {
            hostname: 'api.manus.ai',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'x-manus-api-key': apiKey,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 60000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        if (response.choices && response.choices[0] && response.choices[0].message) {
                            resolve(response.choices[0].message.content);
                        } else {
                            reject(new Error(`Manus API response format invalid: ${body}`));
                        }
                    } else {
                        reject(new Error(`Manus API failed (${res.statusCode}): ${response.error?.message || body}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse Manus response: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => reject(new Error(`Manus Request Error: ${e.message}`)));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Manus Request Timeout'));
        });
        
        req.write(data);
        req.end();
    });
};


// Helper to call Gemini API. The key stays server-side and is never sent to the browser.
const callGemini = async (prompt, isJson = true) => {
    if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key is missing");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const configuredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const modelsToTry = [...new Set([
        configuredModel,
        "gemini-2.0-flash",
        "gemini-flash-latest"
    ])];
    let lastError = null;

    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`AI: Attempting generation with Gemini model: ${modelName}...`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                safetySettings,
                generationConfig: {
                    temperature: 0.7,
                    ...(isJson ? { responseMimeType: "application/json" } : {})
                }
            });
            const result = await model.generateContent(prompt);
            
            if (result && result.response) {
                const text = result.response.text();
                console.log(`AI: Success with Gemini model: ${modelName}`);
                return text;
            }
        } catch (err) {
            lastError = err;
            console.error(`AI: Gemini ${modelName} failed:`, err.message);
            // If it's a quota/key issue, don't try other Gemini models
            if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('403') || err.message.includes('API key')) {
                break;
            }
        }
    }
    throw lastError || new Error("All Gemini models failed");
};

exports.getSuggestions = async (req, res) => {
    const { jobRole, resumeContext = {} } = req.body;

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
    }

    const prompt = `You are a careful professional resume editor. The user is applying for a job as a "${jobRole}". Use only facts present in the supplied context. Do not invent employers, dates, metrics, technologies, achievements, or experience. Skills and bullets must be clearly reviewable suggestions, not claims that the user has done something.
    Candidate context: ${JSON.stringify(resumeContext).slice(0, 14000)}
    Return a JSON object with this exact structure:
    {
      "summary": "2-3 sentence professional summary",
      "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
      "bullets": ["Impactful bullet point 1", "Impactful bullet point 2", "Impactful bullet point 3", "Impactful bullet point 4"]
    }
    Return ONLY the JSON, no markdown.`;

    try {
        let text;
        try {
            // Try Gemini first
            text = await callGemini(prompt);
        } catch (geminiError) {
            console.log("AI: Gemini failed, falling back to Manus AI...");
            try {
                // Fallback to Manus AI
                text = await callManus(prompt, true);
            } catch (manusError) {
                console.log("AI: Manus AI failed, falling back to DeepSeek...");
                try {
                    // Fallback to DeepSeek
                    text = await callDeepSeek(prompt, true);
                } catch (deepSeekError) {
                    console.log("AI: DeepSeek failed, falling back to Groq...");
                    // Fallback to Groq
                    text = await callGroq(prompt, true);
                }
            }
        }

        // Clean up text if it contains markdown code blocks (sometimes LLMs ignore instructions)
        let jsonStr = text;
        if (text.includes('```')) {
            const matches = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            jsonStr = matches ? matches[1] : text.replace(/```json/gi, '').replace(/```/g, '').trim();
        }
        
        jsonStr = jsonStr.trim();

        try {
            const data = JSON.parse(jsonStr);
            res.json(data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError.message);
            throw new Error("AI returned invalid JSON format");
        }
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(503).json({
            message: "AI generation is temporarily unavailable. Please try again shortly.",
            code: "AI_PROVIDER_UNAVAILABLE"
        });
    }
};

const cleanJsonResponse = (text) => {
    let jsonStr = String(text || '').trim();
    if (jsonStr.includes('```')) {
        const matches = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        jsonStr = matches ? matches[1] : jsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();
    }
    return JSON.parse(jsonStr.trim());
};

const generateWithFallback = async (prompt) => {
    try {
        return await callGemini(prompt);
    } catch (geminiError) {
        try {
            return await callManus(prompt, true);
        } catch (manusError) {
            try {
                return await callDeepSeek(prompt, true);
            } catch (deepSeekError) {
                return callGroq(prompt, true);
            }
        }
    }
};

exports.improveText = async (req, res) => {
    const { text, action, section, resumeContext } = req.body;
    if (!text || !action) return res.status(400).json({ message: 'Text and action are required.' });
    const prompt = `You are a careful resume editor. Improve the following ${section || 'resume'} text using the requested action: ${action}. Preserve every fact, employer, date, technology, and number exactly as supplied. Never invent metrics, achievements, responsibilities, skills, or companies. If a metric is missing, use neutral wording rather than a placeholder. Return JSON only: {"result":"...","notes":"..."}.\nResume context: ${JSON.stringify(resumeContext || {}).slice(0, 12000)}\nText: ${text.slice(0, 6000)}`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json(data);
    } catch (error) {
        console.error('AI improvement error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue editing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.generateSummaryOptions = async (req, res) => {
    const { targetRole, experienceLevel, skills, experience, projects } = req.body;
    if (!targetRole) return res.status(400).json({ message: 'Target role is required.' });
    const prompt = `Write three concise professional resume summaries for a ${targetRole} at the ${experienceLevel || 'unspecified'} experience level. Use only the supplied facts. Do not add employers, years, metrics, technologies, or achievements not present in the input. Return JSON only: {"options":["summary 1","summary 2","summary 3"]}.\nSkills: ${JSON.stringify(skills || []).slice(0, 3000)}\nExperience: ${String(experience || '').slice(0, 5000)}\nProjects: ${String(projects || '').slice(0, 5000)}`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json({ options: Array.isArray(data.options) ? data.options.slice(0, 3) : [] });
    } catch (error) {
        console.error('AI summary error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue editing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.suggestSkills = async (req, res) => {
    const { targetRole, currentSkills = [] } = req.body;
    if (!targetRole) return res.status(400).json({ message: 'Target role is required.' });
    const prompt = `Suggest skills a candidate may want to review for the target role "${targetRole}". Never assume the candidate has them and never add them automatically. Return JSON only with arrays: {"technicalSkills":[],"softSkills":[],"tools":[],"frameworks":[],"platforms":[]}. Do not include more than eight items in each array. Current skills: ${JSON.stringify(currentSkills).slice(0, 3000)}`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json({
            technicalSkills: Array.isArray(data.technicalSkills) ? data.technicalSkills : [],
            softSkills: Array.isArray(data.softSkills) ? data.softSkills : [],
            tools: Array.isArray(data.tools) ? data.tools : [],
            frameworks: Array.isArray(data.frameworks) ? data.frameworks : [],
            platforms: Array.isArray(data.platforms) ? data.platforms : [],
        });
    } catch (error) {
        console.error('AI skill suggestion error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue editing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.analyzeAts = async (req, res) => {
    if (!req.body?.resume) return res.status(400).json({ message: 'Resume data is required.' });
    res.json(analyzeResume(req.body.resume, req.body.jobDescription || ''));
};

exports.matchJobDescription = async (req, res) => {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription?.trim()) return res.status(400).json({ message: 'Resume and job description are required.' });
    res.json(matchResumeToJob(resume, jobDescription));
};

exports.tailorResume = async (req, res) => {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription?.trim()) return res.status(400).json({ message: 'Resume and job description are required.' });
    const prompt = `You are a resume editor. Compare the supplied resume with the job description and propose reviewable changes only. Preserve facts. Never invent skills, employment, dates, metrics, achievements, or responsibilities. Return JSON only: {"summarySuggestion":"","bulletSuggestions":[{"original":"","suggestion":"","reason":""}],"skillPriorities":[],"reorderSuggestions":[],"notes":""}. Every suggestion must be grounded in the resume text.\nResume: ${resumeToText(resume).slice(0, 18000)}\nJob description: ${jobDescription.slice(0, 12000)}`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json({
            summarySuggestion: data.summarySuggestion || '',
            bulletSuggestions: Array.isArray(data.bulletSuggestions) ? data.bulletSuggestions.slice(0, 10) : [],
            skillPriorities: Array.isArray(data.skillPriorities) ? data.skillPriorities.slice(0, 15) : [],
            reorderSuggestions: Array.isArray(data.reorderSuggestions) ? data.reorderSuggestions.slice(0, 10) : [],
            notes: data.notes || 'Review every suggestion before applying it.',
        });
    } catch (error) {
        console.error('AI tailoring error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue editing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.generateInterviewQuestions = async (req, res) => {
    const { targetRole, category = 'Behavioral', resumeContext = '' } = req.body;
    if (!targetRole?.trim()) return res.status(400).json({ message: 'Target role is required.' });
    const prompt = `Create five interview questions for a candidate targeting the role "${targetRole.trim()}" in the category "${category}". If resume context is supplied, use it only to make questions relevant; never invent details. Return JSON only: {"questions":[{"question":"","category":"","why":""}]}. Resume context: ${String(resumeContext).slice(0, 12000)}`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json({ questions: Array.isArray(data.questions) ? data.questions.slice(0, 5) : [] });
    } catch (error) {
        console.error('Interview question generation error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue preparing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.evaluateInterviewAnswer = async (req, res) => {
    const { targetRole, category = 'Behavioral', question, answer } = req.body;
    if (!targetRole?.trim() || !question?.trim() || !answer?.trim()) return res.status(400).json({ message: 'Target role, question, and answer are required.' });
    const prompt = `Evaluate this interview answer for a candidate targeting "${targetRole.trim()}". Category: ${category}. Question: ${question}. Answer: ${answer.slice(0, 10000)}. Do not invent facts or judge the candidate beyond the answer. Return JSON only: {"score":0,"strengths":[],"improvements":[],"feedback":"","followUpQuestion":""}. Score should be a transparent coaching signal from 0 to 100, not a hiring prediction.`;
    try {
        const data = cleanJsonResponse(await generateWithFallback(prompt));
        res.json({ score: Math.max(0, Math.min(100, Number(data.score) || 0)), strengths: Array.isArray(data.strengths) ? data.strengths.slice(0, 5) : [], improvements: Array.isArray(data.improvements) ? data.improvements.slice(0, 5) : [], feedback: data.feedback || '', followUpQuestion: data.followUpQuestion || '' });
    } catch (error) {
        console.error('Interview evaluation error:', error.message);
        res.status(503).json({ message: 'AI is temporarily unavailable. You can continue preparing manually.', code: 'AI_PROVIDER_UNAVAILABLE' });
    }
};

exports.importResume = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Please upload a PDF or DOCX resume.' });
    try {
        const resume = await parseResumeFile(req.file);
        res.json({ resume, filename: req.file.originalname });
    } catch (error) {
        console.error('Resume import error:', error.message);
        res.status(422).json({ message: 'Unable to read this file. Please upload a valid PDF or DOCX.' });
    }
};

const addDocxSection = (children, title, entries = []) => {
    const values = entries.filter(Boolean);
    if (!values.length) return;
    children.push(new Paragraph({ text: title.toUpperCase(), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 } }));
    values.forEach((entry) => children.push(new Paragraph({ children: [new TextRun({ text: String(entry), size: 21 })], spacing: { after: 90 } })));
};

exports.exportDocx = async (req, res) => {
    const { resume } = req.body;
    if (!resume) return res.status(400).json({ message: 'Resume data is required.' });
    try {
        const personal = resume.personalInfo || {};
        const children = [
            new Paragraph({ text: personal.fullName || 'Resume', heading: HeadingLevel.TITLE, spacing: { after: 80 } }),
            new Paragraph({ text: [personal.email, personal.phone, personal.address, personal.linkedin, personal.github, personal.website].filter(Boolean).join('  |  '), spacing: { after: 220 } }),
        ];
        addDocxSection(children, 'Professional Summary', [htmlToText(resume.summary)]);
        addDocxSection(children, 'Work Experience', (resume.experience || []).flatMap((item) => [`${item.position || ''}${item.company ? ` — ${item.company}` : ''}`, `${item.startDate || ''}${item.endDate ? ` – ${item.endDate}` : ''}`, htmlToText(item.description)]));
        addDocxSection(children, 'Education', (resume.education || []).flatMap((item) => [`${item.degree || ''}${item.institution || item.school ? ` — ${item.institution || item.school}` : ''}`, `${item.startDate || ''}${item.endDate ? ` – ${item.endDate}` : ''}`, htmlToText(item.description)]));
        addDocxSection(children, 'Skills', [(resume.skills || []).join(', ')]);
        addDocxSection(children, 'Projects', (resume.projects || []).flatMap((item) => [`${item.name || ''}${item.link ? ` — ${item.link}` : ''}`, htmlToText(item.description), (item.technologies || []).join(', ')]));
        addDocxSection(children, 'Certifications', (resume.certifications || []).map((item) => `${item.name || ''}${item.issuer ? ` — ${item.issuer}` : ''}${item.date ? ` (${item.date})` : ''}`));
        addDocxSection(children, 'Achievements', (resume.achievements || []).map((item) => item.name || item.description));
        const document = new Document({ sections: [{ properties: {}, children }] });
        const buffer = await Packer.toBuffer(document);
        const safeName = String(resume.title || 'Resume').replace(/[^a-z0-9-_ ]/gi, '').trim() || 'Resume';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}.docx"`);
        res.send(buffer);
    } catch (error) {
        console.error('DOCX export error:', error.message);
        res.status(500).json({ message: 'Unable to generate your DOCX. Please try again.' });
    }
};

exports.generateCoverLetter = async (req, res) => {
    const { jobRole, jobDescription, tone, userName, userTitle, companyName } = req.body;

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
    }

    const prompt = `You are a professional career coach. Write a compelling, structured cover letter for a user applying for the position of "${jobRole}".
    ${userName ? `User's Name: ${userName}` : ''}
    ${userTitle ? `User's Current Title: ${userTitle}` : ''}
    ${companyName ? `Target Company: ${companyName}` : ''}
    ${jobDescription ? `Job Description: "${jobDescription}"` : ''}
    Tone: ${tone || 'Professional'}

    Return a JSON object with this exact structure:
    {
      "subject": "Subject line for the application",
      "salutation": "Formal salutation (e.g., Dear Hiring Manager,)",
      "introduction": "Engaging first paragraph expressing interest and enthusiasm",
      "bodyParagraph1": "Focus on key skills and professional achievements relevant to the role",
      "bodyParagraph2": "Explain why the candidate is a great fit for this specific company",
      "conclusion": "Summary and call to action for an interview",
      "closing": "Professional sign-off (e.g., Sincerely,)"
    }
    Return ONLY the JSON object, no markdown, no preamble.`;

    try {
        let text;
        try {
            // Try Gemini first
            text = await callGemini(prompt);
        } catch (geminiError) {
            console.log("AI: Gemini failed, falling back to Manus AI...");
            try {
                // Fallback to Manus AI
                text = await callManus(prompt, true);
            } catch (manusError) {
                console.log("AI: Manus AI failed, falling back to DeepSeek...");
                try {
                    // Fallback to DeepSeek
                    text = await callDeepSeek(prompt, true);
                } catch (deepSeekError) {
                    console.log("AI: DeepSeek failed, falling back to Groq...");
                    // Fallback to Groq
                    text = await callGroq(prompt, true);
                }
            }
        }

        // Clean up text if it contains markdown code blocks
        let jsonStr = text;
        if (text.includes('```')) {
            const matches = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            jsonStr = matches ? matches[1] : text.replace(/```json/gi, '').replace(/```/g, '').trim();
        }
        
        jsonStr = jsonStr.trim();

        try {
            const data = JSON.parse(jsonStr);
            res.json(data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError.message);
            // Fallback for non-JSON responses
            res.json({
                subject: `Application for ${jobRole}`,
                salutation: "Dear Hiring Manager,",
                introduction: text.substring(0, 200) + "...",
                bodyParagraph1: "...",
                bodyParagraph2: "...",
                conclusion: "...",
                closing: "Sincerely,"
            });
        }
    } catch (error) {
        console.error("Cover Letter Generation Error:", error.message);
        res.status(503).json({
            message: "AI cover-letter generation is temporarily unavailable. Please try again shortly.",
            code: "AI_PROVIDER_UNAVAILABLE"
        });
    }
};

