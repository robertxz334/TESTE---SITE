import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Área reservada | Psicologia — demonstração",
  description: "Estrutura de acesso seguro para a futura plataforma da psicóloga.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="preview-note">Projeto em configuração · Nenhum dado clínico deve ser enviado ou registrado nesta plataforma</div>
        <header className="app-header">
          <Link className="brand" href="/"><span aria-hidden="true">✳</span> Marina Andrade <small>PLATAFORMA · ETAPA 2</small></Link>
          <nav aria-label="Navegação principal"><Link href="/">Início</Link><Link href="/entrar">Entrar</Link><Link href="/cadastro">Cadastro</Link></nav>
        </header>
        <main className="main-content">{children}</main>
        <footer className="app-footer">Projeto de demonstração · Nome, CRP e dados profissionais não confirmados · Não é um prontuário clínico</footer>
      </body>
    </html>
  );
}
