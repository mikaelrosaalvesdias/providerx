# Deploy ProviderX em providerx.n8nmikael.com.br

Este procedimento respeita a auditoria inicial: nao usa portas 80/443 diretamente, nao publica porta nova no host e usa Traefik via Docker Swarm.

## Regra obrigatoria de Git

Todo deploy em producao deve ter commit e push no GitHub antes da atualizacao do servidor.

Repositorio oficial:

`https://github.com/mikaelrosaalvesdias/providerx`

Antes de publicar:

```bash
npm run lint
npm run typecheck
npm run build
git status -sb
git add -A
git commit -m "Descricao objetiva da alteracao"
git push origin main
```

Nao fazer deploy de codigo que exista somente no servidor. Consulte `DESENVOLVIMENTO.md`.

## Pre-requisitos confirmados

- Docker Swarm ativo.
- Reverse proxy atual: `traefik_traefik` em Docker Swarm.
- Network usada pelo Traefik: `n8nmikaelnet`.
- Dominio atual do deploy: `providerx.n8nmikael.com.br`.
- `providerx.n8nmikael.com.br` resolve para `213.199.32.244` na verificacao read-only de 2026-05-25.
- `curl -I https://providerx.n8nmikael.com.br` retornou erro de certificado self-signed antes do deploy ProviderX.
- Nginx systemd esta inativo; Caddy/Apache nao encontrados.

## Antes do deploy

1. Configurar DNS:

`providerx.n8nmikael.com.br` deve apontar para o IP publico deste servidor.

2. Criar `.env` sem sobrescrever arquivo existente:

```bash
cd /opt/providerx
test ! -f .env && cp .env.example .env
```

3. Definir secrets fortes:

```bash
openssl rand -base64 48
```

Preencha no `.env`:

- `POSTGRES_PASSWORD`
- `AUTH_SECRET`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `BOOTSTRAP_ADMIN_NAME`

4. Backup antes de mudancas de producao:

```bash
BACKUP_DIR="/opt/backups/providerx/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -a /opt/providerx "$BACKUP_DIR/providerx-files"
```

Se ja existir stack ProviderX em producao, gere dump antes de atualizar:

```bash
docker exec -t $(docker ps --filter name=providerx_db -q | head -n1) pg_dump -U providerx providerx > /opt/backups/providerx/providerx_$(date +%Y%m%d_%H%M%S).sql
```

## Build da imagem

```bash
cd /opt/providerx
docker build -t providerx-playbook:latest .
```

## Deploy da stack

Carregue as variaveis e publique a stack. O arquivo `docker-stack.yml` nao contem `ports:`.

```bash
cd /opt/providerx
set -a
. ./.env
set +a
docker stack deploy -c docker-stack.yml providerx --resolve-image never
```

## Migrations e seed

A rede interna da stack e `providerx_providerx_internal` e foi marcada como `attachable` para execucao one-off.

```bash
cd /opt/providerx
set -a
. ./.env
set +a

docker run --rm \
  --network providerx_providerx_internal \
  -e DATABASE_URL="postgresql://providerx:${POSTGRES_PASSWORD}@providerx_providerx_db:5432/providerx?schema=public" \
  -e BOOTSTRAP_ADMIN_NAME="${BOOTSTRAP_ADMIN_NAME}" \
  -e BOOTSTRAP_ADMIN_EMAIL="${BOOTSTRAP_ADMIN_EMAIL}" \
  -e BOOTSTRAP_ADMIN_PASSWORD="${BOOTSTRAP_ADMIN_PASSWORD}" \
  providerx-playbook:latest \
  sh -lc "npx prisma migrate deploy && npx prisma db seed"
```

## Verificacao

```bash
docker service ls | grep providerx
docker service ps providerx_providerx_web
docker service logs providerx_providerx_web --tail 100
curl -I https://providerx.n8nmikael.com.br
```

Validar no navegador:

- Login
- Dashboard
- Admin > Produtos
- Admin > Bases de comissao
- Admin > Modelos de proposta
- Propostas > Nova proposta
- Propostas > Construtor de paginas e PDF
- Conversao em contrato
- Upload em Apresentacoes
- Quiz em Conhecimento
- Certificado emitido apos quiz aprovado
- Logs

## Status atual

Deploy executado em 2026-05-25:

- Stack Swarm: `providerx`
- Servicos: `providerx_providerx_db` e `providerx_providerx_web`
- Imagem: `providerx-playbook:latest`
- Rota: `https://providerx.n8nmikael.com.br`
- HTTP: `http://providerx.n8nmikael.com.br` redireciona com `308` para HTTPS
- Certificado: Let's Encrypt, issuer `R12`
- `/` responde `307` para `/login`
- `/login` responde `200`
- Banco seedado com 1 usuario inicial, 5 produtos e 8 perfis
- Admin inicial: `admin@providerx.local`; senha atual armazenada em `BOOTSTRAP_ADMIN_PASSWORD` no `.env` local do servidor

O codigo foi validado localmente em 2026-05-25 com:

```bash
npm run lint
npm run typecheck
DATABASE_URL="postgresql://user:pass@localhost:5432/providerx?schema=public" npx prisma validate
DATABASE_URL="postgresql://user:pass@localhost:5432/providerx?schema=public" AUTH_SECRET="build-only-secret-with-32-characters" npm run build
npm audit --omit=dev
```

O deploy ja foi executado. Para novas atualizacoes, repetir backup, build de imagem, `docker stack deploy`, migrations e verificacoes.

## Rollback

1. Reverter para imagem anterior se houver tag:

```bash
docker service update --image providerx-playbook:TAG_ANTERIOR providerx_providerx_web
```

2. Restaurar dump, se necessario, somente com janela de manutencao:

```bash
cat backup.sql | docker exec -i $(docker ps --filter name=providerx_db -q | head -n1) psql -U providerx providerx
```

## Regras operacionais

- Nao editar `/opt/traefik/stack.yml` para este deploy.
- Nao publicar portas no servico ProviderX.
- Nao usar `80` ou `443` diretamente.
- Nao commitar `.env`.
- Nao trocar secrets sem registrar janela e plano de rollback.
