import { Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";

export function SiteHeader() {
  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors";
  const activeClass = "text-foreground bg-accent";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">College Helpdesk</span>
            <span className="text-xs text-muted-foreground">AI Chatbot</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }} activeOptions={{ exact: true }}>
            Chat
          </Link>
          <Link to="/testing" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            Testing
          </Link>
          <Link to="/about" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
