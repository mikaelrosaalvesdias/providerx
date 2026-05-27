# ProviderX Planning Hub

Hub interno da Cariap/ProviderX para planejar, estruturar, simular e apresentar o negócio ProviderX.

O sistema organiza o plano de negócios, verticais, produtos white-label, modelo de receita, projeções financeiras, estrutura operacional, organograma, materiais estratégicos e decisões executivas.

## Escopo do MVP

Implementado:

- Login com sessão segura.
- Central executiva dark/neon.
- Plano de Negócios vivo, editável por seção.
- Histórico de versões e restauração de seções do plano.
- Exportação do plano em Markdown e PDF simples.
- Verticais ProviderX Home, Comércios e Serviços Locais e Varejo.
- Produtos e soluções vinculados às verticais.
- Modelo de receita com SaaS recorrente.
- Projeções financeiras e simulador estratégico.
- Estratégia comercial, públicos-alvo e diferenciais.
- Estrutura operacional e organograma visual.
- Materiais estratégicos com upload, link externo, status e oficialização.
- Decisões estratégicas.
- Relatórios executivos com exportação CSV/Markdown.
- Admin modular.
- Logs de auditoria.
- Página interna de versão em `/version`.

Fora do MVP:

- Propostas comerciais.
- Contratos.
- CRM, funil e pipeline de vendas.
- Base de conhecimento, trilhas, quizzes e certificados.
- Comissão de vendedores, representantes ou parceiros.
- Portal externo de representantes, parceiros ou clientes.

## Stack

- Next.js App Router.
- TypeScript.
- TailwindCSS.
- PostgreSQL.
- Prisma ORM.
- Sessão segura com JWT HTTP-only.
- Upload local em volume Docker.
- Docker Swarm em produção.
- Traefik como reverse proxy existente.

## Rotas

- `/login`
- `/dashboard`
- `/business-plan`
- `/verticals`
- `/products`
- `/revenue`
- `/financial-projections`
- `/strategy`
- `/org-chart`
- `/materials`
- `/decisions`
- `/reports`
- `/admin`
- `/logs`
- `/version`

## Seeds iniciais

O seed cria:

- Perfis: Admin Master, Diretoria, Produto, Comercial, Marketing, Financeiro, Tecnologia e Visualizador.
- Permissões de dashboard, planejamento, materiais, relatórios, exportações, logs e admin.
- Plano de negócios ProviderX com seções versionáveis.
- Verticais ProviderX Home, Comércios e Serviços Locais e Varejo.
- Produtos Wi-Facil, AtendAI, Pixel Facil e 123 Encarte na vertical Varejo.
- Produtos planejados para Home e Comércios.
- Receita recorrente SaaS de R$ 1.500 por provedor.
- Cenário inicial: 10 provedores x R$ 1.500 = R$ 15.000/mês.
- Cenário escalado: 150 provedores x R$ 1.500 = R$ 225.000/mês.
- Custos, investimentos, canais de aquisição, departamentos, cargos, organograma e decisões estratégicas iniciais.

## Variáveis de ambiente

Consulte `.env.example`.

Obrigatórias:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `AUTH_SECRET`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `BOOTSTRAP_ADMIN_NAME`

Recomendadas:

- `PROVIDERX_HOST`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_DIR`

Não commitar `.env`, dumps, backups, uploads reais ou secrets.

## Desenvolvimento

```bash
npm install
npx prisma generate
npm run dev
```

Validações:

```bash
npx prisma validate
npm run lint
npm run typecheck
npm run build
```

Seed:

```bash
npx prisma migrate deploy
npx prisma db seed
```

O seed exige `BOOTSTRAP_ADMIN_PASSWORD`.

## Deploy

Todo deploy em produção exige:

1. Atualizar versão.
2. Atualizar `CHANGELOG.md`.
3. Rodar validações.
4. Commitar.
5. Fazer push no GitHub.
6. Só depois publicar no servidor.

Repositório oficial:

```text
https://github.com/mikaelrosaalvesdias/providerx
```

Detalhes operacionais em `README_DEPLOY.md`.

## Auditoria

A auditoria técnica mais recente está em:

- `AUDITORIA_PLANNING_HUB_20260527.md`
- `CHECKLIST_PORTAS_DOMINIOS_PROXY.md`

Resumo:

- Produção usa Docker Swarm.
- Reverse proxy atual é Traefik.
- Rede externa Traefik: `n8nmikaelnet`.
- Não usar portas 80/443 diretamente.
- Não expor porta pública nova.
- `providerx.cariap.com.br` ainda precisa estar resolvendo DNS para este servidor antes de trocar o host final.
