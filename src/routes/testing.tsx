import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { findResponse } from "@/lib/chatbot-kb";

export const Route = createFileRoute("/testing")({
  head: () => ({
    meta: [
      { title: "Testing Dashboard — College Helpdesk Chatbot" },
      {
        name: "description",
        content:
          "Run sample queries against the chatbot, review response coverage, and inspect chatbot performance.",
      },
    ],
  }),
  component: TestingPage,
});

const SAMPLE_QUERIES = [
  "hi",
  "how to apply",
  "courses available",
  "fee structure",
  "scholarship",
  "hostel",
  "placement opportunities",
  "contact number",
  "library timings",
  "thank you",
  "what is the weather today",
  "do you offer pizza",
];

interface Result {
  query: string;
  response: string;
  matched: boolean;
}

function TestingPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [ran, setRan] = useState(false);

  function runTests() {
    const next: Result[] = SAMPLE_QUERIES.map((q) => {
      const match = findResponse(q);
      return {
        query: q,
        response: match?.response ?? "(fallback)",
        matched: Boolean(match),
      };
    });
    setResults(next);
    setRan(true);
  }

  const summary = useMemo(() => {
    const total = results.length;
    const success = results.filter((r) => r.matched).length;
    const unanswered = total - success;
    const rate = total ? Math.round((success / total) * 100) : 0;
    return { total, success, unanswered, rate };
  }, [results]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Testing Dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Run a batch of sample queries against the chatbot to verify coverage and review
            performance.
          </p>
        </div>
        <Button onClick={runTests} size="lg">
          <PlayCircle className="h-4 w-4" />
          Run sample tests
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total queries" value={summary.total} />
        <SummaryCard label="Successful" value={summary.success} tone="success" />
        <SummaryCard label="Unanswered" value={summary.unanswered} tone="danger" />
        <SummaryCard label="Coverage" value={`${summary.rate}%`} tone="primary" />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Sample query results</h2>
          <p className="text-xs text-muted-foreground">
            {ran
              ? "Showing results from the last test run."
              : "Click \u201CRun sample tests\u201D to populate this table."}
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Query</th>
                <th className="px-5 py-3 font-medium">Response</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">
                    No tests run yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.query} className="border-t border-border">
                    <td className="px-5 py-3">
                      {r.matched ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Matched</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Fallback</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{r.query}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.response}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {ran && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Performance summary</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The chatbot successfully matched <strong className="text-foreground">{summary.success}</strong> out of{" "}
            <strong className="text-foreground">{summary.total}</strong> sample queries
            ({summary.rate}% coverage). {summary.unanswered} queries fell through to the fallback
            response, which is expected for out-of-scope questions and helps surface gaps in the
            knowledge base.
          </p>
        </section>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "success" | "danger" | "primary";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tabular-nums",
          tone === "success" && "text-green-600",
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
