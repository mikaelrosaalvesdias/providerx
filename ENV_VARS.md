# Variaveis de ambiente

## Obrigatorias em producao

`POSTGRES_PASSWORD`
: Senha do usuario `providerx` no Postgres da stack. Nao commitar.

`DATABASE_URL`
: URL PostgreSQL usada pela app e pelo Prisma. Na stack e montada como `postgresql://providerx:${POSTGRES_PASSWORD}@providerx_db:5432/providerx?schema=public`.

`AUTH_SECRET`
: Secret de assinatura da sessao. Minimo de 32 caracteres. Gere com `openssl rand -base64 48`.

`NEXT_PUBLIC_APP_URL`
: URL publica da aplicacao. Final: `https://providerx.cariap.com.br`. Enquanto DNS final nao estiver ativo, usar `https://providerx.n8nmikael.com.br`.

`PROVIDERX_HOST`
: Host usado nas labels Traefik. Final: `providerx.cariap.com.br`. Enquanto DNS final nao estiver ativo, usar `providerx.n8nmikael.com.br`.

`UPLOAD_DIR`
: Diretorio de upload. Producao no container: `/app/uploads`.

`BOOTSTRAP_ADMIN_EMAIL`
: E-mail do admin inicial criado pelo seed.

`BOOTSTRAP_ADMIN_PASSWORD`
: Senha inicial do admin. Obrigatoria para o seed.

## Opcionais

`BOOTSTRAP_ADMIN_NAME`
: Nome do admin inicial. Padrao sugerido: `Admin ProviderX`.

## Exemplo seguro de geracao

```bash
openssl rand -base64 48
```

Use um valor diferente para `POSTGRES_PASSWORD`, `AUTH_SECRET` e `BOOTSTRAP_ADMIN_PASSWORD`.
