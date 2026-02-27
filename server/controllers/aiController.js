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

        // Primary model is gemini-1.5-flash which is fast and reliable
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"];
        let result = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`AI: Attempting generation with model: ${modelName}...`);
                
                // Configure model
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    generationConfig: { 
                        responseMimeType: "application/json",
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                    }
                });

                const prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
                Generate a professional resume data set in JSON format with exactly this structure:
                {
                  "summary": "2-3 sentence professional summary",
                  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
                  "bullets": ["High-impact bullet point 1", "High-impact bullet point 2", "High-impact bullet point 3", "High-impact bullet point 4"]
                }
                Use strong action verbs and metrics-driven language for the bullets.`;

                result = await model.generateContent(prompt);
                
                if (result && result.response) {
                    console.log(`AI: Success with model: ${modelName}`);
                    break;
                }
            } catch (err) {
                lastError = err;
                console.error(`AI: Attempt with ${modelName} failed:`, err.message);
                // If it's a 404 or model not found, we continue to next model
                // If it's a 403 (Invalid Key) or 429 (Quota), it might fail for all, but we try anyway
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
