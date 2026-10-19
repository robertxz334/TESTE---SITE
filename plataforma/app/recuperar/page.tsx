import Link from "next/link";
import TurnstileField from "../../components/turnstile-field";
import { requestPasswordReset } from "../actions";

const messages: Record<string, string> = {
  config: "A recuperação por e-mail ainda não está configurada.",
  captcha: "Conclua a verificação de segurança para solicitar a recuperação.",
  enviado: "Se o e-mail estiver cadastrado, você receberá instruções.",
  invalidos: "Informe um e-mail válido.",
};

export default async function Recover({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ready = Boolean(
    siteKey && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return <section className="auth-card">
    <span className="eyebrow">RECUPERAÇÃO DE CONTA</span>
    <h1>Recuperar acesso.</h1>
    <p className="hint">Informe seu e-mail e, se ele estiver cadastrado, serão enviadas instruções de recuperação.</p>
    {estado && messages[estado] && <p className="status" role="status">{messages[estado]}</p>}
    {!ready
      ? <p className="notice">A recuperação de senha será disponibilizada após configurar o Supabase, CAPTCHA e serviço de e-mail.</p>
      : <>
    
          <form action={requestPasswordReset}>
            <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email"/></div>
            <TurnstileField siteKey={siteKey!} submitLabel="Solicitar redefinição ↗" />
            
          </form>
        </>}
    <div className="links"><Link href="/entrar">Voltar ao login</Link></div>
  </section>;
}
