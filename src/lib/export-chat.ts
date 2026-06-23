// Export chat history to plain text or a printable PDF (via window.print()).
import type { ChatMessage } from "./chat-storage";

function fmt(ts: number) {
  return new Date(ts).toLocaleString();
}

export function exportAsText(messages: ChatMessage[], filename = "chat-history.txt") {
  const lines = messages.map(
    (m) => `[${fmt(m.timestamp)}] ${m.role === "user" ? "User" : "Bot"}: ${m.text}`,
  );
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, filename);
}

export function exportAsPDF(messages: ChatMessage[]) {
  // Render an HTML document and open the browser's native print dialog (Save as PDF).
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Chat History</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:720px;margin:24px auto;padding:0 16px;color:#111}
    h1{font-size:20px;margin:0 0 16px}
    .msg{margin:0 0 12px;padding:10px 12px;border-radius:10px;border:1px solid #e5e7eb}
    .user{background:#eff6ff}
    .bot{background:#f9fafb}
    .meta{font-size:11px;color:#6b7280;margin-bottom:4px}
    .role{font-weight:600}
  </style></head><body>
  <h1>College Helpdesk Chatbot — Chat History</h1>
  ${messages
    .map(
      (m) => `<div class="msg ${m.role}">
      <div class="meta"><span class="role">${m.role === "user" ? "User" : "Bot"}</span> · ${fmt(m.timestamp)}</div>
      <div>${escapeHtml(m.text)}</div>
    </div>`,
    )
    .join("")}
  <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
  </body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
