Project HOPE is an AI-integrated mental wellness platform designed to provide users with a supportive and accessible digital space for emotional well-being.

It combines an AI-powered conversational companion with mood tracking, journaling, relaxation activities, motivational content, and curated wellness resources in one platform.

"A little hope can make a big difference." 🌱
✨ Features
🤖 HOPE AI

An AI-powered conversational companion integrated with the Google Gemini API to provide supportive and empathetic responses.

💬 AI Chat

Users can interact with HOPE AI through a dedicated chat interface and maintain conversation context.

😊 Mood Tracking

Users can record and monitor their moods to become more aware of their emotional patterns.

📖 Journal

A personal space where users can write and reflect on their thoughts and experiences.
📚 HOPE Resources

A dedicated resource library containing:

Mental wellness books
YouTube videos
Spotify playlists
Meditation resources
🌱 Comfort & Self-Care

Simple activities and suggestions such as breathing exercises, grounding exercises, affirmations, and calming activities.

👤 User Features

🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Database
MongoDB
Mongoose
MongoDB Atlas for cloud deployment
AI
Google Gemini API
Authentication
bcrypt
JSON Web Token (JWT)
Development Tools
Visual Studio Code
Git
GitHub
🏗️ Architecture
                    ┌──────────────────┐
                    │     User         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Project HOPE UI  │
                    │ HTML/CSS/JS      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js +        │
                    │ Express Backend  │
                    └───────┬───┬──────┘
                            │   │
                 ┌──────────┘   └──────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │  Gemini API     │       │    MongoDB      │
        │    HOPE AI      │       │ User/Chat Data  │
        └─────────────────┘       └─────────────────┘
📁 Project Structure
Project-HOPE/
│
├── dashboard.html
├── login.html
├── resources.html
├── chat.html
├── profile.html
├── settings.html
│
├── css/
│   ├── dashboard.css
│   ├── resources.css
│   └── ...
│
├── js/
│   ├── dashboard.js
│   ├── resources.js
│   └── ...
│
├── server/
│   ├── server.js
│   ├── models/
│   ├── package.json
│   └── .env
│
└── README.md
Node.js
Express.js
User login/signup and personalized sections for managing the Project HOPE experience.
Trusted mental health websites


