# Auditoria inicial ProviderX Planning Hub

Data: 2026-05-27  
Diretório auditado: `/opt/providerx`

## Objetivo

Auditoria read-only antes de alterar escopo, deploy, portas, proxy ou infraestrutura do ProviderX Planning Hub.

## Estrutura encontrada

- Projeto existente em `/opt/providerx`.
- Stack Node/Next.js com Prisma e PostgreSQL.
- Arquivos principais:
  - `package.json`
  - `prisma/schema.prisma`
  - `docker-compose.yml`
  - `docker-stack.yml`
  - `.env.example`
  - `Dockerfile`
- Arquivo `.env` existente foi preservado e não foi sobrescrito.
- Pacote visual encontrado:
  - `PROVIDERX REDSIGNER/`
  - `PROVIDERX.zip`

## Pacote visual Claude Designer

Encontrado:

- `login.jsx`
- `dashboard.jsx`
- `simulator.jsx`
- `shell.jsx`
- `primitives.jsx`
- `modals.jsx`
- `styles.css`

Não encontrados no pacote:

- `knowledge.jsx`
- `materials.jsx`
- `admin.jsx`
- `reports.jsx`
- `playbook.jsx`

Decisão:

- Aproveitar tema dark/neon, shell, login/dashboard e conceitos visuais.
- Não implementar `proposals.jsx`.
- Não implementar `knowledge.jsx`.
- Adaptar simulador para projeção financeira estratégica.

## Apps e serviços

Ambiente usa Docker Swarm.

Stack ProviderX atual:

- `providerx`
- `providerx_providerx_web`
- `providerx_providerx_db`

Reverse proxy:

- Traefik em Docker Swarm.
- Rede externa: `n8nmikaelnet`.

Serviços systemd verificados:

- `nginx`: inativo.
- `caddy`: inativo/não usado.
- `apache2`: inativo/não usado.

## Portas e roteamento

- Portas 80/443 pertencem ao Traefik/Docker.
- A aplicação não deve usar 80/443 diretamente.
- Não deve ser criada porta pública nova.
- `docker-stack.yml` conecta o serviço web à rede `n8nmikaelnet`.
- Roteamento atual por labels Traefik.

Domínios:

- `providerx.n8nmikael.com.br` estava resolvendo para o servidor e funcionando como domínio atual.
- `providerx.cariap.com.br` não resolvia DNS na auditoria de 2026-05-27.

Decisão:

- Manter deploy funcional no domínio atual até o DNS final estar pronto.
- Deixar `PROVIDERX_HOST` e `NEXT_PUBLIC_APP_URL` configuráveis.

## Restrições respeitadas

- Nenhum serviço existente foi parado durante a auditoria.
- Nenhuma porta 80/443 foi usada diretamente pela aplicação.
- Nenhuma porta pública nova foi exposta.
- `.env` existente não foi sobrescrito.
- Secrets não foram hardcodados.
- Mudanças de produção exigem backup e push no GitHub antes do deploy.

## Padrão técnico definido

- Next.js App Router.
- TypeScript.
- Prisma.
- PostgreSQL.
- Docker Swarm.
- Traefik.
- Upload local em volume Docker.

## Próximos passos seguros

1. Commit e push no GitHub.
2. Backup de arquivos e banco.
3. Build da imagem `providerx-planning-hub:latest`.
4. Rodar migration e seed dentro da rede `providerx_providerx_internal`.
5. Atualizar stack via Docker Swarm.
6. Validar `/login`, `/dashboard`, `/business-plan`, `/materials`, `/reports`, `/version`.
7. Só trocar para `providerx.cariap.com.br` quando DNS resolver corretamente para este servidor.
