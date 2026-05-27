# Changelog

Todas as mudancas relevantes do ProviderX Playbook Comercial devem ser registradas neste arquivo.

O projeto usa versao semantica no `package.json`:

- `MAJOR`: mudancas incompatveis ou reestruturacoes grandes.
- `MINOR`: novos modulos, fluxos ou funcionalidades.
- `PATCH`: ajustes visuais, correcoes, documentacao e melhorias operacionais.

## [0.1.1] - 2026-05-27

### Adicionado

- Versao visivel no app.
- Link de versao na sidebar autenticada.
- Versao visivel na tela de login.
- Pagina interna `/version` com release atual, changelog do release e padrao de deploy.
- `DESENVOLVIMENTO.md` com fluxo obrigatorio de desenvolvimento, GitHub, validacao e deploy.

### Padronizado

- Todo deploy deve ter commit e push no GitHub antes da atualizacao em producao.
- Toda alteracao publicada deve atualizar versao quando alterar comportamento, visual, dados, deploy ou documentacao operacional.

## [0.1.0] - 2026-05-27

### Adicionado

- MVP inicial do ProviderX Playbook Comercial.
- Login e sessao segura.
- Dashboard comercial.
- Admin modular.
- Produtos iniciais via seed.
- Playbook por produto.
- Propostas com paginas, versionamento, PDF e conversao em contrato.
- Contratos.
- Simulador de comissao, meta, margem e repasse.
- Apresentacoes e uploads.
- Conhecimento, quizzes e certificados.
- Relatorios CSV.
- Logs de auditoria.
- Documentacao de deploy, auditoria, variaveis e checklist de proxy.
