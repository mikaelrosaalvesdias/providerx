# Checklist de portas, dominios e reverse proxy

## Estado observado na auditoria

- `/opt/providerx` estava vazio antes da implementacao.
- Reverse proxy ativo: Traefik em Docker Swarm.
- Servico: `traefik_traefik`.
- Imagem ativa: `traefik:v2.11`.
- Portas publicas do proxy: `80/tcp` e `443/tcp`, ambas ja em uso pelo Docker/Traefik.
- Network Traefik: `n8nmikaelnet`.
- `nginx.service`: inativo.
- `caddy.service`: nao encontrado.
- `apache2.service`: nao encontrado.
- Nao havia rota Traefik nem referencia em arquivos para `providerx.cariap.com.br`.
- DNS de `providerx.cariap.com.br` nao resolvia no momento da auditoria.

## Checklist antes de subir

- [x] DNS `providerx.n8nmikael.com.br` resolve para `213.199.32.244` em verificacao read-only de 2026-05-25.
- [x] TLS de `providerx.n8nmikael.com.br` emitido corretamente pelo Traefik/Let's Encrypt.
- [x] `.env` criado a partir de `.env.example`, sem sobrescrever arquivo existente.
- [x] `POSTGRES_PASSWORD` definido com secret forte.
- [x] `AUTH_SECRET` com pelo menos 32 caracteres.
- [x] `BOOTSTRAP_ADMIN_PASSWORD` definido.
- [x] Backup de `/opt/providerx` criado em `/opt/backups/providerx/20260525_202809`.
- [ ] Se houver banco existente, dump PostgreSQL criado.
- [x] Imagem `providerx-playbook:latest` buildada localmente.
- [x] `docker-stack.yml` revisado e sem `ports:`.
- [x] Servico web anexado a `n8nmikaelnet`.
- [x] Label `traefik.http.routers.providerx.rule=Host(\`providerx.n8nmikael.com.br\`)` confirmada.
- [x] Label HTTP `providerx-http` confirmada para redirecionar `http://` para `https://`.
- [x] Label `traefik.http.services.providerx.loadbalancer.server.port=3000` confirmada.
- [x] Certresolver `letsencrypt` disponivel no Traefik ativo.
- [x] Migrations aplicadas com `npx prisma migrate deploy`.
- [x] Seed executado com `BOOTSTRAP_ADMIN_PASSWORD` real.
- [x] Login disponivel em `https://providerx.n8nmikael.com.br/login`.

## Portas que nao devem ser usadas diretamente

- `80/tcp`
- `443/tcp`
- `5432/tcp` no host

O Postgres ProviderX deve permanecer somente na rede interna da stack.

## Rota esperada

- Dominio: `providerx.n8nmikael.com.br`
- Entrypoint: `websecure`
- HTTP: redireciona permanentemente para HTTPS
- TLS: habilitado
- Resolver: `letsencrypt`
- Porta interna da app: `3000`
- Sem porta publica nova no host
