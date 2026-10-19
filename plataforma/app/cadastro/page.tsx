import Link from "next/link";
import Script from "next/script";
import { register } from "../actions";
const messages: Record<string, string> = {
  indisponivel: "Cadastro temporariamente indisponível. É necessário configurar e proteger o Supabase.",
  captcha: "Conclua a verificação de segurança para continuar.",
  invalidos: "Confira seus dados. A senha deve ter 12 ou mais caracteres e coincidir com a confirmação.",
  falha: "Não foi possível concluir o pedido. Tente novamente mais tarde.",
};
export default async function Signup({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const enabled = process.env.ENABLE_REGISTRATION === "true" && Boolean(siteKey)
    && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return <section className="auth-card"><span className="eyebrow">NOVA CONTA</span><h1>Seu espaço começa aqui.</h1><p className="hint">O cadastro solicita apenas dados básicos para identificação e contato administrativo. Não envie informações clínicas.</p>
    {estado && messages[estado] && <p className="status alert" role="alert">{messages[estado]}</p>}
    {!enabled ? <p className="notice">O cadastro está desativado até a configuração de um projeto Supabase com confirmação de e-mail, proteção CAPTCHA, políticas de acesso e revisão de segurança.</p>
      : <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <form action={register}>
        <div className="field"><label htmlFor="nome">Nome completo</label><input id="nome" name="nome" required minLength={2} maxLength={90} autoComplete="name"/></div>
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email"/></div>
        <div className="field"><label htmlFor="telefone">Telefone (opcional)</label><input id="telefone" name="telefone" type="tel" maxLength={24} autoComplete="tel"/></div>
        <div className="field"><label htmlFor="senha">Senha (mínimo 12 caracteres)</label><input id="senha" name="senha" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/></div>
        <div className="field"><label htmlFor="confirmar">Confirmar senha</label><input id="confirmar" name="confirmar" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/></div>
        <div className="field"><div className="cf-turnstile" data-sitekey={siteKey} aria-label="Verificação de segurança" /></div>
        <p className="hint">Ao enviar, você receberá orientações para verificar seu e-mail, caso o cadastro seja aceito. Consulte a política de privacidade antes de usar o serviço real.</p>
        <button className="btn" type="submit">Criar minha conta →</button>
      </form>
      </>}
    <div className="links"><Link href="/entrar">Já tenho uma conta</Link></div>
  </section>;
}
