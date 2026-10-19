# Plataforma da Psicóloga — Etapa 2 (Next.js e Supabase)

**Situação:** código-base de autenticação e perfis. **Não é um serviço pronto para clientes reais.** Não inclui prontuários ou relatos clínicos, agendamento ou pagamentos. O GitHub Pages publica SOMENTE o site demonstrativo que está na raiz deste repositório; ele não executa o servidor Next.js.

## Arquitetura

- `app/`: páginas de cadastro, login, recuperação de senha, perfil privado e porta de entrada administrativa.
- `lib/supabase/`: cliente SSR e cliente de navegador; os cookies de acesso são atualizados em `proxy.ts`.
- `lib/auth.ts`: verificação da identidade no servidor, leitura do papel no banco e exigência de AAL2 para `/admin`.
- `supabase/migrations/`: criação de perfis, papéis de acesso e lista pública de serviços, com RLS habilitada.
- A versão estática original permanece inalterada, exceto pela posição da seleção de serviços na home.

## Requisitos

Node.js 22+, projeto Supabase com PostgreSQL e Supabase Auth. Projeto Vercel separado para hospedar o Next.js. **Nunca vincule dados pessoais reais à demo pública antes de aprovação técnica e profissional.**

## Como configurar LOCALMENTE

1. Crie um projeto Supabase, acesse o SQL Editor e aplique `supabase/migrations/20261018_0001_auth_profiles_roles.sql` após revisá-lo.
2. Em Supabase Auth, ative confirmação de e-mail, política de senhas fortes e limite de tentativas, e configure os URLs e redirects adequados ao ambiente.
3. Copie `.env.example` para `.env.local` e preencha os valores no seu computador — **não envie valores nem o .env.local ao GitHub**.
4. Instale e execute:

```bash
cd plataforma
npm install
npm run typecheck
npm run build
npm run dev
```

5. Configure Cloudflare Turnstile no site público, ative CAPTCHA no painel do Supabase Auth com a chave SECRETA somente no próprio Supabase, configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no ambiente da aplicação e somente depois defina `ENABLE_REGISTRATION=true`. O token do captcha é repassado ao Supabase; o servidor do Supabase deve validá-lo.
6. Configure `NEXT_PUBLIC_SITE_URL` para o endereço canônico do ambiente em questão. Cadastre no Supabase os URLs de confirmação de e-mail e recuperação: `https://DOMINIO/auth/callback` e `https://DOMINIO/auth/callback?next=/redefinir-senha`.
7. Cadastre uma conta e confirme o e-mail. Para designar a psicóloga como administradora, localize seu UUID verificado no painel Supabase e promova **manualmente no SQL Editor**, jamais pela aplicação:

```sql
update public.user_roles
set role = 'admin'
where user_id = 'UUID-CONFERIDO-NO-PAINEL';
```

8. No primeiro acesso de administradora, a rota exige associação de um autenticador TOTP e confirmação de código. Sem MFA nível AAL2, `/admin` permanece bloqueado.

## Segurança

- Os papéis são armazenados em `user_roles`, tabela sem permissões de escrita para usuários comuns. Metadados públicos de cadastro não concedem o papel admin.
- Perfis têm RLS por `auth.uid()`. O usuário edita apenas `full_name` e `phone`. Dados de outras pessoas não são expostos.
- Sem chaves `service_role` ou secrets no cliente. Não criar ou enviar dados clínicos nesta aplicação.
- As verificações de acesso a páginas usam `getUser()`, papel em tabela restrita e MFA. As políticas do banco são a barreira final de proteção de dados.
- As proteções de abuso e confirmação de e-mail dependem da configuração do Supabase. Não considere esta base aprovada para produção sem testes funcionais e revisão profissional de segurança.
- GitHub Pages é uma hospedagem estática e não protege rotas privadas no servidor. O novo Next.js precisa de deploy em ambiente com execução de servidor, como Vercel.
- A LGPD exige avaliação do fluxo, retenção, base legal e avisos antes da operação real.

## Escopo da Etapa 2

Implementado no código: cadastro com dados mínimos, senha confirmada, login, logout, recuperação de senha, atualização de perfil, papéis isolados, bloqueio de acesso administrativo com MFA e migração de banco RLS. Integração aguardando configuração do Supabase.

**Ainda não implementados:** agenda, pagamentos, dashboard com dados reais, automações de mensagens, relatórios, integração com Google, coleta de analytics, anonimização de dados clínicos, e procedimentos completos de exportação/exclusão de conta. Esses módulos são planejados para etapas posteriores.

## Testes necessários antes do uso real

- Rodar `npm run typecheck` e `npm run build`; verificar GitHub Actions.
- Testar cadastro com confirmação e CAPTCHA habilitados no Supabase e login com credenciais válidas/inválidas.
- Tentar consultar e alterar perfil/papel de OUTRO usuário, validando bloqueio pelo PostgreSQL/RLS.
- Testar sessão expirada, recuperação de senha, logout, fatores TOTP e tentativas com AAL1.
- Testar rate limiting e fluxo de consentimento/privacidade antes de habilitar registros públicos.
- Validar com a profissional informações reais, registro CRP e condições de atendimento.

Em desenvolvimento, mantenha apenas contas de teste, sem dados clínicos identificáveis.
