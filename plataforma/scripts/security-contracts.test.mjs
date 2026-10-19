import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const base = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(resolve(base, relative), "utf8");

test("senha é recebida sem trim e sem truncamento no servidor", () => {
  const actions = read("app/actions.ts");
  assert.match(actions, /function secretValue\(form: FormData, key: string\): string/);
  assert.match(actions, /return typeof input === "string" \? input : ""/);
  assert.equal((actions.match(/secretValue\(form, "senha"\)/g) ?? []).length, 3);
  assert.equal((actions.match(/secretValue\(form, "confirmar"\)/g) ?? []).length, 2);
  assert.doesNotMatch(actions, /value\(form, "(?:senha|confirmar)", 160\)/);
});

test("esquema SQL mantém as salvaguardas básicas de acesso", () => {
  const sql = read("supabase/migrations/20261018_0001_auth_profiles_roles.sql");
  assert.match(sql, /alter table public\.profiles enable row level security;/i);
  assert.match(sql, /alter table public\.user_roles enable row level security;/i);
  assert.match(sql, /grant update\(full_name, phone\) on public\.profiles to authenticated;/i);
  assert.match(sql, /create policy profiles_self_select[\s\S]*?auth\.uid\(\)/);
  assert.match(sql, /create policy profiles_self_update[\s\S]*?auth\.uid\(\)/);
  assert.match(sql, /create policy user_roles_self_select[\s\S]*?auth\.uid\(\)/);
  assert.match(sql, /role text not null default 'client'/);
  assert.equal((sql.match(/'\^\[\+\]\?\[0-9\(\) \.\-\]\{8,24\}\$'/g) ?? []).length, 2, "Validação SQL do telefone deve ser exata");
});

test("páginas administrativas exigem papel e segundo fator no servidor", () => {
  const auth = read("lib/auth.ts");
  assert.match(auth, /if \(role !== "admin"\) redirect\("\/cliente"\)/);
  assert.match(auth, /data\.currentLevel !== "aal2"/);
  const profile = read("app/cliente/page.tsx");
  assert.match(profile, /await requireUser\(\)/);
});

test("cadastro permanece desativado por padrão e exige CAPTCHA", () => {
  const env = read(".env.example");
  const actions = read("app/actions.ts");
  assert.match(env, /ENABLE_REGISTRATION=false/);
  assert.match(actions, /process\.env\.ENABLE_REGISTRATION !== "true"/);
  assert.match(actions, /cf-turnstile-response/);
  assert.match(actions, /captchaToken: token/);
});


test("CAPTCHA é exigido em cadastro, login e recuperação", () => {
  const actions = read("app/actions.ts");
  const login = read("app/entrar/page.tsx");
  const signup = read("app/cadastro/page.tsx");
  const recovery = read("app/recuperar/page.tsx");
  assert.equal((actions.match(/const token = value\(form, "cf-turnstile-response", 3000\)/g) ?? []).length, 3);
  assert.match(actions, /signInWithPassword\(\{ email, password, options: \{ captchaToken: token \} \}\)/);
  assert.match(actions, /redirectTo: siteUrl \+ "\/auth\/callback\?next=\/redefinir-senha",[\s\S]*?captchaToken: token/);
  for (const [label, page] of [["cadastro", signup], ["login", login], ["recuperação", recovery]]) {
    assert.match(page, /<TurnstileField siteKey=\{siteKey!\}/, label + " sem desafio visual");
    assert.match(page, /NEXT_PUBLIC_TURNSTILE_SITE_KEY/, label + " sem configuração do CAPTCHA");
  }
});

test("login apresenta erros específicos de CAPTCHA sem divulgar detalhes de conta", () => {
  const actions = read("app/actions.ts");
  const login = read("app/entrar/page.tsx");
  assert.match(actions, /error\?\.code\?\.includes\("captcha"\)/);
  assert.match(actions, /destination\("\/entrar", "captcha"\)/);
  assert.match(actions, /destination\("\/entrar", "credenciais"\)/);
  assert.match(login, /limite: "Muitas tentativas de acesso/);
  assert.match(login, /TurnstileField siteKey=/);
});

test("Turnstile usa renderização explícita, bloqueia envio e mostra erro de carregamento", () => {
  const widget = read("components/turnstile-field.tsx");
  assert.match(widget, /api\\.js\\?render=explicit/);
  assert.match(widget, /window\\.turnstile\\.render/);
  assert.match(widget, /type="hidden" name="cf-turnstile-response" value=\\{token\\}/);
  assert.match(widget, /type="submit" disabled=\\{!token\\}/);
  assert.match(widget, /onError=\\{\\(\\) => setStatus\\("error"\\)\\}/);
});
