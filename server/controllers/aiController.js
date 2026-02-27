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

        // Try multiple models in case one is deprecated or unavailable
        const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
        let result = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                // Try with and without JSON constraint as a fallback
                let model;
                let prompt;
                
                if (modelName.includes('flash')) {
                    model = genAI.getGenerativeModel({ 
                        model: modelName,
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
                    Generate a professional resume data set with the following structure:
                    {
                      "summary": "2-3 sentence professional summary",
                      "skills": ["skill1", "skill2", ...],
                      "bullets": ["bullet1", "bullet2", ...]
                    }
                    Focus on high-impact, metrics-driven language for the bullets.`;
                } else {
                    model = genAI.getGenerativeModel({ model: modelName });
                    prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
                    Please generate the following in JSON format:
                    1. "summary": A professional summary (2-3 sentences).
                    2. "skills": A list of 8-10 relevant technical and soft skills.
                    3. "bullets": A list of 4-5 impactful, metrics-driven resume bullet points for this role.

                    Return ONLY raw JSON, no markdown formatting. Example: {"summary": "...", "skills": [], "bullets": []}`;
                }

                result = await model.generateContent(prompt);
                if (result) {
                    console.log(`Success with model: ${modelName}`);
                    break;
                }
            } catch (err) {
                lastError = err;
                console.error(`Attempt with ${modelName} failed:`, err.message);
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
