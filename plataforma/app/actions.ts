"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "../lib/supabase/server";
import { requireUser, getRole } from "../lib/auth";

function value(form: FormData, key: string, limit = 250): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, limit) : "";
}
function goodEmail(s: string) {
  return s.length < 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function goodPassword(s: string) {
  return s.length >= 12 && s.length <= 128;
}
function destination(path: string, status: string): never {
  redirect(path + "?estado=" + encodeURIComponent(status));
}
function validSiteURL(): string | null {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return null;
  try {
    const parsed = new URL(site);
    if (parsed.protocol === "https:" || (parsed.hostname === "localhost" && parsed.protocol === "http:")) {
      return parsed.origin;
    }
  } catch { /* URL inválida */ }
  return null;
}
export async function register(form: FormData) {
  if (process.env.ENABLE_REGISTRATION !== "true" || !supabaseConfigured()) destination("/cadastro", "indisponivel");
  const token = value(form, "cf-turnstile-response", 3000);
  const siteUrl = validSiteURL();
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !token || !siteUrl) destination("/cadastro", "captcha");
  const email = value(form, "email").toLowerCase();
  const name = value(form, "nome", 90);
  const phone = value(form, "telefone", 24);
  const password = value(form, "senha", 160);
  const confirm = value(form, "confirmar", 160);
  if (!goodEmail(email) || name.length < 2 || (phone && !/^\+?[0-9() .-]{8,24}$/.test(phone))
    || !goodPassword(password) || password !== confirm) destination("/cadastro", "invalidos");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email, password,
    options: {
      captchaToken: token,
      emailRedirectTo: siteUrl + "/auth/callback?next=/cliente",
      data: { full_name: name, phone },
    },
  });
  if (error) destination("/cadastro", "falha");
  destination("/entrar", "verifique-email");
}

export async function signIn(form: FormData) {
  if (!supabaseConfigured()) destination("/entrar", "config");
  const email = value(form, "email").toLowerCase();
  const password = value(form, "senha", 160);
  if (!goodEmail(email) || !password) destination("/entrar", "credenciais");
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) destination("/entrar", "credenciais");
  const role = await getRole(supabase, data.user.id);
  if (role === "admin") redirect("/admin");
  redirect("/cliente");
}

export async function signOut() {
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/entrar?estado=saiu");
}

export async function requestPasswordReset(form: FormData) {
  if (!supabaseConfigured()) destination("/recuperar", "config");
  const siteUrl = validSiteURL();
  if (!siteUrl) destination("/recuperar", "config");
  const email = value(form, "email").toLowerCase();
  if (!goodEmail(email)) destination("/recuperar", "invalidos");
  const supabase = await createClient();
  // Não revelar se o e-mail existe.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: siteUrl + "/auth/callback?next=/redefinir-senha",
  });
  destination("/recuperar", "enviado");
}

export async function updatePassword(form: FormData) {
  const { supabase } = await requireUser();
  const password = value(form, "senha", 160);
  const confirm = value(form, "confirmar", 160);
  if (!goodPassword(password) || password !== confirm) destination("/redefinir-senha", "invalidos");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) destination("/redefinir-senha", "falha");
  await supabase.auth.signOut();
  destination("/entrar", "senha-alterada");
}

export async function updateProfile(form: FormData) {
  const { supabase, user } = await requireUser();
  const name = value(form, "nome", 90);
  const phone = value(form, "telefone", 24);
  if (name.length < 2 || (phone && !/^\+?[0-9() .-]{8,24}$/.test(phone)))
    destination("/cliente", "invalidos");
  const { error } = await supabase.from("profiles")
    .update({ full_name: name, phone: phone || null })
    .eq("user_id", user.id);
  if (error) destination("/cliente", "falha");
  revalidatePath("/cliente");
  destination("/cliente", "salvo");
}
