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
