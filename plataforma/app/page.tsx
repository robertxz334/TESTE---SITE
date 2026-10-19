import Link from "next/link";
export default function Home() {
  return <div className="page">
    <span className="eyebrow">PLATAFORMA PROFISSIONAL · ESTRUTURA DA ETAPA 2</span>
    <h1>Um espaço digital de<br/><em>cuidado e organização.</em></h1>
    <p className="lead">Estrutura de cadastro, acesso protegido e área pessoal construída para uma futura plataforma de Psicologia. Sem agendamentos, cobranças ou informações clínicas nesta etapa.</p>
    <div className="actions"><Link className="btn" href="/entrar">Acessar minha conta ↗</Link><Link className="btn btn-secondary" href="/cadastro">Criar cadastro</Link></div>
    <div className="card-grid"><div className="tile"><h2>Área do cliente</h2><p>Perfil individual protegido por autenticação e regras de acesso no banco de dados.</p><Link href="/cliente">Minha área →</Link></div><div className="tile"><h2>Acesso administrativo</h2><p>Entrada restrita a perfis autorizados, com segundo fator obrigatório antes da área administrativa.</p><Link href="/admin">Área administrativa →</Link></div></div>
    <div className="notice">Esta é uma aplicação separada da prévia do GitHub Pages. O cadastro real depende da configuração do Supabase, confirmação de e-mail, CAPTCHA e revisão de segurança antes de receber usuários.</div>
  </div>;
}
