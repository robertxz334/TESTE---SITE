# Site demonstrativo — Psicologia

Landing page demonstrativa da profissional fictícia **Marina Andrade**, criada para apresentar uma proposta visual a uma psicóloga. **Não é um site de atendimento real.**

## Ver a demonstração

Após habilitar o GitHub Pages, o endereço será normalmente:

https://robertxz334.github.io/TESTE---SITE/

Para ativar: vá a **Settings > Pages > Build and deployment**, selecione **Deploy from a branch** e configure **Branch: main** e **Folder: / (root)**. Salve e consulte a URL exibida no painel Pages. Caso a opção de publicação por branch não esteja disponível, use uma configuração compatível com a conta.

## Atualização — Etapa 1 (refinamento visual)

O site recebeu um novo tratamento visual nas páginas internas, uma seção especial de supervisão na home e três opções de supervisão (Individual, Grupo — Ouvinte e Grupo — Supervisionando). Todas as mensagens ainda são apenas demonstrativas.

Consulte [o relatório da Etapa 1](ETAPA_1.md) para os arquivos alterados, verificações, pendências e próximos passos. Para verificar localmente os links e arquivos, utilize Node.js 22+:

```bash
node scripts/verificar-site.mjs
```

A futura plataforma com login, agendamentos e pagamentos **não está implementada nesta demo estática**. Nunca adicione chaves, registros clínicos ou dados pessoais ao repositório público.

## Conteúdo

- `index.html`: landing page premium com imagens ilustrativas incorporadas
- `psicologia-clinica.html`: página explicativa de Psicologia Clínica
- `psicologia-do-esporte.html`: página explicativa de Psicologia do Esporte
- `supervisao.html`: página explicativa de Supervisão
- `politica-de-privacidade.html`: página demonstrativa

Esta publicação é uma **prévia estática**, sem checkout ou agendamento real. Os botões de contato no protótipo não enviam mensagens. Os dados profissionais, registro CRP, formações e fotos são fictícios, devendo ser substituídos e validados antes da publicação definitiva. Não utilizar como site profissional real.

O projeto Next.js original permanece no arquivo completo disponibilizado na conversa em que a demonstração foi criada.
