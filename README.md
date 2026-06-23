# College Helpdesk Chatbot

An AI-powered, retrieval-based chatbot for a college website. Built with React, TypeScript, TanStack Start, and Tailwind CSS.

## Features

- 🤖 Retrieval-based chatbot with case-insensitive multi-pattern matching
- 💬 Modern chat UI with typing indicator, auto-scroll, and timestamps
- 🧠 Suggested questions for new users + friendly fallback responses
- 💾 Chat history persisted to `localStorage` (restored on refresh)
- 📊 Live session stats (sent, responses, unanswered)
- 🧪 Testing Dashboard with sample queries and coverage report
- 📱 Fully responsive (desktop, tablet, mobile)
- 📝 About page documenting objective, tech, and features

## Knowledge base

Edit `src/lib/chatbot-kb.ts` to add or change intents, patterns, and responses.

## Project structure

```
src/
├── components/
│   ├── ChatPanel.tsx        # Chat UI, composer, stats
│   └── SiteHeader.tsx       # Top navigation
├── lib/
│   ├── chatbot-kb.ts        # Knowledge base + matcher
│   └── chat-storage.ts      # localStorage helpers
└── routes/
    ├── __root.tsx           # App shell
    ├── index.tsx            # Chat page (/)
    ├── testing.tsx          # Testing dashboard (/testing)
    └── about.tsx            # About page (/about)
```

## Scripts

- `bun dev` — start the dev server
- `bun run build` — production build

## Internship requirements covered

1. ✅ AI-powered chatbot design and implementation
2. ✅ Instant responses to user queries
3. ✅ Trained with predefined input patterns and responses
4. ✅ Integrated into a professional website interface
5. ✅ Testing dashboard + optimization (clean, reusable components)
6. ✅ Production-ready and GitHub-ready
