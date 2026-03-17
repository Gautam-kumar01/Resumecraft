const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

async function testModel() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API key found in server/.env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent("test");
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (e) {
        require('fs').writeFileSync('error.json', JSON.stringify({ message: e.message, status: e.status, stack: e.stack }, null, 2));
    }
}

testModel();
