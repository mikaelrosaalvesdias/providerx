# Operacao

## Ambientes

### Desenvolvimento

Uso local com:

- Node.js.
- npm.
- Docker Compose.
- PostgreSQL local via container.

### Producao

Uso atual:

- Docker Swarm.
- Traefik existente.
- PostgreSQL em container Swarm.
- Aplicacao Next.js em container Swarm.
- Dominio `providerx.n8nmikael.com.br`.

## Rotina de atualizacao

1. Revisar mudancas.
2. Validar `.env.example` e documentacao.
3. Rodar verificacoes:

```bash
npm run lint
npm run typecheck
npm run build
```

4. Fazer backup:

```bash
BACKUP_DIR="/opt/backups/providerx/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/providerx-files-before-deploy.tgz" -C /opt providerx
docker exec -t $(docker ps --filter name=providerx_providerx_db -q | head -n1) pg_dump -U providerx providerx > "$BACKUP_DIR/providerx.sql"
```

5. Build:

```bash
docker build -t providerx-playbook:latest .
```

6. Deploy:

```bash
set -a
. ./.env
set +a
docker stack deploy -c docker-stack.yml providerx --resolve-image never
docker service update --force providerx_providerx_web
```

7. Verificacao:

```bash
docker service ls | grep providerx
docker service ps providerx_providerx_web
curl -I https://providerx.n8nmikael.com.br/login
```

## Rotina de banco

Aplicar migrations:

```bash
npm run prisma:migrate
```

Rodar seed:

```bash
npm run prisma:seed
```

Em producao, preferir rodar em container one-off na rede interna conforme [README_DEPLOY.md](../README_DEPLOY.md).

## Backup

Backup minimo antes de mudancas:

- Arquivos do projeto.
- Dump PostgreSQL.
- `.env` protegido no servidor.
- Volume de uploads se existir conteudo real.

Nunca versionar `.env`.

## Rollback

Rollback de aplicacao:

```bash
docker service update --image providerx-playbook:TAG_ANTERIOR providerx_providerx_web
```

Rollback de banco:

```bash
cat backup.sql | docker exec -i $(docker ps --filter name=providerx_providerx_db -q | head -n1) psql -U providerx providerx
```

Restauracao de banco deve ser feita em janela controlada.

## Contas iniciais

O seed usa variaveis:

- `BOOTSTRAP_ADMIN_NAME`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`

Nao existem senhas fixas no repositorio.

## Regras de seguranca

- Nao commitar `.env`.
- Nao publicar portas novas sem passar pelo proxy existente.
- Nao usar 80/443 diretamente na aplicacao.
- Nao alterar Traefik sem auditoria e backup.
- Nao hardcodar secrets.
- Nao subir senha real em README, issue, PR ou commit.
- Rotas sensiveis devem usar `requireAnyPermission`.
- Links de interface devem ser filtrados por permissao, mas a seguranca real deve ficar no servidor.

## Checklist pos-deploy

- Login responde.
- Dashboard abre.
- Usuario Visualizador nao ve Admin.
- `/admin` redireciona usuario sem permissao.
- Admin Master abre Admin.
- Modal de criacao/edicao abre.
- Upload funciona.
- PDF de proposta gera.
- Logs registram acoes.
- Servicos Swarm ficam `1/1`.
- HTTPS responde sem erro de certificado.
