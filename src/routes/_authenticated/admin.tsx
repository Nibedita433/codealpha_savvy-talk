import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, MessageSquare, ShieldAlert, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clearConversations,
  computeAnalytics,
  loadConversations,
  type Analytics,
  type ArchivedConversation,
} from "@/lib/chat-storage";
import { RequireAdmin } from "@/components/RequireAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — College Helpdesk Chatbot" },
      {
        name: "description",
        content: "Conversation analytics, unanswered queries, and performance metrics for the College Helpdesk Chatbot.",
      },
    ],
  }),
  component: () => (
    <RequireAdmin>
      <AdminPage />
    </RequireAdmin>
  ),
});

function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [conversations, setConversations] = useState<ArchivedConversation[]>([]);

  function refresh() {
    setAnalytics(computeAnalytics());
    setConversations(loadConversations());
  }

  useEffect(refresh, []);

  if (!analytics) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Overview of conversations, user queries, and chatbot performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>Refresh</Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Delete all archived conversations?")) {
                clearConversations();
                refresh();
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear archives
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<MessageSquare className="h-4 w-4" />} label="Total conversations" value={analytics.totalConversations} />
        <MetricCard icon={<BarChart3 className="h-4 w-4" />} label="Total user queries" value={analytics.totalUserQueries} />
        <MetricCard
          icon={<ShieldAlert className="h-4 w-4" />}
          label="Unanswered"
          value={analytics.unanswered}
          tone={analytics.unanswered > 0 ? "danger" : "default"}
        />
        <MetricCard
          icon={<ThumbsUp className="h-4 w-4" />}
          label="Satisfaction"
          value={`${analytics.satisfactionRate}%`}
          tone="primary"
        />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Top user queries</h2>
          <p className="mt-1 text-xs text-muted-foreground">Most frequently asked questions across all conversations.</p>
          {analytics.topQueries.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No queries yet.</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {analytics.topQueries.map((q, i) => (
                <li key={q.text} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{q.text}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{q.count}×</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Performance metrics</h2>
          <p className="mt-1 text-xs text-muted-foreground">Health snapshot of the chatbot's knowledge base.</p>
          <dl className="mt-4 space-y-3 text-sm">
            <MetricRow
              label="Answered rate"
              value={`${analytics.totalUserQueries === 0 ? 0 : Math.round(((analytics.totalUserQueries - analytics.unanswered) / analytics.totalUserQueries) * 100)}%`}
            />
            <MetricRow label="User satisfaction" value={`${analytics.satisfactionRate}%`} />
            <MetricRow label="Archived chats" value={String(conversations.length)} />
            <MetricRow label="Avg messages/chat" value={String(avgMessages(conversations))} />
          </dl>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Recent conversations</h2>
          <p className="text-xs text-muted-foreground">Past chats archived when "Clear" was used.</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Started</th>
                <th className="px-5 py-3 font-medium">Messages</th>
                <th className="px-5 py-3 font-medium">First user query</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">
                    No archived conversations yet.
                  </td>
                </tr>
              ) : (
                conversations.slice(0, 10).map((c) => {
                  const first = c.messages.find((m) => m.role === "user");
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-5 py-3 text-muted-foreground">{new Date(c.startedAt).toLocaleString()}</td>
                      <td className="px-5 py-3 text-foreground">{c.messages.length}</td>
                      <td className="px-5 py-3 text-foreground">{first?.text ?? "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function avgMessages(convs: ArchivedConversation[]) {
  if (convs.length === 0) return 0;
  return Math.round(convs.reduce((a, c) => a + c.messages.length, 0) / convs.length);
}

function MetricCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone?: "default" | "danger" | "primary";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={cn(
          "mt-3 text-3xl font-bold tabular-nums",
          tone === "danger" && "text-destructive",
          tone === "primary" && "text-primary",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground tabular-nums">{value}</dd>
    </div>
  );
}
