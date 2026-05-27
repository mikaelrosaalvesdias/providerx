# ProviderX Playbook Comercial

[![Status](https://img.shields.io/badge/status-MVP%20em%20producao-22c55e)](https://providerx.n8nmikael.com.br)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Swarm%20%2B%20Traefik-2496ed)](https://docs.docker.com/engine/swarm/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](#licenca)

Plataforma web interna para gestao comercial e estrategica dos produtos white-label ProviderX/Cariap.

O sistema centraliza produtos, playbooks, propostas, contratos, comissoes, metas, materiais, treinamentos, relatorios, usuarios, permissoes e logs em uma central de comando comercial com identidade visual dark/neon ProviderX.

> Dominio de producao atual: `https://providerx.n8nmikael.com.br`

## Objetivo

A ProviderX/Cariap estrutura produtos white-label para provedores de internet e varejo. O ProviderX Playbook Comercial foi criado para ajudar a equipe interna a:

- Montar estrategia de venda por produto.
- Treinar equipe comercial, marketing, financeiro e operacao.
- Criar propostas comerciais rapidamente.
- Simular margem, comissao, repasse e metas.
- Controlar materiais oficiais de venda.
- Padronizar discurso comercial.
- Medir performance por produto, vendedor, representante e parceiro.
- Organizar novos produtos sem fixar regra comercial no codigo.

## Principios do projeto

- **Interno primeiro**: o MVP nao e portal publico para representantes ou parceiros.
- **Preparado para acesso externo**: a arquitetura ja contempla escopo futuro para representante, parceiro e cliente.
- **Tudo modular**: precos, custos, comissoes, repasses, modelos de proposta e regras comerciais sao cadastros administrativos.
- **Sem secrets no codigo**: senhas, tokens e conexoes ficam em variaveis de ambiente.
- **Deploy sem conflito de infraestrutura**: usa o Traefik existente e nao publica portas 80/443 diretamente.
- **Visual de produto oficial**: interface dark, neon, SaaS moderno, com area de produtos, indicadores e atalhos de operacao comercial.

## Stack

### Aplicacao

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Server Actions
- Cookies HTTP-only assinados com `jose`
- Upload local por `UPLOAD_DIR`
- Geracao de PDF com `pdfkit`

### Banco

- PostgreSQL
- Prisma ORM
- Migrations versionadas
- Seeds iniciais dos produtos ProviderX

### Infra

- Docker
- Docker Compose para desenvolvimento local
- Docker Swarm para producao
- Traefik como reverse proxy existente
- HTTPS via Let's Encrypt no proxy

## Modulos

### Autenticacao e acesso

- Login e logout.
- Sessao segura via cookie HTTP-only.
- Usuarios criados pelo Admin.
- Perfis e permissoes.
- Logs de acesso e acoes criticas.
- Bloqueio server-side de rotas administrativas.

Perfis iniciais:

- Admin Master
- Diretoria
- Gestor Comercial
- Marketing
- Financeiro
- Vendedor Interno
- Operacional
- Visualizador

### Dashboard comercial

Tela inicial em formato de central de comando:

- Cards neon de produtos.
- Propostas abertas, aprovadas, perdidas e em negociacao.
- Receita prevista.
- Receita recorrente.
- Setup vendido.
- Comissao prevista.
- Margem estimada.
- Meta x realizado.
- Produtos mais trabalhados.
- Top representantes e parceiros.
- Alertas de propostas paradas.
- Alertas de contratos vencendo.
- Atalhos filtrados por permissao.

### Admin modular

CRUD administrativo para:

- Produtos
- Modulos de produto
- Planos
- Tabelas de venda
- Tabelas de custo
- Bases de comissao
- Regras de comissao
- Empresas clientes
- Empresas parceiras
- Representantes
- Vendedores internos
- Usuarios
- Perfis e permissoes
- Organograma
- Conteudos de playbook
- Apresentacoes e arquivos
- Conteudos de conhecimento
- Trilhas
- Quizzes e perguntas
- Certificados
- Metas
- Propostas
- Modelos de proposta
- Contratos
- Settings

### Produtos

Cada produto possui:

- Logo ou placeholder substituivel por upload.
- Cor principal.
- Categoria.
- Descricao curta e completa.
- Publico-alvo.
- Dores.
- Beneficios.
- Argumentos de venda.
- Objecoes e respostas.
- Scripts de abordagem, WhatsApp e ligacao.
- Checklist de implantacao.
- Checklist de fechamento.
- Modulos, planos, precos, custos e regras vinculadas.

Produtos seedados:

- Vigia Amigo: ciano/azul, monitoramento inteligente, CFTV, alarme e interfone virtual.
- Wi-Facil: verde, hotspot white-label e captura de leads.
- AtendAI: roxo, atendimento WhatsApp Oficial/API Meta com IA de apoio.
- Pixel Facil: amarelo, TV corporativa, midia indoor e filas.
- 123 Encarte: rosa/magenta, cartazes e encartes integrados ao ERP.

### Propostas comerciais

O modulo de proposta funciona como um construtor de paginas:

- Criar proposta do zero.
- Selecionar cliente, vendedor, representante e parceiro.
- Adicionar produtos, modulos, setup, mensalidade, licencas e descontos.
- Adicionar paginas livres.
- Adicionar imagem A4 como pagina.
- Reordenar paginas.
- Duplicar paginas.
- Remover paginas.
- Salvar como rascunho.
- Versionar alteracoes.
- Duplicar proposta.
- Gerar PDF comercial.
- Registrar motivo de perda.
- Converter proposta aprovada em contrato.

Status:

- Rascunho
- Em revisao
- Enviada
- Em negociacao
- Aprovada
- Perdida
- Cancelada
- Convertida em contrato

### Comissoes e simulador

O motor de regras permite bases de calculo modulares:

- Setup
- Mensalidade
- Faturamento bruto
- Faturamento liquido
- Margem
- Regra personalizada documentada

O simulador calcula:

- Receita bruta.
- Receita liquida.
- Custo.
- Margem.
- Comissao do vendedor.
- Comissao do representante.
- Repasse do parceiro.
- Faturamento ProviderX.
- Percentual de meta atingida.
- Valor faltante para meta.
- Projecao mensal e anual.
- Ponto de equilibrio.
- Cenario conservador, base e agressivo.

### Playbook comercial

Area navegavel por produto com:

- Como vender.
- Para quem vender.
- Dores do cliente.
- Perguntas de diagnostico.
- Roteiro de apresentacao.
- Script de WhatsApp.
- Script de ligacao.
- Follow-up.
- Objecoes e respostas.
- Provas sociais.
- Comparativos.
- Checklist de proposta.
- Checklist de fechamento.
- Estrategias por produto, segmento, etapa e tipo de cliente.

### Conhecimento, provas e certificados

- Conteudos de texto, video, PDF, link, apresentacao e checklist.
- Trilhas por produto.
- Itens obrigatorios.
- Provas de conhecimento.
- Nota minima.
- Historico de tentativas.
- Certificado interno com nome do usuario, trilha, produto, data e nota.
- Modelo de certificado configuravel em settings.

### Apresentacoes e materiais

- Upload de PDF.
- Upload de PPT/PPTX.
- Upload de imagens.
- Upload de videos.
- Organizacao por produto.
- Tags e categorias.
- Controle de versao.
- Status publicado ou rascunho.
- Download e visualizacao quando possivel.
- Historico de alteracoes via logs.

### Relatorios

Relatorios com filtros:

- Vendas por periodo.
- Vendas por produto.
- Vendas por vendedor.
- Vendas por representante.
- Vendas por parceiro.
- Comissoes por periodo.
- Receita recorrente.
- Receita de setup.
- Propostas por status.
- Taxa de conversao.
- Produtos mais trabalhados.
- Produtos mais vendidos.
- Meta x realizado.
- Projecao de faturamento.
- Margem por produto.
- Margem por proposta.
- Conteudos concluidos.
- Pontuacao em provas.

Exportacao atual:

- CSV

### Logs e auditoria

Registra:

- Login.
- Logout.
- Criacao, edicao e exclusao de registros.
- Alteracao de preco.
- Alteracao de custo.
- Alteracao de comissao.
- Alteracao de proposta.
- Alteracao de contrato.
- Upload de arquivo.
- Download de arquivo.
- Geracao de PDF.
- Conversao de proposta em contrato.
- Alteracao de permissao.

Campos:

- Usuario.
- Acao.
- Modulo.
- ID do registro.
- Dados antigos quando aplicavel.
- Dados novos quando aplicavel.
- Data/hora.
- IP quando disponivel.

## Modelo de dados

O Prisma schema inclui, entre outros:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `products`
- `product_modules`
- `product_plans`
- `pricing_rules`
- `cost_rules`
- `commission_rules`
- `commission_bases`
- `commission_simulations`
- `companies`
- `partner_companies`
- `representatives`
- `sales_people`
- `proposals`
- `proposal_items`
- `proposal_pages`
- `proposal_templates`
- `proposal_versions`
- `contracts`
- `contract_items`
- `goals`
- `playbook_sections`
- `playbook_contents`
- `knowledge_contents`
- `knowledge_tracks`
- `knowledge_track_items`
- `quizzes`
- `quiz_questions`
- `quiz_answers`
- `quiz_attempts`
- `certificates`
- `uploaded_assets`
- `org_units`
- `audit_logs`
- `settings`

## Estrutura do repositorio

```text
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── docs/
│   ├── ARQUITETURA.md
│   ├── ESCOPO.md
│   └── OPERACAO.md
├── AUDITORIA_INICIAL.md
├── CHECKLIST_PORTAS_DOMINIOS_PROXY.md
├── ENV_VARS.md
├── README_DEPLOY.md
├── docker-compose.yml
├── docker-stack.yml
└── Dockerfile
```

## Desenvolvimento local

1. Configure variaveis:

```bash
cp .env.example .env
```

Edite `.env` com valores reais. Gere `AUTH_SECRET` com pelo menos 32 caracteres.

2. Instale dependencias:

```bash
npm install
```

3. Suba o PostgreSQL:

```bash
docker compose up -d providerx_db
```

4. Rode migrations e seed:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Rode a aplicacao:

```bash
npm run dev
```

Opcionalmente, rode app e banco via Compose:

```bash
docker compose up --build
```

## Variaveis de ambiente

Consulte [ENV_VARS.md](./ENV_VARS.md).

Minimo:

```env
DATABASE_URL="postgresql://providerx:senha@localhost:5432/providerx?schema=public"
POSTGRES_PASSWORD="senha-forte"
AUTH_SECRET="minimo-32-caracteres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
BOOTSTRAP_ADMIN_NAME="Admin ProviderX"
BOOTSTRAP_ADMIN_EMAIL="admin@providerx.local"
BOOTSTRAP_ADMIN_PASSWORD="senha-forte"
NORMAL_USER_EMAIL="usuario@providerx.local"
NORMAL_USER_PASSWORD="senha-forte"
```

Nunca commitar `.env`.

## Admin inicial

O seed cria o usuario Admin Master a partir de:

- `BOOTSTRAP_ADMIN_NAME`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`

O seed falha de proposito quando `BOOTSTRAP_ADMIN_PASSWORD` nao esta definido.

## Validacao

```bash
npm run lint
npm run typecheck
npx prisma validate
npm run build
npm audit --omit=dev
```

Validacao feita no servidor antes da publicacao:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docker build -t providerx-playbook:latest .`
- `docker service update --force providerx_providerx_web`
- Teste HTTP/HTTPS no dominio de producao
- Teste Playwright com usuario Visualizador e Admin Master

## Deploy

Consulte [README_DEPLOY.md](./README_DEPLOY.md).

Resumo:

```bash
docker build -t providerx-playbook:latest .

set -a
. ./.env
set +a

docker stack deploy -c docker-stack.yml providerx --resolve-image never
docker service update --force providerx_providerx_web
```

A stack nao publica portas no host. O roteamento e feito pelo Traefik existente na rede `n8nmikaelnet`.

## Auditoria inicial

A auditoria read-only do servidor esta documentada em [AUDITORIA_INICIAL.md](./AUDITORIA_INICIAL.md).

Checklist operacional:

- [CHECKLIST_PORTAS_DOMINIOS_PROXY.md](./CHECKLIST_PORTAS_DOMINIOS_PROXY.md)
- [README_DEPLOY.md](./README_DEPLOY.md)
- [ENV_VARS.md](./ENV_VARS.md)
- [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md)
- [CHANGELOG.md](./CHANGELOG.md)

## Padrao de versionamento e deploy

O app mostra a versao atual no login, na sidebar autenticada e na rota interna `/version`.

Todo deploy em producao deve seguir esta ordem:

1. Atualizar versao e changelog.
2. Rodar validacoes.
3. Commitar e fazer push no GitHub.
4. Fazer build Docker.
5. Atualizar a stack em producao.
6. Validar o dominio.

Deploy sem push previo no GitHub nao e permitido neste projeto.

## Roadmap

- Portal externo para representantes.
- Portal externo para parceiros.
- Visualizacao de proposta pelo cliente.
- Aceite digital.
- Exportacao XLSX.
- Exportacao PDF avancada de relatorios.
- Storage S3 compativel.
- Biblioteca oficial de logos e materiais por produto.
- Melhorias de design com componentes mais ricos por modulo.

## Licenca

Projeto proprietario ProviderX/Cariap.

Todos os direitos reservados. O uso, copia, distribuicao, sublicenciamento ou publicacao fora do contexto autorizado pela ProviderX/Cariap depende de permissao formal.
