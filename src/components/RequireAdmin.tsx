import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useHasRole } from "@/lib/use-role";
import { Button } from "@/components/ui/button";

/**
 * Renders children only if the current user has the `admin` app_role.
 * The parent `_authenticated` layout already ensures the user is signed in.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { data: isAdmin, isLoading, isError } = useHasRole("admin");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
        Checking permissions…
      </main>
    );
  }

  if (isError || !isAdmin) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is only available to administrators. Ask an existing admin to grant
          you the <code className="rounded bg-muted px-1.5 py-0.5">admin</code> role.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Back to chat</Link>
        </Button>
      </main>
    );
  }

  return <>{children}</>;
}
