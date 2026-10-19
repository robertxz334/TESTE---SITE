"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/browser";

type Mode = "loading" | "enroll" | "verify";
export default function MfaSetup() {
  const [mode, setMode] = useState<Mode>("loading");
  const [factorId, setFactorId] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.mfa.listFactors().then(({ data, error }) => {
      if (error) { setMessage("Não foi possível consultar os fatores cadastrados."); setMode("enroll"); return; }
      const verified = data?.totp?.find(f => f.status === "verified");
      if (verified) { setFactorId(verified.id); setMode("verify"); }
      else setMode("enroll");
    }).catch(() => { setMessage("Falha ao consultar segurança da conta."); setMode("enroll"); });
  }, []);

  async function begin() {
    setPending(true); setMessage("");
    try {
      const { data, error } = await createClient().auth.mfa.enroll({ factorType: "totp", friendlyName: "Acesso administrativo" });
      if (error || !data?.totp) throw new Error("Não foi possível cadastrar o autenticador.");
      setFactorId(data.id); setSecret(data.totp.secret); setMode("verify");
    } catch { setMessage("Não foi possível iniciar a configuração de MFA."); }
    finally { setPending(false); }
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code) || !factorId) { setMessage("Informe o código de seis dígitos."); return; }
    setPending(true); setMessage("");
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId, code });
    if (error) { setMessage("Código inválido ou expirado. Confira o autenticador."); setPending(false); return; }
    window.location.assign("/admin");
  }

  return <div className="auth-card" style={{ marginLeft: 0 }}>
    {message && <p role="alert" className="status alert">{message}</p>}
    {mode === "loading" && <p>Consultando as opções de segurança...</p>}
    {mode === "enroll" && <><h2>Configurar autenticador</h2><p>Instale um aplicativo de códigos TOTP no celular e inicie a associação. O código nunca deve ser compartilhado.</p><button className="btn" disabled={pending} onClick={begin}>Iniciar configuração</button></>}
    {mode === "verify" && <><h2>Confirmar segundo fator</h2>{secret && <><p className="hint">Adicione manualmente esta chave secreta ao seu aplicativo autenticador e use o código gerado:</p><div className="mfa-secret">{secret}</div></>}<form onSubmit={verify}><div className="field"><label htmlFor="code">Código de seis dígitos</label><input id="code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} required/></div><button type="submit" className="btn" disabled={pending}>Confirmar código →</button></form></>}
    <p className="hint">Sem verificação AAL2, o servidor não libera o painel administrativo.</p>
  </div>;
}
