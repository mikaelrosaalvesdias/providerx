# Deploy ProviderX Planning Hub

Este projeto deve seguir o padrão já encontrado no servidor: Docker Swarm + Traefik. Não publicar portas 80/443 pela aplicação.

## Regra obrigatória

Todo deploy em produção precisa estar publicado no GitHub antes da atualização da stack.

Repositório:

```text
https://github.com/mikaelrosaalvesdias/providerx
```

Fluxo obrigatório:

```bash
npm run lint
npm run typecheck
npm run build
git status -sb
git add -A
git commit -m "Descricao objetiva"
git push origin main
```

Depois do push, seguir o deploy.

## Infraestrutura auditada

- Docker Swarm ativo.
- Stack ProviderX atual: `providerx`.
- Serviços: `providerx_providerx_web` e `providerx_providerx_db`.
- Reverse proxy: Traefik em Docker Swarm.
- Rede externa do Traefik: `n8nmikaelnet`.
- Nginx, Caddy e Apache systemd inativos.
- Portas 80/443 usadas pelo Traefik/Docker, não pela aplicação.
- Domínio atualmente funcional: `providerx.n8nmikael.com.br`.
- Domínio final solicitado: `providerx.cariap.com.br`.
- Em 2026-05-27, `providerx.cariap.com.br` não resolvia DNS neste servidor; só trocar `PROVIDERX_HOST` quando DNS estiver apontado.

## Variáveis

`.env` não deve ser sobrescrito.

Variáveis esperadas:

```env
POSTGRES_PASSWORD="..."
DATABASE_URL="postgresql://providerx:...@providerx_db:5432/providerx?schema=public"
AUTH_SECRET="..."
PROVIDERX_HOST="providerx.cariap.com.br"
NEXT_PUBLIC_APP_URL="https://providerx.cariap.com.br"
UPLOAD_DIR="/app/uploads"
BOOTSTRAP_ADMIN_NAME="Admin ProviderX"
BOOTSTRAP_ADMIN_EMAIL="admin@providerx.local"
BOOTSTRAP_ADMIN_PASSWORD="..."
```

Enquanto o DNS final não estiver ativo, manter:

```env
PROVIDERX_HOST="providerx.n8nmikael.com.br"
NEXT_PUBLIC_APP_URL="https://providerx.n8nmikael.com.br"
```

## Backup antes de produção

```bash
BACKUP_DIR="/opt/backups/providerx/$(date +%Y%m%d_%H%M%S)_before_0.2.0"
mkdir -p "$BACKUP_DIR"
cp -a /opt/providerx "$BACKUP_DIR/providerx-files"

DB_CONTAINER="$(docker ps --filter name=providerx_providerx_db -q | head -n1)"
docker exec -t "$DB_CONTAINER" pg_dump -U providerx providerx > "$BACKUP_DIR/providerx.sql"
```

## Build

```bash
cd /opt/providerx
docker build -t providerx-planning-hub:latest .
```

## Migration e seed

Executar dentro da rede interna da stack, porque `providerx_db` resolve por DNS do Docker.

```bash
cd /opt/providerx
set -a
. ./.env
set +a

docker run --rm \
  --network providerx_providerx_internal \
  -e DATABASE_URL="postgresql://providerx:${POSTGRES_PASSWORD}@providerx_db:5432/providerx?schema=public" \
  -e BOOTSTRAP_ADMIN_NAME="${BOOTSTRAP_ADMIN_NAME}" \
  -e BOOTSTRAP_ADMIN_EMAIL="${BOOTSTRAP_ADMIN_EMAIL}" \
  -e BOOTSTRAP_ADMIN_PASSWORD="${BOOTSTRAP_ADMIN_PASSWORD}" \
  providerx-planning-hub:latest \
  sh -lc "npx prisma migrate deploy && npx prisma db seed"
```

## Deploy da stack

```bash
cd /opt/providerx
set -a
. ./.env
set +a

docker stack deploy -c docker-stack.yml providerx --resolve-image never
docker service update --force providerx_providerx_web
```

## Verificação

```bash
docker service ls | grep providerx
docker service ps providerx_providerx_web
docker service logs providerx_providerx_web --tail 120
curl -I "https://${PROVIDERX_HOST}/login"
```

Validar no navegador:

- Login.
- Central.
- Plano de Negócios.
- Verticais.
- Produtos.
- Modelo de Receita.
- Projeções.
- Estratégia.
- Organograma.
- Materiais.
- Decisões.
- Relatórios.
- Admin.
- Logs.
- `/version`.

Rotas que não devem existir no MVP:

- `/proposals`
- `/contracts`
- `/knowledge`
- `/simulator`
- `/playbook/*`

## Rollback

Rollback de aplicação:

```bash
docker service update --image providerx-planning-hub:TAG_ANTERIOR providerx_providerx_web
```

Rollback de banco somente com janela de manutenção:

```bash
cat "$BACKUP_DIR/providerx.sql" | docker exec -i "$DB_CONTAINER" psql -U providerx providerx
```

## Regras de segurança

- Não editar Traefik sem backup.
- Não publicar portas novas.
- Não usar 80/443 diretamente.
- Não commitar `.env`.
- Não hardcodar secrets.
- Não rodar deploy sem commit e push.
