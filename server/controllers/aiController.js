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
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `You are a professional resume writer. The user is applying for a job as a "${jobRole}".
                Please generate the following in JSON format:
                1. "summary": A professional summary (2-3 sentences).
                2. "skills": A list of 8-10 relevant technical and soft skills.
                3. "bullets": A list of 4-5 impactful, metrics-driven resume bullet points for this role.

                Return ONLY raw JSON, no markdown formatting.`;

                result = await model.generateContent(prompt);
                if (result) break; // Success!
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

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr);

        res.json(data);
    } catch (error) {
        console.error("AI Generation Error:", error.message || error);
        res.status(500).json({ message: "Failed to generate suggestions", error: error.message });
    }
};
