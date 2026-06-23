import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Bot,
  Download,
  FileText,
  Mic,
  Search,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FALLBACK, SUGGESTIONS, WELCOME, findResponse } from "@/lib/chatbot-kb";
import {
  archiveConversation,
  clearMessages,
  computeStats,
  loadMessages,
  saveMessages,
  type ChatMessage,
  type Feedback,
} from "@/lib/chat-storage";
import { FAQPanel } from "@/components/FAQPanel";
import { exportAsPDF, exportAsText } from "@/lib/export-chat";
import { createRecognizer, isSpeechRecognitionSupported, speak, stopSpeaking } from "@/lib/speech";

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
  const [search, setSearch] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length === 0) {
      const welcome: ChatMessage = { id: uid(), role: "bot", text: WELCOME, timestamp: Date.now() };
      setMessages([welcome]);
      saveMessages([welcome]);
    } else {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const stats = useMemo(() => computeStats(messages), [messages]);

  const visibleMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter((m) => m.text.toLowerCase().includes(q));
  }, [messages, search]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", text: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const match = findResponse(trimmed);
      const botMsg: ChatMessage = {
        id: uid(),
        role: "bot",
        text: match?.response ?? FALLBACK,
        timestamp: Date.now(),
        unanswered: !match,
        intent: match?.intent,
        confidence: match?.confidence,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (ttsEnabled) speak(botMsg.text);
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
    // Archive current convo before clearing
    archiveConversation(messages);
    clearMessages();
    const welcome: ChatMessage = { id: uid(), role: "bot", text: WELCOME, timestamp: Date.now() };
    setMessages([welcome]);
    saveMessages([welcome]);
    stopSpeaking();
    textareaRef.current?.focus();
  }

  function handleFeedback(id: string, value: Feedback) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === value ? undefined : value } : m)),
    );
  }

  function toggleVoice() {
    if (!isSpeechRecognitionSupported()) {
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = createRecognizer(
      (text) => setInput((curr) => (curr ? `${curr} ${text}` : text)),
      () => setIsListening(false),
    );
    if (!rec) return;
    recognizerRef.current = rec;
    setIsListening(true);
    rec.start();
  }

  function toggleTts() {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) stopSpeaking();
  }

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Chat card */}
      <div className="flex h-[72vh] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-3">
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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={toggleTts} title="Read responses aloud">
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportAsText(messages)} title="Export as text">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportAsPDF(messages)} title="Export as PDF">
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
              title="Clear chat (archives the conversation)"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-border bg-background/40 px-3 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this conversation..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-4">
            {visibleMessages.map((m) => (
              <MessageBubble key={m.id} message={m} onFeedback={handleFeedback} />
            ))}
            {isTyping && <TypingIndicator />}

            {showSuggestions && !isTyping && !search && (
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
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "outline"}
              onClick={toggleVoice}
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
            </Button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Ask about admissions, courses, fees..."}
              rows={1}
              className="max-h-32 min-h-[44px] resize-none"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {/* Quick suggestions below input */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.slice(0, 5).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Press Enter to send • Shift+Enter for a new line
          </p>
        </form>
      </div>

      {/* Side panel */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Session stats</h3>
          <p className="mt-1 text-xs text-muted-foreground">Live counts from this conversation.</p>
          <dl className="mt-4 space-y-3">
            <StatRow label="Messages sent" value={stats.userMessages} />
            <StatRow label="Bot responses" value={stats.botResponses} />
            <StatRow label="Unanswered" value={stats.unanswered} accent={stats.unanswered > 0} />
            <StatRow label="👍 Helpful" value={stats.thumbsUp} />
            <StatRow label="👎 Not helpful" value={stats.thumbsDown} accent={stats.thumbsDown > 0} />
          </dl>
        </div>
        <FAQPanel onAsk={(q) => sendMessage(q)} />
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

function MessageBubble({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback: (id: string, value: Feedback) => void;
}) {
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
        <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && message.intent && (
            <span className="rounded-full border border-border bg-background px-1.5 py-0.5">
              {message.intent} · {Math.round((message.confidence ?? 0) * 100)}%
            </span>
          )}
          {!isUser && !message.unanswered && (
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onFeedback(message.id, "up")}
                className={cn(
                  "rounded p-0.5 hover:text-foreground",
                  message.feedback === "up" && "text-green-600",
                )}
                aria-label="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onFeedback(message.id, "down")}
                className={cn(
                  "rounded p-0.5 hover:text-foreground",
                  message.feedback === "down" && "text-destructive",
                )}
                aria-label="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
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
