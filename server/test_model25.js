const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

async function testModel25() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API key found in server/.env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("test");
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (e) {
        console.error("Error", e.message);
    }
}

testModel25();
