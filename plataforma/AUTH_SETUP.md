# Ativação da autenticação — Etapa 2

> **Status:** Banco Supabase criado e migração aplicada. RLS ativada e Security Advisor sem avisos na checagem inicial. Código Next.js compilado. **Login e recuperação de senha ainda não foram testados ponta a ponta. Cadastro público continua DESLIGADO.**
>
> Projeto Supabase: `juliana-helmara-plataforma`. Sem dados de clientes reais. O repositório GitHub é **público**: não enviar segredos, senhas, tokens ou arquivos .env nele.

## 1. Auth / E-mail

No painel do Supabase:

- Acesse **Authentication > Providers > Email** e habilite o provedor de e-mail e **confirmação obrigatória de e-mail**.
- Em **Authentication > Email Templates**, mantenha os templates de confirmação e recuperação compatíveis com o fluxo PKCE/SSR; os links devem voltar ao domínio da aplicação. O código atual usa `/auth/callback` e, para recuperação, `?next=/redefinir-senha`.
- Para um uso profissional, configure um **SMTP autorizado** com domínio próprio. O envio padrão do Supabase tem limitações: não presumir que funciona com destinatários externos em produção.
- Habilite política de senhas fortes, limites de tentativas e proteção contra abuso nas opções de Authentication.

Documentação oficial: https://supabase.com/docs/guides/auth/auth-email-password

## 2. CAPTCHA / Cloudflare Turnstile

- Crie um widget Turnstile em https://dash.cloudflare.com/ (domínios de teste e domínio real da aplicação).
- Copie **Site key** para as variáveis de ambiente do Next.js em `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. É uma chave publicável, mas ainda é melhor centralizar a configuração no host.
- No Supabase, acesse **Authentication > Bot and Abuse Protection**, habilite CAPTCHA, escolha Turnstile e forneça a **Secret key somente no painel do Supabase**. Nunca enviar a Secret key ao cliente, ao repositório ou à conversa.
- Confira que os três formulários da aplicação incluem um CAPTCHA: **cadastro**, **login** e **recuperação de senha**. O servidor passa `captchaToken` ao Supabase nos três fluxos.
- Só habilite esse recurso no painel do Supabase quando o frontend e a configuração de hospedagem estiverem prontos, evitando bloquear os fluxos em uso.

Documentação oficial: https://supabase.com/docs/guides/auth/auth-captcha

## 3. Hospedagem com servidor (Vercel)

O GitHub Pages publica HTML estático. O Next.js com autenticação exige hospedagem de servidor.

- No Vercel, importe `robertxz334/TESTE---SITE`.
- Defina **Root Directory = `plataforma`** e framework Next.js.
- Configure no Vercel (nunca no repositório):
  - `NEXT_PUBLIC_SUPABASE_URL`: URL pública do projeto Supabase;
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: **chave publicável**, não a `service_role`;
  - `NEXT_PUBLIC_SITE_URL`: endereço HTTPS real e canônico da aplicação;
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: site key do widget Turnstile;
  - `ENABLE_REGISTRATION=false` até concluir os testes de segurança e consentimento.
- Em **Authentication > URL Configuration** no Supabase, configure **Site URL** igual ao domínio HTTPS da aplicação e adicione **Redirect URLs** para:
  - `https://SEU-DOMINIO/auth/callback`
  - `https://SEU-DOMINIO/auth/callback?next=/cliente`
  - `https://SEU-DOMINIO/auth/callback?next=/redefinir-senha`
- Se testar localmente, inclua `http://localhost:3000/auth/callback*` apenas como URL de desenvolvimento.

Documentação oficial: https://supabase.com/docs/guides/auth/redirect-urls

## 4. Testes obrigatórios antes de receber usuários

Com **contas fictícias de teste**, validar:

1. Cadastro com CAPTCHA real e confirmação do e-mail; rejeição de cadastro inválido e de senha fraca.
2. Login, falha com senha incorreta e logout; comportamento após sessão expirada.
3. Recuperação de senha por e-mail com token de CAPTCHA, callback, alteração e novo login.
4. RLS: usuário A não consegue selecionar/alterar perfil de B, inclusive chamando API diretamente.
5. Usuário comum não consegue alterar papel em `user_roles` nem acessar `/admin`.
6. Papel administrativo só é concedido manualmente a UUID verificado por operação confiável no SQL Editor.
7. Admin consegue configurar MFA TOTP e é bloqueado com sessão AAL1.
8. Verificar rate limiting e alertas de segurança, refazer testes após modificações.
9. Revisar a privacidade e o tratamento de dados sob a LGPD, com a profissional responsável.

## 5. Critérios para liberar cadastro

Somente depois de testes, política de privacidade/consentimento apropriados, serviço de e-mail confirmado, domínio HTTPS, CAPTCHA de servidor ativo e avaliação de segurança: `ENABLE_REGISTRATION=true` no ambiente Vercel.

**Não ativar automaticamente nem criar usuários reais pelo ChatGPT.**
