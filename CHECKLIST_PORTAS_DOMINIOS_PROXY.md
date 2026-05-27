# Checklist de portas, domínios e reverse proxy

## Estado observado

- Reverse proxy ativo: Traefik em Docker Swarm.
- Serviço: `traefik_traefik`.
- Rede externa do proxy: `n8nmikaelnet`.
- Portas públicas `80/tcp` e `443/tcp` já usadas pelo Traefik.
- `nginx.service`: inativo.
- `caddy.service`: inativo/não usado.
- `apache2.service`: inativo/não usado.
- Stack ProviderX atual: `providerx`.
- Serviços ProviderX: `providerx_providerx_web` e `providerx_providerx_db`.
- Banco ProviderX fica na rede interna da stack.

## Domínios

- Atual funcional: `providerx.n8nmikael.com.br`.
- Final solicitado: `providerx.cariap.com.br`.
- Auditoria de 2026-05-27: `providerx.cariap.com.br` ainda não resolvia DNS.

## Regras

- [x] Não usar `80/tcp` diretamente pela aplicação.
- [x] Não usar `443/tcp` diretamente pela aplicação.
- [x] Não expor PostgreSQL no host.
- [x] Não publicar porta pública nova para o ProviderX.
- [x] Usar Traefik pela rede `n8nmikaelnet`.
- [x] Manter serviço web ouvindo apenas na porta interna `3000`.
- [x] Fazer backup antes de alteração em produção.
- [x] Fazer commit e push no GitHub antes de deploy.
- [ ] Trocar `PROVIDERX_HOST` para `providerx.cariap.com.br` somente após DNS resolver para o servidor.

## Labels Traefik esperadas

O `docker-stack.yml` usa:

- `traefik.enable=true`
- `traefik.docker.network=n8nmikaelnet`
- `traefik.http.routers.providerx.entrypoints=websecure`
- `traefik.http.routers.providerx.rule=Host(${PROVIDERX_HOST})`
- `traefik.http.routers.providerx.tls=true`
- `traefik.http.routers.providerx.tls.certresolver=letsencrypt`
- `traefik.http.services.providerx.loadbalancer.server.port=3000`

## Variáveis de roteamento

Enquanto DNS final não estiver pronto:

```env
PROVIDERX_HOST=providerx.n8nmikael.com.br
NEXT_PUBLIC_APP_URL=https://providerx.n8nmikael.com.br
```

Quando DNS final estiver pronto:

```env
PROVIDERX_HOST=providerx.cariap.com.br
NEXT_PUBLIC_APP_URL=https://providerx.cariap.com.br
```

Depois da troca:

```bash
docker stack deploy -c docker-stack.yml providerx --resolve-image never
docker service update --force providerx_providerx_web
curl -I https://providerx.cariap.com.br/login
```
