const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

exports.getSuggestions = async (req, res) => {
    const { jobRole } = req.body;

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API Key is missing" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Even more robust model list including older stable versions
        const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        let result = null;
        let lastError = null;

        // Safety settings to prevent false positive blocks for professional content
        const safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`AI: Attempting generation with model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    safetySettings 
                });

                const prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
                Return a JSON object with this exact structure:
                {
                  "summary": "2-3 sentence professional summary",
                  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
                  "bullets": ["Impactful bullet point 1", "Impactful bullet point 2", "Impactful bullet point 3", "Impactful bullet point 4"]
                }
                Return ONLY the JSON, no markdown.`;

                result = await model.generateContent(prompt);
                
                if (result && result.response) {
                    console.log(`AI: Success with model: ${modelName}`);
                    break;
                }
            } catch (err) {
                lastError = err;
                console.error(`AI: Attempt with ${modelName} failed:`, err.message);
                
                // If it's a critical auth/quota issue, no point trying other models
                if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('403') || err.message.includes('API key')) {
                    break;
                }
            }
        }

        if (!result) {
            throw lastError || new Error("All models failed");
        }

        const response = await result.response;
        const text = response.text();
        console.log("AI Raw Response:", text);

        // Clean up markdown code blocks if present
        // More robust cleaning for JSON
        let jsonStr = text;
        if (text.includes('```')) {
            const matches = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            if (matches && matches[1]) {
                jsonStr = matches[1];
            } else {
                jsonStr = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            }
        }
        
        jsonStr = jsonStr.trim();

        try {
            const data = JSON.parse(jsonStr);
            res.json(data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError.message);
            console.error("Attempted to parse:", jsonStr);
            throw new Error("AI returned invalid JSON format");
        }
    } catch (error) {
        console.error("AI Generation Error:", error.message || error);
        res.status(500).json({ 
            message: "Failed to generate suggestions", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.generateCoverLetter = async (req, res) => {
    const { jobRole, jobDescription, tone } = req.body;

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API Key is missing" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try the same models as getSuggestions for consistency and robustness
        const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        let result = null;
        let lastError = null;

        // Safety settings to prevent false positive blocks for professional content
        const safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`AI (CL): Attempting generation with model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    safetySettings 
                });

                const prompt = `You are a professional career coach. Write a compelling cover letter for a user applying for the position of "${jobRole}".
                ${jobDescription ? `The job requirements are: "${jobDescription}".` : ''}
                The tone of the letter should be "${tone || 'Professional'}".
                Make it persuasive, highlight relevant skills for this role, and keep it under 300 words.
                Return ONLY the cover letter text, no markdown, no placeholders like [Your Name] unless absolutely necessary for contact info.`;

                result = await model.generateContent(prompt);
                
                if (result && result.response) {
                    console.log(`AI (CL): Success with model: ${modelName}`);
                    break;
                }
            } catch (err) {
                lastError = err;
                console.error(`AI (CL): Attempt with ${modelName} failed:`, err.message);
                if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('403') || err.message.includes('API key')) {
                    break;
                }
            }
        }

        if (!result) {
            throw lastError || new Error("All AI models failed to generate content");
        }

        const response = await result.response;
        const text = response.text();

        res.json({ coverLetter: text.trim() });
    } catch (error) {
        console.error("Cover Letter Generation Error:", error.message || error);
        res.status(500).json({ 
            message: "Failed to generate cover letter", 
            error: error.message 
        });
    }
};
