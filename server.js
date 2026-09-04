const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Chat = require("./models/Chat");
const bcrypt = require("bcrypt");
const User = require("./models/User");

require("dotenv").config();
console.log("API Loaded:", !!process.env.GEMINI_API_KEY);

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/projecthope")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));
const conversations = {};

app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Project HOPE Backend is Running 🌿");
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are filled
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save to MongoDB
        await newUser.save();

        res.status(201).json({
            message: "Account created successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
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
await Chat.create({
    userId,
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
   console.log("Using model: gemini-flash-latest");

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

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

const reply =
    response.text ||
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response.";

res.json({
    reply
});

conversations[userId].push({
    role: "model",
    text: reply
});

await Chat.create({
    userId,
    role: "model",
    text: reply
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