import { createFileRoute } from "@tanstack/react-router";
import { Bot, Code2, Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — College Helpdesk Chatbot" },
      {
        name: "description",
        content:
          "About the AI-powered College Helpdesk Chatbot — objective, technologies, features, and internship requirements covered.",
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
          <p className="mt-1 text-muted-foreground">
            AI-Powered College Helpdesk Chatbot — built for internship submission.
          </p>
        </div>
      </div>

      <Section icon={<Sparkles className="h-5 w-5" />} title="Project objective">
        <p>
          Build an AI-powered chatbot that provides instant responses to common student queries
          (admissions, courses, fees, hostel, placements, scholarships, library, and contact
          information) through a clean, professional web interface.
        </p>
      </Section>

      <Section icon={<Code2 className="h-5 w-5" />} title="Technologies used">
        <ul className="list-disc space-y-1 pl-5">
          <li>React 19 + TypeScript</li>
          <li>TanStack Start &amp; TanStack Router (file-based routing)</li>
          <li>Tailwind CSS v4 with semantic design tokens</li>
          <li>Shadcn UI components &amp; Lucide icons</li>
          <li>Retrieval-based NLU with pattern matching</li>
          <li>Browser localStorage for chat persistence</li>
        </ul>
      </Section>

      <Section icon={<Bot className="h-5 w-5" />} title="Features">
        <ul className="list-disc space-y-1 pl-5">
          <li>Welcome message and suggested questions for new users</li>
          <li>Case-insensitive matching with multiple pattern variations per intent</li>
          <li>Typing indicator and auto-scroll to latest message</li>
          <li>Per-message timestamps</li>
          <li>Clear chat button + history restored after page refresh</li>
          <li>Session statistics (sent, responses, unanswered)</li>
          <li>Testing Dashboard with sample queries and coverage report</li>
          <li>Fully responsive design — desktop, tablet, mobile</li>
        </ul>
      </Section>

      <Section icon={<ShieldCheck className="h-5 w-5" />} title="Benefits">
        <ul className="list-disc space-y-1 pl-5">
          <li>24/7 instant answers reduce helpdesk workload</li>
          <li>No backend or API keys required — fast and private</li>
          <li>Easily extendable knowledge base (see <code>src/lib/chatbot-kb.ts</code>)</li>
          <li>Clean, reusable component structure</li>
        </ul>
      </Section>

      <Section icon={<GraduationCap className="h-5 w-5" />} title="Internship requirements covered">
        <ul className="list-disc space-y-1 pl-5">
          <li>✅ Designed and developed an AI-powered chatbot</li>
          <li>✅ Provides instant responses to user queries</li>
          <li>✅ Trained using predefined input patterns &amp; responses</li>
          <li>✅ Integrated into a professional website interface</li>
          <li>✅ Includes a Testing &amp; Optimization dashboard</li>
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
