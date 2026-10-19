import "server-only";
type CookieWrite = { name: string; value: string; options?: unknown };
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Integração Supabase ainda não configurada.");
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values: CookieWrite[]) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])); }
        catch { /* Componentes de servidor não podem gravar cookies: o proxy atualiza a sessão. */ }
      },
    },
  });
}
