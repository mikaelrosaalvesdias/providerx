# Arquitetura

## Visao geral

O ProviderX Playbook Comercial e uma aplicacao Next.js full-stack com PostgreSQL e Prisma.

O frontend, backend web, server actions, autenticacao, uploads e geracao de PDF ficam no mesmo projeto Next.js. A separacao principal e feita por dominios de negocio em `src/lib` e por rotas no App Router.

## Camadas

### Interface

Local:

- `src/app`
- `src/components`
- `src/app/globals.css`

Responsabilidades:

- Layout autenticado.
- Login.
- Dashboard.
- Admin.
- Propostas.
- Playbook.
- Conhecimento.
- Apresentacoes.
- Relatorios.
- Simulador.

### Dominio e regras

Local:

- `src/lib/commercial-rules.ts`
- `src/lib/simulator.ts`
- `src/lib/access-scope.ts`
- `src/lib/proposal-actions.ts`
- `src/lib/proposal-page-actions.ts`
- `src/lib/admin-actions.ts`
- `src/lib/upload-actions.ts`
- `src/lib/quiz-actions.ts`

Responsabilidades:

- Resolver preco por regra cadastrada.
- Resolver custo por regra cadastrada.
- Resolver comissao por regra cadastrada.
- Resolver repasse de parceiro.
- Calcular simulacao comercial.
- Criar e versionar propostas.
- Gerar contrato a partir de proposta.
- Registrar logs.
- Preparar escopo futuro de acesso externo.

### Persistencia

Local:

- `prisma/schema.prisma`
- `prisma/migrations`
- `src/lib/db.ts`

Banco:

- PostgreSQL.

ORM:

- Prisma Client.

## Autenticacao

Arquivo principal:

- `src/lib/auth.ts`

Fluxo:

1. Usuario informa email e senha.
2. Senha e validada com bcrypt.
3. Sessao e assinada com `AUTH_SECRET`.
4. Cookie `providerx_session` e salvo como HTTP-only.
5. Rotas autenticadas usam `requireUser`.
6. Rotas restritas usam `requireAnyPermission`.

## Permissoes

As permissoes ficam em banco.

Permissoes relevantes:

- `dashboard.view`
- `admin.manage`
- `products.manage`
- `pricing.manage`
- `commissions.manage`
- `people.manage`
- `proposals.manage`
- `proposals.view_own`
- `contracts.manage`
- `contracts.view_own`
- `playbook.manage`
- `knowledge.manage`
- `certificates.manage`
- `proposal_templates.manage`
- `org.manage`
- `reports.view`
- `logs.view`
- `portal.external`

O menu lateral e o dashboard filtram acoes por permissao. As rotas tambem verificam permissao no servidor.

## Regras comerciais

O projeto evita regra comercial fixa no codigo.

As regras principais ficam em:

- `pricing_rules`
- `cost_rules`
- `commission_bases`
- `commission_rules`
- `partner_companies`
- `product_modules`
- `product_plans`

O codigo apenas interpreta os cadastros.

## Propostas

Entidades principais:

- `proposals`
- `proposal_items`
- `proposal_pages`
- `proposal_templates`
- `proposal_versions`

Fluxo:

1. Criar proposta.
2. Adicionar itens comerciais.
3. Adicionar paginas.
4. Salvar versao.
5. Gerar PDF.
6. Aprovar.
7. Converter em contrato.

## Uploads

Configuracao:

- `UPLOAD_DIR`

Entidade:

- `uploaded_assets`

Tipos:

- Logos.
- PDFs.
- PPT/PPTX.
- Imagens.
- Videos.
- Paginas A4 de proposta.
- Contratos.

O upload local foi escolhido para o MVP. A estrutura permite troca posterior por storage S3 compativel.

## Logs

Entidade:

- `audit_logs`

Registra:

- Usuario.
- Acao.
- Entidade.
- ID do registro.
- Dados antigos.
- Dados novos.
- Metadata.
- IP.
- Data/hora.

## Deploy

O deploy atual usa:

- Docker Swarm.
- Stack `providerx`.
- Servico `providerx_providerx_web`.
- Servico `providerx_providerx_db`.
- Rede interna `providerx_providerx_internal`.
- Rede externa `n8nmikaelnet`.
- Traefik existente como reverse proxy.

O arquivo `docker-stack.yml` nao possui `ports:`. O Traefik roteia pelo label:

```text
Host(`providerx.n8nmikael.com.br`)
```

## Decisoes tecnicas

- Next.js App Router para entregar UI e backend web em um unico deploy.
- Prisma para schema versionado e legivel.
- PostgreSQL por robustez relacional e relatorios.
- Server Actions para reduzir camada API desnecessaria no MVP.
- Cookie HTTP-only para sessao segura.
- Docker Swarm por compatibilidade com a infraestrutura existente.
- Traefik existente para nao criar infraestrutura paralela.

## Pontos de evolucao

- Separar API se houver consumo externo real.
- Adicionar filas para geracao pesada de PDF ou processamento de midia.
- Adicionar storage S3.
- Adicionar assinatura digital.
- Adicionar portal externo com escopo por representante/parceiro/cliente.
- Adicionar testes automatizados de fluxo critico com Playwright.
