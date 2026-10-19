# Etapa 2 — Banco de dados e autenticação

## Resumo
A Etapa 2 foi iniciada como uma **aplicação Next.js separada** em `plataforma/`, preservando a demo em GitHub Pages. O objetivo é construir uma base de autenticação, perfis e autorização sem colocar um backend de pacientes em hospedagem estática.

## Alteração visual também solicitada
A área para escolher o serviço, anteriormente próxima ao rodapé, foi movida na página pública para imediatamente depois da apresentação inicial e da faixa de valores. O bloco antigo foi removido daquele ponto. Existe um CTA próximo ao fim da página que retorna à seleção.

## Arquivos
- Modificado: `index.html` (posição de seleção e CTA final).
- Criado: `plataforma/` (Next.js, Supabase SSR, rotas de autenticação, perfil do cliente, MFA administrativo, CSS, documentação e migrations).
- Criado: `.github/workflows/plataforma-etapa2.yml` (CI de tipos e build).

## Segurança / estrutura
- Páginas públicas separadas de rotas privadas;
- Supabase Auth com confirmação de e-mail e Turnstile configurável; cadastro desligado por padrão;
- Separação de `profiles` e `user_roles` com RLS e sem elevação de privilégios pelo usuário;
- Painel administrativo de acesso com TOTP nível AAL2; 
- Senhas gerenciadas pelo provedor (nunca armazenadas em tabelas do aplicativo);
- Sem coleta de dados clínicos, diagnóstico ou prontuário.

## Verificações executadas

- GitHub Actions — `node 22 / npm install`: **sucesso**.
- GitHub Actions — `npm run typecheck`: **sucesso**.
- GitHub Actions — `npm run build` (Next.js): **sucesso**.
- Verificação de HTML e links internos da demonstração: **sucesso**.
- GitHub Pages — publicação da versão pública: **sucesso**.

Resultados referentes ao commit `4c9789159ac3f1e39287020bf96d3a41599eb387`; veja a aba Actions para os registros. **Não foram executados testes funcionais de autenticação, ensaios de RLS em Supabase real nem auditoria completa de segurança.**

## Limites da entrega
**A migração ainda não foi aplicada a um projeto Supabase nesta conversa:** nenhum projeto/banco foi conectado. Não foram executados testes de integração com cadastro/login real. A aplicação Next.js também ainda não foi colocada no ar, pois GitHub Pages é estático.

O repositório é público: **nunca incluir credenciais, dados pessoais ou backups nele**. Após receber um projeto Supabase autorizado, configurar Vercel e ativar validação, CAPTCHA e proteções de abuso. A integração com a psicóloga real requer sua revisão e aprovação.

## Próximos passos
1. Validar build automático e testar visualmente a nova seção de escolha de serviço.
2. Configurar Supabase e aplicar migração em ambiente de testes.
3. Testar RLS, cadastro, login, MFA e recuperação de senha com contas exclusivamente fictícias.
4. Depois da validação da Etapa 2, iniciar Etapa 3 (área de cliente com agendamentos e pagamentos administrativos).
