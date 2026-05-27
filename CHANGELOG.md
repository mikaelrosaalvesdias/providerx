# Changelog

Todas as mudanças relevantes do ProviderX Planning Hub devem ser registradas neste arquivo.

## [0.2.1] - 2026-05-27

### Corrigido

- Adicionado ícone ProviderX em `public/icon.svg`.
- Metadados do app agora apontam para o ícone e evitam 404 de favicon no login.
- Fixado `HOSTNAME=0.0.0.0` na stack para o Next escutar nas redes Docker usadas pelo Traefik.

## [0.2.0] - 2026-05-27

### Alterado

- Produto reposicionado de Playbook Comercial para ProviderX Planning Hub.
- Dashboard convertido para Central executiva de planejamento.
- Menu simplificado para plano, verticais, produtos, receita, projeções, estratégia, organograma, materiais, decisões, relatórios, admin e logs.
- Login, sidebar, versão e documentação atualizados para o novo escopo.
- Imagem Docker renomeada para `providerx-planning-hub:latest`.

### Adicionado

- Entidades Prisma para plano de negócios, versões, verticais, produtos planejados, públicos-alvo, diferenciais, receita, cenários financeiros, custos, investimentos, canais, departamentos, cargos, organograma, materiais e decisões.
- Migration `20260527130000_planning_hub`.
- Seeds do plano ProviderX final.
- Plano de Negócios vivo com edição por seção, histórico, restauração e exportação Markdown/PDF.
- Projeções financeiras com comparação de cenários e simulador estratégico.
- Biblioteca de materiais estratégicos com upload.
- Registro de decisões estratégicas.
- Relatórios executivos com exportação CSV/Markdown.
- Auditoria técnica atualizada para o Planning Hub.

### Removido

- Rotas funcionais de propostas, contratos, conhecimento, playbook comercial, simulador de comissão e PDF de proposta.
- Componentes e server actions ligados a proposta, contrato, comissão, conhecimento e certificado.
- Recursos antigos do Admin que não fazem parte do MVP.

## [0.1.1] - 2026-05-27

### Adicionado

- Versão visível no app.
- Página interna `/version`.
- Documento `DESENVOLVIMENTO.md` com regra de commit/push antes de deploy.

## [0.1.0] - 2026-05-27

### Adicionado

- Primeira versão interna, depois substituída pelo escopo Planning Hub em `0.2.0`.
