// localStorage helpers for chat history + stats.

export type Role = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  unanswered?: boolean;
}

export interface ChatStats {
  userMessages: number;
  botResponses: number;
  unanswered: number;
}

const KEY = "college-helpdesk-chat-v1";

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
  };
}
