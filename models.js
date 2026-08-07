require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const result = await ai.models.list();

  console.dir(result, { depth: null });
}

main().catch(console.error);