// localStorage helpers for chat history, feedback, and analytics.

export type Role = "user" | "bot";
export type Feedback = "up" | "down";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  unanswered?: boolean;
  intent?: string;
  confidence?: number;
  feedback?: Feedback;
}

export interface ChatStats {
  userMessages: number;
  botResponses: number;
  unanswered: number;
  thumbsUp: number;
  thumbsDown: number;
}

const KEY = "college-helpdesk-chat-v2";
const CONV_KEY = "college-helpdesk-conversations-v1";

export function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(messages));
}

export function clearMessages() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function computeStats(messages: ChatMessage[]): ChatStats {
  return {
    userMessages: messages.filter((m) => m.role === "user").length,
    botResponses: messages.filter((m) => m.role === "bot").length,
    unanswered: messages.filter((m) => m.unanswered).length,
    thumbsUp: messages.filter((m) => m.feedback === "up").length,
    thumbsDown: messages.filter((m) => m.feedback === "down").length,
  };
}

/** Conversation history (each "Clear" archives the current chat). */
export interface ArchivedConversation {
  id: string;
  startedAt: number;
  endedAt: number;
  messages: ChatMessage[];
}

export function loadConversations(): ArchivedConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONV_KEY);
    return raw ? (JSON.parse(raw) as ArchivedConversation[]) : [];
  } catch {
    return [];
  }
}

export function archiveConversation(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  if (messages.filter((m) => m.role === "user").length === 0) return;
  const list = loadConversations();
  const entry: ArchivedConversation = {
    id: Math.random().toString(36).slice(2),
    startedAt: messages[0]?.timestamp ?? Date.now(),
    endedAt: Date.now(),
    messages,
  };
  list.unshift(entry);
  window.localStorage.setItem(CONV_KEY, JSON.stringify(list.slice(0, 30)));
}

export function clearConversations() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONV_KEY);
}

/** Search across all archived conversations + current chat. */
export function searchAllMessages(query: string): ChatMessage[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const archives = loadConversations().flatMap((c) => c.messages);
  const current = loadMessages();
  return [...current, ...archives].filter((m) => m.text.toLowerCase().includes(q));
}

/** Aggregate analytics across current + archived conversations. */
export interface Analytics {
  totalConversations: number;
  totalUserQueries: number;
  unanswered: number;
  satisfactionRate: number; // 0..100
  topQueries: { text: string; count: number }[];
}

export function computeAnalytics(): Analytics {
  const archives = loadConversations();
  const current = loadMessages();
  const allMessages = [...current, ...archives.flatMap((c) => c.messages)];
  const userMsgs = allMessages.filter((m) => m.role === "user");
  const unanswered = allMessages.filter((m) => m.unanswered).length;
  const up = allMessages.filter((m) => m.feedback === "up").length;
  const down = allMessages.filter((m) => m.feedback === "down").length;
  const totalFb = up + down;
  const satisfactionRate = totalFb === 0 ? 0 : Math.round((up / totalFb) * 100);

  const counts = new Map<string, number>();
  for (const m of userMsgs) {
    const key = m.text.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const topQueries = [...counts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalConversations: archives.length + (current.length > 0 ? 1 : 0),
    totalUserQueries: userMsgs.length,
    unanswered,
    satisfactionRate,
    topQueries,
  };
}
