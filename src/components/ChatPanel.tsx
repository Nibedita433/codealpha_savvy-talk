import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Bot, Send, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FALLBACK, SUGGESTIONS, WELCOME, findResponse } from "@/lib/chatbot-kb";
import {
  type ChatMessage,
  clearMessages,
  computeStats,
  loadMessages,
  saveMessages,
} from "@/lib/chat-storage";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate from localStorage (or seed welcome message)
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length === 0) {
      const welcome: ChatMessage = {
        id: uid(),
        role: "bot",
        text: WELCOME,
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      saveMessages([welcome]);
    } else {
      setMessages(stored);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus composer
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const stats = useMemo(() => computeStats(messages), [messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate small delay for typing indicator
    window.setTimeout(() => {
      const match = findResponse(trimmed);
      const botMsg: ChatMessage = {
        id: uid(),
        role: "bot",
        text: match?.response ?? FALLBACK,
        timestamp: Date.now(),
        unanswered: !match,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      textareaRef.current?.focus();
    }, 450);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleClear() {
    clearMessages();
    const welcome: ChatMessage = {
      id: uid(),
      role: "bot",
      text: WELCOME,
      timestamp: Date.now(),
    };
    setMessages([welcome]);
    saveMessages([welcome]);
    textareaRef.current?.focus();
  }

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* Chat card */}
      <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Helpdesk Bot</p>
              <p className="text-xs text-muted-foreground">Online • Ready to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isTyping && <TypingIndicator />}

            {showSuggestions && !isTyping && (
              <div className="pt-2">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested questions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} className="border-t border-border bg-background p-3">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about admissions, courses, fees..."
              rows={1}
              className="max-h-32 min-h-[44px] resize-none"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Press Enter to send • Shift+Enter for a new line
          </p>
        </form>
      </div>

      {/* Stats sidebar */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Session stats</h3>
          <p className="mt-1 text-xs text-muted-foreground">Live counts from this conversation.</p>
          <dl className="mt-4 space-y-3">
            <StatRow label="Messages sent" value={stats.userMessages} />
            <StatRow label="Bot responses" value={stats.botResponses} />
            <StatRow label="Unanswered" value={stats.unanswered} accent={stats.unanswered > 0} />
          </dl>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Try asking</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• "What courses are available?"</li>
            <li>• "Tell me about scholarships"</li>
            <li>• "Hostel facilities?"</li>
            <li>• "How do I apply?"</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function StatRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-lg font-semibold tabular-nums",
          accent ? "text-destructive" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={cn("flex max-w-[78%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground",
          )}
        >
          {message.text}
        </div>
        <span className="px-1 text-[10px] text-muted-foreground">
          {formatTime(message.timestamp)}
        </span>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}
