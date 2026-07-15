const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("API Loaded:", !!process.env.GEMINI_API_KEY);

const { GoogleGenAI } = require("@google/genai");

const app = express();
const conversations = {};

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Project HOPE Backend is Running 🌿");
});

app.post("/chat", async (req, res) => {
    try {
        const { message, userId = "default-user" } = req.body;
        if (!conversations[userId]) {
    conversations[userId] = [];
}

        if (!message) {
            return res.status(400).json({
                reply: "Please enter a message."
            });
        }

        conversations[userId].push({
    role: "user",
    text: message
});

        const chatHistory = conversations[userId].map(msg => ({
    role: msg.role,
    parts: [
        {
            text: msg.text
        }
    ]
}));

    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",

    systemInstruction: `
You are HOPE AI, the AI companion of Project HOPE.

Your purpose is to support users emotionally with empathy, kindness and calmness.

Rules:
- Always introduce yourself as HOPE AI only when the conversation begins.
- Never be cold or robotic.
- Keep responses supportive.
- Never diagnose medical conditions.
- Encourage professional help when necessary.
- Keep answers concise unless asked otherwise.
`,

    contents: chatHistory
});
        

        res.json({
            reply: response.text
        });

        conversations[userId].push({
    role: "model",
    text: response.text
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Something went wrong while talking to Gemini."
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});