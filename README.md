# AI Calendar Assistant

An AI-powered meeting scheduling system built with n8n, Google Calendar API, and a lightweight HTML/JavaScript frontend.

This project helps users quickly find available meeting times, get AI-assisted recommendations, and instantly book meetings directly into Google Calendar—without back-and-forth emails.

✨ Key Features:
  - 📅 Automatic availability detection from Google Calendar
  - 🤖 AI-assisted time recommendations (powered by Groq)
  - ⚡ Instant meeting booking into Google Calendar
  - 🖥️ Simple web interface (HTML, CSS, Vanilla JS)
  - 🔒 No database required
  - 🔧 No login required (designed for internal or controlled use)

Meeting changes or cancellations are handled directly via Google Calendar to keep the system simple and reliable.

🧠 How It Works (High Level)
  1. User selects a date range on the frontend
  2. Backend (n8n) checks Google Calendar availability
  3. Free time slots are calculated based on working hours
  4. AI optionally ranks the best meeting times
  5. User selects a slot and enters meeting details
  6. The meeting is created instantly in Google Calendar
  7. The guest receives an automatic calendar invitation

🛠️ Tech Stack
  - Automation: n8n
  - Calendar: Google Calendar API
  - AI Reasoning: Groq API
  - Frontend: HTML, CSS, Vanilla JavaScript
  - Hosting: GitHub Pages (frontend)

🚀 Demo Setup Requirements
To run or demo this workflow, you will need:
  - A Google account with Calendar access
  - Google Calendar API enabled
  - n8n instance (cloud or self-hosted)
  - Google OAuth credentials configured in n8n
  - Groq API key (for AI-powered recommendations)
  - Frontend deployed (e.g. GitHub Pages or other static hosting)
The complete n8n workflow is exported as JSON and included in this repository.

📂 Repository Structure
/index.html        # Frontend UI
/styles.css        # Frontend styling
/script.js         # Frontend logic
/workflow.json     # n8n workflow export
/README.md
/LICENSE

📌 Notes
  - This project is designed for internal tools, demos, or controlled environments
  - Webhook URLs and credentials should be replaced with your own setup
  - The repository is safe to share publicly (no secrets included)

📄 License
  MIT License
