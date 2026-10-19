import Link from "next/link";
import { requestPasswordReset } from "../actions";
const messages: Record<string,string> = {
  config: "A integração com o serviço de e-mail ainda não está configurada.",
  enviados: "Se o e-mail estiver cadastrado, você receberá instruções.",
  enviado: "Se o e-mail estiver cadastrado, você receberá instruções.",
  invalidos: "Informe um e-mail válido.",
};
export default async function Recover({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  return <section className="auth-card"><span className="eyebrow">RECUPERAÇÃO DE CONTA</span><h1>Recuperar acesso.</h1><p className="hint">Informe seu e-mail e, se ele estiver cadastrado, enviaremos as orientações disponíveis.</p>
    {estado && messages[estado] && <p className="status" role="status">{messages[estado]}</p>}
    <form action={requestPasswordReset}><div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email"/></div><button className="btn" type="submit">Solicitar redefinição ↗</button></form>
    <div className="links"><Link href="/entrar">Voltar ao login</Link></div>
  </section>;
}
