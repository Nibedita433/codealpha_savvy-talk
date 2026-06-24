import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Code2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Target,
  Layers,
  Workflow,
  Rocket,
  Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/about")({
  head: () => ({
    meta: [
      { title: "About — College Helpdesk Chatbot" },
      {
        name: "description",
        content:
          "Problem statement, objective, scope, architecture, working principle, and future enhancements for the AI-Powered College Helpdesk Chatbot.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">About this project</h1>
          <p className="mt-1 text-muted-foreground">AI-Powered College Helpdesk Chatbot — built for internship submission.</p>
        </div>
      </div>

      <Section icon={<Target className="h-5 w-5" />} title="Problem statement">
        College helpdesks face repetitive questions about admissions, courses, fees, hostel,
        scholarships, placements, and contact info — often outside office hours. Manual handling
        is slow, inconsistent, and time-consuming for staff.
      </Section>

      <Section icon={<Sparkles className="h-5 w-5" />} title="Objective">
        Build an AI-powered chatbot that provides instant, accurate answers to common student
        queries through a clean, accessible web interface — available 24×7 and easily extendable.
      </Section>

      <Section icon={<Layers className="h-5 w-5" />} title="Scope">
        <ul className="list-disc space-y-1 pl-5">
          <li>Covers 15+ intents across admissions, academics, facilities, and contact info</li>
          <li>Browser-only application — no backend or external API keys required</li>
          <li>Conversation history, analytics, and admin dashboard included</li>
          <li>Voice input, text-to-speech, and PDF export for accessibility</li>
        </ul>
      </Section>

      <Section icon={<Code2 className="h-5 w-5" />} title="Technologies used">
        <ul className="list-disc space-y-1 pl-5">
          <li>React 19 + TypeScript</li>
          <li>TanStack Start &amp; TanStack Router (file-based routing)</li>
          <li>Tailwind CSS v4 with semantic design tokens (light/dark mode)</li>
          <li>Shadcn UI components &amp; Lucide icons</li>
          <li>Retrieval-based NLU with keyword scoring + confidence</li>
          <li>Browser Web Speech API (SpeechRecognition + SpeechSynthesis)</li>
          <li>localStorage for chat history, archives, and feedback</li>
        </ul>
      </Section>

      <Section icon={<Workflow className="h-5 w-5" />} title="System architecture">
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground">{`
 ┌─────────────────────────────┐
 │   React UI (ChatPanel)      │
 │  • messages, input, voice   │
 │  • feedback, search, export │
 └────────────┬────────────────┘
              │
              ▼
 ┌─────────────────────────────┐
 │  Intent Recognizer (lib)    │
 │  • tokenize + stop-words    │
 │  • per-intent overlap score │
 │  • confidence threshold     │
 └────────────┬────────────────┘
              │
              ▼
 ┌─────────────────────────────┐
 │  Knowledge Base (KB array)  │
 │  intents + patterns + reply │
 └────────────┬────────────────┘
              │
              ▼
 ┌─────────────────────────────┐
 │  localStorage persistence   │
 │  chat • archives • feedback │
 └─────────────────────────────┘
`}</pre>
      </Section>

      <Section icon={<Bot className="h-5 w-5" />} title="Working principle">
        <ol className="list-decimal space-y-1 pl-5">
          <li>User types or speaks a query.</li>
          <li>Text is normalized (lowercased, punctuation stripped, stop-words removed).</li>
          <li>Each intent's patterns are scored by token overlap + substring match.</li>
          <li>The highest-scoring intent above a confidence threshold is selected.</li>
          <li>The matched response is rendered; optionally spoken via TTS.</li>
          <li>The user can rate the answer (👍/👎); feedback is stored for analytics.</li>
        </ol>
      </Section>

      <Section icon={<ShieldCheck className="h-5 w-5" />} title="Advantages">
        <ul className="list-disc space-y-1 pl-5">
          <li>Instant 24×7 responses reduce helpdesk workload</li>
          <li>Runs entirely in the browser — fast, private, and cost-free</li>
          <li>Easily extendable knowledge base (single TypeScript file)</li>
          <li>Accessible: voice input, screen-reader-friendly markup, dark mode</li>
          <li>Built-in admin and testing dashboards for evaluation</li>
        </ul>
      </Section>

      <Section icon={<Rocket className="h-5 w-5" />} title="Future enhancements">
        <ul className="list-disc space-y-1 pl-5">
          <li>LLM-powered fallback (OpenAI / Gemini) for unanswered queries</li>
          <li>Multilingual support (Hindi, regional languages)</li>
          <li>Authentication + per-student personalized answers</li>
          <li>Server-side analytics with a real database</li>
          <li>Integration with college ERP and student information systems</li>
        </ul>
      </Section>

      <Section icon={<Lightbulb className="h-5 w-5" />} title="Features delivered">
        <ul className="list-disc space-y-1 pl-5">
          <li>Intent recognition with confidence score per response</li>
          <li>Suggested questions, FAQ panel, search within history</li>
          <li>Voice-to-text input + text-to-speech output</li>
          <li>Conversation archiving + export as text or PDF</li>
          <li>👍/👎 feedback system + admin analytics dashboard</li>
          <li>20+ test cases with pass/fail + accuracy report</li>
          <li>Dark/light mode toggle + fully responsive layout</li>
        </ul>
      </Section>

      <Section icon={<GraduationCap className="h-5 w-5" />} title="Internship requirements covered">
        <ul className="list-disc space-y-1 pl-5">
          <li>✅ Designed and developed an AI-powered chatbot</li>
          <li>✅ Provides instant responses to user queries</li>
          <li>✅ Trained using predefined input patterns &amp; responses</li>
          <li>✅ Integrated into a professional website interface</li>
          <li>✅ Includes a Testing &amp; Optimization dashboard (20+ cases)</li>
          <li>✅ Admin dashboard with analytics and performance metrics</li>
          <li>✅ Suitable for GitHub submission and project demonstration</li>
        </ul>
      </Section>
    </main>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
