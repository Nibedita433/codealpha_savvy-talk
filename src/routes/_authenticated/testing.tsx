import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { findResponse } from "@/lib/chatbot-kb";
import { RequireAdmin } from "@/components/RequireAdmin";

export const Route = createFileRoute("/_authenticated/testing")({
  head: () => ({
    meta: [
      { title: "Testing Dashboard — College Helpdesk Chatbot" },
      {
        name: "description",
        content: "20+ predefined test cases with pass/fail breakdown and accuracy percentage.",
      },
    ],
  }),
  component: () => (
    <RequireAdmin>
      <TestingPage />
    </RequireAdmin>
  ),
});

const TEST_CASES: { query: string; expected: string | null }[] = [
  { query: "hi", expected: "greeting" },
  { query: "hello there", expected: "greeting" },
  { query: "good morning", expected: "greeting" },
  { query: "how to apply for admission", expected: "admission" },
  { query: "what is the admission process", expected: "admission" },
  { query: "courses available", expected: "courses" },
  { query: "what programs do you offer", expected: "courses" },
  { query: "fee structure", expected: "fees" },
  { query: "how much is the tuition", expected: "fees" },
  { query: "any scholarships", expected: "scholarship" },
  { query: "do you provide financial aid", expected: "scholarship" },
  { query: "hostel facility", expected: "hostel" },
  { query: "accommodation for boys", expected: "hostel" },
  { query: "placement record", expected: "placement" },
  { query: "which companies recruit here", expected: "placement" },
  { query: "contact number", expected: "contact" },
  { query: "library timings", expected: "library" },
  { query: "college working hours", expected: "timing" },
  { query: "when are exams held", expected: "exam" },
  { query: "do you have bus transport", expected: "transport" },
  { query: "tell me about the fest", expected: "events" },
  { query: "faculty qualifications", expected: "faculty" },
  { query: "thank you", expected: "bye" },
  { query: "do you sell pizza", expected: null },
  { query: "what is the weather today", expected: null },
];

interface Result {
  query: string;
  expected: string | null;
  actual: string | null;
  confidence: number;
  passed: boolean;
}

function TestingPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [ran, setRan] = useState(false);

  function runTests() {
    const next: Result[] = TEST_CASES.map((tc) => {
      const m = findResponse(tc.query);
      const actual = m?.intent ?? null;
      return {
        query: tc.query,
        expected: tc.expected,
        actual,
        confidence: m?.confidence ?? 0,
        passed: actual === tc.expected,
      };
    });
    setResults(next);
    setRan(true);
  }

  const summary = useMemo(() => {
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const failed = total - passed;
    const accuracy = total ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, accuracy };
  }, [results]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Testing Dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Runs {TEST_CASES.length} predefined test cases against the chatbot's intent recognizer
            and reports pass/fail counts and accuracy.
          </p>
        </div>
        <Button onClick={runTests} size="lg">
          <PlayCircle className="h-4 w-4" />
          Run all tests
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Tests executed" value={summary.total} />
        <SummaryCard label="Passed" value={summary.passed} tone="success" />
        <SummaryCard label="Failed" value={summary.failed} tone="danger" />
        <SummaryCard label="Accuracy" value={`${summary.accuracy}%`} tone="primary" />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Test results</h2>
          <p className="text-xs text-muted-foreground">
            {ran ? "Showing results from the last test run." : "Click \u201CRun all tests\u201D to populate this table."}
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Query</th>
                <th className="px-5 py-3 font-medium">Expected</th>
                <th className="px-5 py-3 font-medium">Actual</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No tests run yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.query} className="border-t border-border">
                    <td className="px-5 py-3">
                      {r.passed ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{r.query}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.expected ?? "(fallback)"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.actual ?? "(fallback)"}</td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{Math.round(r.confidence * 100)}%</td>
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
            The chatbot passed <strong className="text-foreground">{summary.passed}</strong> of{" "}
            <strong className="text-foreground">{summary.total}</strong> test cases — an accuracy of{" "}
            <strong className="text-foreground">{summary.accuracy}%</strong>. Failed cases indicate
            opportunities to broaden the intent's pattern coverage.
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
