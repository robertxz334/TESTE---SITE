import "server-only";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "./supabase/server";

export async function requireUser() {
  if (!supabaseConfigured()) redirect("/entrar?estado=config");
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/entrar?estado=sessao");
  return { supabase, user };
}

export async function getRole(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("user_roles").select("role").eq("user_id", userId).single();
  if (error) return null;
  return data?.role as "admin" | "client" | "supervisee" | null;
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const role = await getRole(supabase, user.id);
  if (role !== "admin") redirect("/cliente");
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || data.currentLevel !== "aal2") redirect("/admin/mfa");
  return { supabase, user };
}
