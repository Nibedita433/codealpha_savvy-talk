import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Bot, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useHasRole } from "@/lib/use-role";

export function SiteHeader() {
  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors";
  const activeClass = "text-foreground bg-accent";

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useHasRole("admin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

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
          <Link to="/admin" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            Admin
          </Link>
          <Link to="/testing" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            Testing
          </Link>
          <Link to="/about" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            About
          </Link>
          <div className="ml-1 flex items-center gap-1">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} title={user.email ?? "Signed in"}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })}>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
