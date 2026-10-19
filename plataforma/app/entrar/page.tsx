import Link from "next/link";
import Script from "next/script";
import { signIn } from "../actions";

const messages: Record<string, string> = {
  config: "A autenticação ainda não está configurada.",
  captcha: "Conclua a verificação de segurança antes de entrar.",
  sessao: "Entre na sua conta para acessar a área reservada.",
  credenciais: "Não foi possível entrar. Confira as credenciais ou a confirmação do e-mail.",
  "verifique-email": "Se o cadastro foi aceito, confirme o e-mail antes de entrar.",
  "senha-alterada": "Senha atualizada. Faça login novamente.",
  saiu: "Você saiu da sua conta.",
  link: "O link utilizado está inválido ou expirou.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ready = Boolean(
    siteKey && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return <section className="auth-card">
    <span className="eyebrow">ÁREA RESERVADA</span>
    <h1>Bem-vindo de volta.</h1>
    <p className="hint">Entre com o e-mail e a senha de sua conta.</p>
    {estado && messages[estado] && <p className="status" role="status">{messages[estado]}</p>}
    {!ready
      ? <p className="notice">O login será disponibilizado após configurar o Supabase e o CAPTCHA, e validar a aplicação.</p>
      : <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <form action={signIn}>
            <div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" name="email" autoComplete="email" required maxLength={254}/></div>
            <div className="field"><label htmlFor="senha">Senha</label><input id="senha" name="senha" type="password" autoComplete="current-password" required/></div>
            <div className="field"><div className="cf-turnstile" data-sitekey={siteKey} aria-label="Verificação de segurança" /></div>
            <button className="btn" type="submit">Entrar com segurança →</button>
          </form>
        </>}
    <div className="links"><Link href="/recuperar">Esqueci minha senha</Link><Link href="/cadastro">Criar conta</Link></div>
  </section>;
}
