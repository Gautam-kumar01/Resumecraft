const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const https = require('https');

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

// Helper to call Gemini API
const callGemini = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key is missing");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
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
            const model = genAI.getGenerativeModel({ model: modelName, safetySettings });
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
    const { jobRole } = req.body;

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
    }

    const prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
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
            console.log("AI: Gemini failed, falling back to DeepSeek...");
            try {
                // Fallback to DeepSeek
                text = await callDeepSeek(prompt, true);
            } catch (deepSeekError) {
                console.log("AI: DeepSeek failed, falling back to Groq...");
                // Fallback to Groq
                text = await callGroq(prompt, true);
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
        res.status(500).json({ 
            message: "Failed to generate suggestions", 
            error: error.message 
        });
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
            console.log("AI: Gemini failed, falling back to DeepSeek...");
            try {
                // Fallback to DeepSeek
                text = await callDeepSeek(prompt, true);
            } catch (deepSeekError) {
                console.log("AI: DeepSeek failed, falling back to Groq...");
                // Fallback to Groq
                text = await callGroq(prompt, true);
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
        res.status(500).json({ 
            message: "Failed to generate cover letter", 
            error: error.message 
        });
    }
};

