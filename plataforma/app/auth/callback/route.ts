import { NextRequest, NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "../../../lib/supabase/server";

// Destinos estritamente permitidos: não aceitar redirecionamento externo ou arbitrário.
const allowed = new Set(["/cliente", "/redefinir-senha"]);
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/cliente";
  if (!supabaseConfigured() || !code || !allowed.has(next)) {
    return NextResponse.redirect(new URL("/entrar?estado=link", url.origin));
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/entrar?estado=link", url.origin));
  return NextResponse.redirect(new URL(next, url.origin));
}
