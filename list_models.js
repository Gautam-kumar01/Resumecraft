const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API key found in server/.env");
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error("HTTP Error", response.status, response.statusText);
            const text = await response.text();
            console.error(text);
            return;
        }
        
        const data = await response.json();
        console.log("Available generation models:");
        data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => {
            console.log(`- ${m.name.replace('models/', '')}`);
        });
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

listModels();
