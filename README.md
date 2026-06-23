# College Helpdesk Chatbot

A professional, AI-powered helpdesk chatbot for colleges — built with React 19, TypeScript, TanStack Start, and Tailwind CSS v4. Runs entirely in the browser.

## Project Overview

The College Helpdesk Chatbot answers common student questions (admissions, courses, fees, hostel, placements, scholarships, library, transport, exams, contact info) instantly, 24×7. It uses a retrieval-based intent recognizer with keyword scoring and a confidence threshold — no backend, no API keys, no cost.

## Features

- 🧠 **Intent recognition** with keyword scoring + per-response confidence %
- 💬 **Modern chat UI** — typing indicator, auto-scroll, timestamps, message bubbles
- 💡 **Suggested questions** below the input + a collapsible FAQ panel
- 🔍 **Search within chat history**
- 🎙️ **Voice-to-text** input (Web Speech API)
- 🔊 **Text-to-speech** for bot replies (toggleable)
- 👍👎 **Feedback system** on every bot response
- 📊 **Admin dashboard** — total conversations, total queries, unanswered, top FAQs, satisfaction rate
- 🧪 **Testing dashboard** — 20+ predefined test cases with pass/fail + accuracy %
- 💾 **Conversation history** — current chat + archived past chats
- 📥 **Export** chat history as `.txt` or printable PDF
- 🌗 **Dark / light mode** toggle (persisted)
- 📱 **Fully responsive** — desktop, tablet, mobile

## Screenshots

> Add screenshots here after running the app locally:
> - `docs/screenshots/chat.png` — chat interface
> - `docs/screenshots/admin.png` — admin dashboard
> - `docs/screenshots/testing.png` — testing dashboard
> - `docs/screenshots/dark-mode.png` — dark mode

## Installation Guide

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd college-helpdesk-chatbot

# 2. Install dependencies (Bun recommended)
bun install     # or: npm install

# 3. Start the dev server
bun dev         # or: npm run dev

# 4. Open the app
# http://localhost:8080
```

## Usage Guide

- **Chat (`/`)** — Ask any question. Use the mic button for voice input or the speaker icon to hear responses read aloud. Use the search bar to find past messages.
- **Admin (`/admin`)** — View total conversations, query counts, unanswered queries, top FAQs, and satisfaction rate.
- **Testing (`/testing`)** — Click "Run all tests" to execute 20+ predefined cases and see accuracy %.
- **About (`/about`)** — Problem statement, objective, scope, architecture, working principle.

To extend the bot, edit `src/lib/chatbot-kb.ts` and add a new entry to the `KB` array (id, label, patterns, response).

## Folder Structure

```
src/
├── components/
│   ├── ChatPanel.tsx        # Chat UI, voice, TTS, feedback, export, search
│   ├── FAQPanel.tsx         # Collapsible FAQ accordion
│   ├── SiteHeader.tsx       # Top navigation + theme toggle
│   ├── ThemeToggle.tsx      # Light/dark mode switch
│   └── ui/                  # shadcn primitives
├── lib/
│   ├── chatbot-kb.ts        # Knowledge base + intent recognizer
│   ├── chat-storage.ts      # localStorage + analytics
│   ├── export-chat.ts       # Text & PDF export
│   ├── speech.ts            # Web Speech API helpers
│   └── theme.ts             # Theme persistence
└── routes/
    ├── __root.tsx           # App shell
    ├── index.tsx            # Chat page          (/)
    ├── admin.tsx            # Admin dashboard    (/admin)
    ├── testing.tsx          # Testing dashboard  (/testing)
    └── about.tsx            # About page         (/about)
```

## Technologies Used

- **Framework**: React 19, TypeScript, TanStack Start, TanStack Router
- **Styling**: Tailwind CSS v4, shadcn/ui, Lucide icons
- **NLU**: Custom keyword-scoring intent recognizer
- **Speech**: Browser Web Speech API (SpeechRecognition, SpeechSynthesis)
- **Storage**: Browser localStorage
- **Build**: Vite 7, Bun

## Future Scope

- LLM-powered fallback (OpenAI / Gemini) for unmatched queries
- Multilingual support (Hindi, regional languages)
- Authentication + personalized student answers
- Server-side analytics with a real database
- Integration with college ERP / student information systems

## Deployment

The app is a standard Vite/TanStack Start project and deploys cleanly to **Vercel**, **Netlify**, or **GitHub Pages**:

```bash
bun run build
# Deploy the build output via your provider of choice.
```

## Author Information

Built as part of an internship submission for an AI-Powered College Helpdesk Chatbot.

- **Project**: AI-Powered College Helpdesk Chatbot
- **Author**: Your Name
- **Email**: your.email@example.com
- **GitHub**: https://github.com/your-username

## Internship requirements covered

1. ✅ AI-powered chatbot design and implementation
2. ✅ Instant responses to user queries
3. ✅ Trained with predefined input patterns and responses
4. ✅ Integrated into a professional website interface
5. ✅ Testing dashboard with 20+ cases (pass/fail + accuracy)
6. ✅ Admin dashboard with performance metrics
7. ✅ Production-ready and GitHub-ready
