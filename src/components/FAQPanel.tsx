import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/chatbot-kb";
import { cn } from "@/lib/utils";

interface Props {
  onAsk?: (question: string) => void;
}

export function FAQPanel({ onAsk }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Frequently asked</h3>
      <p className="mt-1 text-xs text-muted-foreground">Tap a question to send it to the bot.</p>
      <div className="mt-4 space-y-2">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q} className="rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-foreground"
              >
                <span>{faq.q}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                  <p>{faq.a}</p>
                  {onAsk && (
                    <button
                      type="button"
                      onClick={() => onAsk(faq.q)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Ask the bot →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
