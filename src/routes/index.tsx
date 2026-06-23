import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/ChatPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chat — College Helpdesk Chatbot" },
      {
        name: "description",
        content:
          "Chat with the College Helpdesk Bot for instant answers about admissions, courses, fees, hostel, scholarships, and placements.",
      },
      { property: "og:title", content: "College Helpdesk Chatbot" },
      {
        property: "og:description",
        content: "Instant answers for students — admissions, courses, fees, and more.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          College Helpdesk Chatbot
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          An AI-powered assistant for students and visitors. Ask about admissions, courses,
          scholarships, hostel, placements, and more — answers are instant.
        </p>
      </div>
      <ChatPanel />
    </main>
  );
}
