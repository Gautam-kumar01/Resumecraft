const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

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
            return;
        }
        
        const data = await response.json();
        const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).map(m => m.name.replace('models/', ''));
        require('fs').writeFileSync('models.json', JSON.stringify(models, null, 2));
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

listModels();
