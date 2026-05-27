# Instrucoes de desenvolvimento

Este documento define o padrao obrigatorio para evoluir, versionar e publicar o ProviderX Playbook Comercial.

## Regra principal

Todo deploy em producao deve ter o codigo correspondente publicado no GitHub antes da atualizacao do servidor.

Repositorio oficial:

```text
https://github.com/mikaelrosaalvesdias/providerx
```

Nao fazer deploy de codigo que exista somente no servidor.

## Fluxo obrigatorio

1. Desenvolver a alteracao localmente.
2. Atualizar a versao no `package.json` quando houver mudanca de comportamento, visual, banco, deploy ou documentacao operacional.
3. Atualizar `CHANGELOG.md`.
4. Atualizar documentacao afetada.
5. Rodar validacoes.
6. Conferir que `.env`, secrets, builds e artefatos locais nao entram no Git.
7. Commitar.
8. Fazer push no GitHub.
9. Somente depois do push, fazer build Docker e deploy.
10. Validar a aplicacao em producao.

## Versionamento

O app exibe a versao atual em:

- Tela de login.
- Sidebar autenticada.
- Pagina interna `/version`.

Arquivos que devem ficar alinhados:

- `package.json`
- `package-lock.json`
- `src/lib/app-version.ts`
- `CHANGELOG.md`

Padrao:

- `PATCH`: ajustes visuais, documentacao, correcoes pequenas e melhorias operacionais.
- `MINOR`: novo modulo, novo fluxo ou funcionalidade relevante.
- `MAJOR`: mudanca incompatvel, reestruturacao grande ou quebra de contrato.

## Logs

Existem dois tipos de log:

### Log de versao

Arquivo:

```text
CHANGELOG.md
```

Uso:

- Registrar o que mudou em cada versao.
- Separar itens por `Adicionado`, `Alterado`, `Corrigido`, `Removido`, `Seguranca` ou `Padronizado`.
- Nao registrar senhas, tokens, dados sensiveis ou informacoes privadas de cliente.

### Log de auditoria do app

Tabela:

```text
audit_logs
```

Uso:

- Registrar login/logout.
- Registrar CRUDs.
- Registrar alteracao de preco, custo, comissao, proposta, contrato e permissao.
- Registrar upload/download.
- Registrar geracao de PDF.
- Registrar conversao de proposta em contrato.

## Validacoes antes de commit

```bash
npm run lint
npm run typecheck
npm run build
```

Quando schema Prisma mudar:

```bash
npx prisma validate
```

Quando dependencias mudarem:

```bash
npm audit --omit=dev
```

## Checklist antes de push

```bash
git status -sb
git diff --stat
```

Confirmar que nao existem:

- `.env`
- `.env.*` com secrets
- `node_modules/`
- `.next/`
- `.playwright-cli/`
- `uploads/` com arquivos reais
- Dumps de banco
- Backups compactados
- Tokens ou senhas em README/docs

## Commit

Use mensagem curta e objetiva:

```bash
git add -A
git commit -m "Add app version and development workflow"
git push origin main
```

Se houver branch de trabalho, abrir PR antes de merge.

## Deploy depois do push

No servidor:

```bash
cd /opt/providerx
docker build -t providerx-playbook:latest .

set -a
. ./.env
set +a

docker stack deploy -c docker-stack.yml providerx --resolve-image never
docker service update --force providerx_providerx_web
```

## Validacao pos-deploy

```bash
docker service ls | grep providerx
docker service ps providerx_providerx_web
curl -I https://providerx.n8nmikael.com.br/login
```

Validar no navegador:

- Login mostra versao correta.
- Sidebar mostra versao correta.
- `/version` abre.
- Usuario Visualizador nao ve Admin.
- `/admin` redireciona usuario sem permissao.
- Admin Master acessa Admin.
- Logs de auditoria continuam registrando acoes criticas.

## Proibido

- Fazer deploy sem push no GitHub.
- Subir `.env`.
- Hardcodar secrets.
- Hardcodar preco, custo, comissao, repasse ou regra comercial fora de seed inicial.
- Alterar proxy, porta ou stack global sem auditoria e backup.
- Expor porta publica nova sem Traefik/reverse proxy existente.
