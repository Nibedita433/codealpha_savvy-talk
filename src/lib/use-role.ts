import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks whether the current authenticated user has the given app_role.
 * Uses the `has_role` SECURITY DEFINER function which is safe against RLS recursion.
 */
export function useHasRole(role: "admin" | "user") {
  return useQuery({
    queryKey: ["has_role", role],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: role,
      });
      if (error) throw error;
      return data === true;
    },
    staleTime: 60_000,
  });
}
