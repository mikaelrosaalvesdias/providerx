# Instruções de desenvolvimento

Este documento define o padrão obrigatório para evoluir, versionar e publicar o ProviderX Planning Hub.

## Regra principal

Todo deploy em produção deve ter o código correspondente publicado no GitHub antes da atualização do servidor.

Repositório oficial:

```text
https://github.com/mikaelrosaalvesdias/providerx
```

Não fazer deploy de código que exista somente no servidor.

## Escopo atual

O sistema é um hub interno de planejamento de produtos e negócio.

Não criar módulos de:

- propostas;
- contratos;
- CRM;
- funil comercial;
- conhecimento;
- quizzes;
- certificados;
- comissões;
- portal externo.

## Fluxo obrigatório

1. Desenvolver a alteração.
2. Atualizar versão em `package.json` quando mudar comportamento, visual, banco, deploy ou documentação operacional.
3. Atualizar `package-lock.json`.
4. Atualizar `src/lib/app-version.ts`.
5. Atualizar `CHANGELOG.md`.
6. Atualizar documentação afetada.
7. Rodar validações.
8. Conferir que secrets e artefatos locais não entram no Git.
9. Commitar.
10. Fazer push no GitHub.
11. Só depois fazer build Docker e deploy.
12. Validar produção.

## Versionamento

O app exibe a versão em:

- `/login`
- sidebar autenticada
- `/version`

Arquivos que devem ficar alinhados:

- `package.json`
- `package-lock.json`
- `src/lib/app-version.ts`
- `CHANGELOG.md`

Critério:

- `PATCH`: correções pequenas, ajustes visuais e documentação.
- `MINOR`: novo módulo, novo fluxo ou mudança relevante.
- `MAJOR`: reestruturação incompatível.

## Logs

### Changelog

Arquivo:

```text
CHANGELOG.md
```

Registrar o que mudou por versão. Não registrar senhas, tokens, dados sensíveis ou informações privadas.

### Auditoria do app

Tabela:

```text
audit_logs
```

Registrar:

- login/logout;
- edição do plano;
- restauração de versão;
- criação/edição de verticais e produtos;
- alteração de projeções;
- alteração de custos;
- upload/download de material;
- criação de decisão;
- alteração de organograma;
- alteração de permissão.

## Validações

```bash
npx prisma validate
npm run lint
npm run typecheck
npm run build
```

Quando dependências mudarem:

```bash
npm audit --omit=dev
```

## Checklist antes de push

```bash
git status -sb
git diff --stat
```

Não enviar:

- `.env`
- `.env.*` com secrets
- `node_modules/`
- `.next/`
- `.playwright-cli/`
- `uploads/` com arquivos reais
- dumps de banco
- backups
- tokens ou senhas

## Commit e push

```bash
git add -A
git commit -m "Pivot to ProviderX Planning Hub"
git push origin main
```

## Deploy

O deploy só acontece depois do push.

Consulte `README_DEPLOY.md`.
