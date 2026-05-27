# Auditoria inicial do servidor - ProviderX Playbook Comercial

Data da auditoria: 2026-05-25  
Diretorio alvo: `/opt/providerx`  
Modo da auditoria: read-only, sem parada de servicos, sem deploy, sem alteracao de proxy e sem exposicao de porta.

## 1. Estrutura atual

- `/opt/providerx` existe e esta vazio no inicio do trabalho.
- `/opt` contem varios apps e stacks existentes, incluindo: `aptidao-app`, `automacoes_c2tech`, `automacoes_california`, `buscalead`, `cariapp`, `caripost`, `chatwoot_cariap`, `chatwoot_meuvendedor`, `disparador-frontend`, `evo-ai`, `evolution`, `evolution-manager-v2`, `gestao_cariap`, `graficos_cariap`, `kanban-atendimento`, `links`, `listmonk`, `mailserver`, `media-api`, `n8n-dashboard`, `retencao_teste`, `sdr_meuvendedor`, `sorteio-abramult`, `traefik`, `wekan`, `whatsapp-dispatcher-apple`, entre outros.
- Arquivos de compose/stack encontrados em `/opt` incluem:
  - `/opt/traefik/stack.yml`
  - `/opt/aptidao-app/docker-compose.yml`
  - `/opt/automacoes_c2tech/docker-compose.yml`
  - `/opt/automacoes_california/docker-compose.yml`
  - `/opt/chatwoot_meuvendedor/docker-compose.yml`
  - `/opt/deploy/backend-proxy/docker-compose.yml`
  - `/opt/deploy/evo-crm-community/docker-compose.swarm.yml`
  - `/opt/disparador-frontend/docker-compose.yml`
  - `/opt/evolution-manager-v2/docker-compose.yml`
  - `/opt/formulario-loucos/stack.yml`
  - `/opt/graficos_cariap/app/docker-compose.yml`
  - `/opt/kanban-atendimento/docker-compose.yml`
  - `/opt/links/docker-compose.yml`
  - `/opt/listmonk/docker-compose.yml`
  - `/opt/mailserver/docker-compose.yml`
  - `/opt/sdr_meuvendedor/docker-compose.yml`
  - `/opt/sorteio-abramult/stack.yml`
  - `/opt/wekan/docker-compose.yml`
  - `/opt/whatsapp-dispatcher-apple/docker-compose.yml`

## 2. Apps/stacks instalados

Docker Swarm esta ativo em um unico node manager:

- Node: `n8nmikaelnet`
- Swarm: `active`
- Manager: `Leader`
- Docker Engine: `29.1.5`

Stacks Swarm identificadas:

- `appsmith-stack`
- `aptidao`
- `automacoes_california`
- `backend-proxy`
- `cariapp`
- `chatmika`
- `chatwoot`
- `chatwoot-meuvendedor`
- `clawdbot`
- `disparador-frontend`
- `evo-crm`
- `evolution`
- `evolution-go`
- `evolution_manager_v2`
- `formulario-loucos`
- `gestao-cariap`
- `glpi`
- `help-californiatv`
- `links`
- `metaporn`
- `metaporn-minio`
- `meuvendedor-panel`
- `midia-stack`
- `mikael_ai`
- `moodle`
- `mysql`
- `n8n`
- `nocodb`
- `paperclip`
- `pgvector`
- `portainer`
- `postgres`
- `redis`
- `sorteio`
- `traefik`
- `twentycrm`
- `wekan`

Projetos Docker Compose standalone identificados por `docker compose ls`:

- `app` em `/opt/graficos_cariap/app/docker-compose.yml`
- `automacoes_c2tech` em `/opt/automacoes_c2tech/docker-compose.yml`
- `backend-proxy` em `/opt/deploy/backend-proxy/docker-compose.yml`
- `deezer-dashboard` em `/root/clawd/deezer-dashboard/docker-compose.yml`
- `landing-upload` em `/root/clawd/landing-upload/docker-compose.yml`
- `listmonk` em `/opt/listmonk/docker-compose.yml`
- `mailserver` em `/opt/mailserver/docker-compose.yml`
- `perplexica-stack` em `/root/clawd/perplexica-stack/docker-compose.yml`
- `whatsapp-dispatcher-apple` em `/opt/whatsapp-dispatcher-apple/docker-compose.yml`

## 3. Containers/servicos ativos

Principais servicos Swarm ativos:

- `traefik_traefik` - `traefik:v2.11` - publica `80` e `443`
- `aptidao_aptidao-web` - `aptidao-web:latest`
- `aptidao_aptidao-db` - `postgres:16-alpine`
- `evolution_evolution_api` - `evoapicloud/evolution-api:2.4.0-rc2`
- `n8n_n8n_editor`, `n8n_n8n_webhook`, `n8n_n8n_worker` - `n8nio/n8n:latest`
- `evo-crm_*` - frontend, gateway, CRM, auth, processor, bot runtime, Postgres e Redis
- `paperclip_paperclip_server` e `paperclip_paperclip_db`
- `kanban-atendimento`
- `disparador-frontend_frontend`
- `chatwoot_chatwoot_app`, `chatwoot_chatwoot_sidekiq`, `chatwoot_chatwoot_redis`
- `chatwoot-meuvendedor_*`
- `gestao-cariap_app` e `gestao-cariap_reports`
- `cariapp_cariap_app`, `cariapp_cariap_nocodb`, `cariapp_cariap_postgres`
- `mikael_ai_frontend`, `mikael_ai_api`, `mikael_ai_postgres`, `mikael_ai_redis`
- `links_links`
- `midia-stack_midia_api` e `midia-stack_midia_static`
- `portainer_portainer` e `portainer_agent`
- `wekan_wekan` e `wekan_wekan-db`
- `wfibra_landing`

Containers standalone ativos com portas publicadas diretamente:

- `disparador-dev` - `0.0.0.0:8081->80`
- `automacoes_c2tech_web` - `0.0.0.0:3010->3000`
- `cariapp_cariap_nocodb` - `0.0.0.0:8085->8080`
- `cariap_nocodb` - `0.0.0.0:8080->8080`
- `cariap_postgres` - `0.0.0.0:5432->5432`
- `deezer-dashboard` - `0.0.0.0:31991->80`
- `landing-upload` - `0.0.0.0:31990->80`
- `listmonk-listmonk-1` - `0.0.0.0:9010->9000`
- `perplexica-stack-perplexica-1` - `127.0.0.1:31888->3000` e `127.0.0.1:31889->8080`
- `dispatcher-backend` - `0.0.0.0:9000->9000`
- `mailserver` - `0.0.0.0:25->25` e `0.0.0.0:587->587`

## 4. Portas em uso

Portas publicas/listen relevantes:

- `80/tcp` e `443/tcp`: usados pelo Docker/Traefik. Nao devem ser usados diretamente pelo ProviderX.
- `22/tcp`: SSH.
- `25/tcp` e `587/tcp`: mailserver via Docker.
- `631/tcp`: CUPS.
- `2377/tcp`, `7946/tcp`, `4789/udp`: Docker Swarm/overlay.
- `3000/tcp`: processo Next.js ja existente fora do ProviderX.
- `3010/tcp`: `automacoes_c2tech_web`.
- `3020/tcp`: processo Next.js existente.
- `4317/tcp`: processo Next.js existente.
- `5432/tcp`: Postgres publicado diretamente por container existente.
- `8080/tcp`, `8081/tcp`, `8085/tcp`, `8086/tcp`: containers existentes.
- `8501/tcp`: Streamlit existente.
- `9000/tcp`, `9010/tcp`: apps existentes.
- `11434/tcp`: Ollama.
- `18081/tcp`, `18082/tcp`, `18083/tcp`: processos Python existentes.
- `18789/tcp`, `18791/tcp`, `18792/tcp`: processo `clawdbot-gateway`.
- `31990/tcp`, `31991/tcp`: containers existentes.

Conclusao: o ProviderX nao deve publicar porta host. Deve ficar em rede overlay e ser roteado pelo Traefik existente.

## 5. Reverse proxy atual

- Reverse proxy ativo: Traefik em Docker Swarm, servico `traefik_traefik`.
- Imagem em execucao: `traefik:v2.11`.
- Portas publicadas: `80:80/tcp` e `443:443/tcp`.
- Provider Docker/Swarm habilitado via socket Docker read-only.
- Network padrao do Traefik em execucao: `n8nmikaelnet`.
- Resolvers ACME configurados no Traefik ativo: `letsencrypt` e `letsencryptresolver`.
- O arquivo `/opt/traefik/stack.yml` aponta para `traefik:v3.4.0`, mas o servico em execucao esta em `traefik:v2.11`. Isso deve ser tratado como divergencia operacional antes de qualquer alteracao no proxy.
- `nginx.service`: instalado, porem inativo.
- `caddy.service`: nao encontrado.
- `apache2.service`: nao encontrado.
- `traefik.service` systemd: nao encontrado; Traefik roda via Docker.

## 6. Roteamento de dominios/subdominios

O roteamento atual e feito por labels Traefik nos servicos Docker Swarm. Exemplos observados:

- `gestao.cariap.com.br` -> `gestao-cariap_app`, porta interna `8501`
- `disparador.cariap.com.br` -> `disparador-frontend_frontend`, porta interna `80`
- `disparador.cariap.com.br/kanban` -> `kanban-atendimento`, porta interna `80`
- `formularioloucos.cariap.com.br` -> `formulario-loucos_web`, porta interna `80`
- `sorteio.cariap.com.br` -> `sorteio_web`, porta interna `3001`
- `apresentacoes.cariap.com.br` -> `links_links`, porta interna `3000`
- `links.cariap.com.br` -> redirect/rota legacy para `apresentacoes.cariap.com.br`
- `wfibra.cariap.com.br` -> `wfibra_landing`, porta interna `80`
- `atendimento.cariap.com.br` -> `chatwoot_chatwoot_app`, porta interna `3000`
- Varios dominios `*.n8nmikael.com.br` tambem estao roteados por Traefik.

Nao foi encontrada rota existente para `providerx.cariap.com.br`:

- Sem labels Traefik com `providerx.cariap.com.br`.
- Sem referencia a `providerx` em `/opt`, `/etc/nginx`, `/etc/caddy` ou `/etc/apache2`.
- Consulta DNS local: `providerx.cariap.com.br` nao resolveu no momento da auditoria.
- `curl -I https://providerx.cariap.com.br` falhou por DNS: `Could not resolve host`.

## 7. Padrao recomendado para ProviderX

Com base no ambiente atual:

- Criar a aplicacao em `/opt/providerx`.
- Usar Next.js + PostgreSQL + Prisma + TailwindCSS.
- Criar stack/compose sem `ports:` publicas.
- Usar Docker Swarm/Traefik com labels no servico web.
- Anexar o servico web a network externa `n8nmikaelnet`.
- Usar banco Postgres interno da stack, sem publicar `5432` no host.
- Usar variaveis de ambiente, sem secrets hardcoded.
- Criar `.env.example` e documentar `.env`, sem sobrescrever `.env` caso venha a existir.
- Roteamento futuro sugerido originalmente: `Host(\`providerx.cariap.com.br\`)`. Substituido em 2026-05-25 pelo dominio alvo `Host(\`providerx.n8nmikael.com.br\`)`, entrypoint `websecure`, TLS com resolver `letsencrypt`, porta interna da app `3000`.

## 8. Checklist de seguranca operacional

- [x] Auditoria read-only executada antes de criar app/deploy.
- [x] Nenhum servico existente foi parado.
- [x] Nenhuma porta 80/443 foi usada diretamente.
- [x] Nenhuma porta publica nova foi exposta.
- [x] Nenhum arquivo de proxy foi alterado.
- [x] Nenhum `.env` existente foi sobrescrito.
- [x] Nenhum secret foi hardcoded.
- [x] Reverse proxy identificado como Traefik via Docker Swarm.
- [x] Roteamento de dominios identificado via labels Traefik.
- [x] Ausencia de rota/DNS para `providerx.cariap.com.br` registrada.

## 9. Proximas acoes antes do deploy

1. Desenvolver o MVP em `/opt/providerx`.
2. Gerar `.env.example`, `README.md`, `README_DEPLOY.md`, migrations e seed.
3. Validar build local sem expor porta publica.
4. Antes do deploy, criar backup de qualquer arquivo de producao que precise ser alterado. A principio, o deploy pode ser feito sem editar Traefik diretamente, usando labels na stack.
5. Usar o dominio atualizado `providerx.n8nmikael.com.br` antes de ativar a rota publica.
6. Subir a stack ProviderX apenas com rede Traefik e sem `ports:` publicas.

## 10. Revalidacao read-only antes do incremento da especificacao

Data da revalidacao: 2026-05-25

- `/opt/providerx` contem apenas o codigo do MVP, documentacao, migrations e dependencias locais; nao ha container ProviderX rodando.
- `docker ps` nao mostra containers/servicos com nome `providerx`.
- `docker service ls` nao mostra servico ProviderX ativo.
- `docker compose ls` nao mostra projeto ProviderX ativo.
- Traefik continua sendo o reverse proxy ativo em Docker Swarm, servico `traefik_traefik`, publicando `80` e `443`.
- `nginx.service` continua inativo.
- `caddy.service`, `apache2.service` e `traefik.service` systemd continuam ausentes.
- Labels Traefik continuam roteando os dominios existentes via Docker/Swarm; nao foi encontrada label ativa para `providerx.cariap.com.br`.
- DNS de `providerx.cariap.com.br` continua sem resolver: `curl` retornou `Could not resolve host`.
- Nenhum servico foi parado, nenhum proxy foi alterado e nenhuma porta publica foi aberta durante a revalidacao.

## 11. Estado apos incremento do MVP

Data: 2026-05-25

- O codigo da aplicacao foi expandido em `/opt/providerx` sem subir container e sem alterar proxy.
- Foram adicionados schema, migration e seed para modulos de produto, bases de comissao, regras comerciais, paginas/modelos de proposta, trilhas, itens de trilha, respostas de quiz e certificados.
- O dashboard passou a exibir propostas paradas e contratos vencendo.
- O construtor de proposta passou a aceitar paginas livres, paginas A4/imagem, duplicacao, reordenacao e versionamento por alteracao de pagina.
- O PDF da proposta inclui cabecalho comercial, itens, totais, condicao comercial e paginas personalizadas.
- O simulador passou a considerar base de calculo, tipo de comissao, ponto de equilibrio e cenarios.
- Foram executadas validacoes locais: `npx prisma validate`, `npx prisma generate`, `npm run typecheck`, `npm run lint`, `npm run build` e `npm audit --omit=dev`.
- Resultado das validacoes: sem erros e sem vulnerabilidades de producao reportadas pelo `npm audit --omit=dev`.
- O deploy no dominio antigo `providerx.cariap.com.br` nao foi executado. O dominio alvo atual e `providerx.n8nmikael.com.br`.

## 12. Ajuste visual e modularidade comercial

Data: 2026-05-25

- A tela inicial foi reposicionada como central de comando comercial ProviderX, com atalhos para proposta, simulador, playbook, materiais e conhecimento.
- Produtos passaram a aparecer em cards neon com cor oficial cadastrada, resumo comercial, materiais, modulos e pipeline trabalhado.
- O formulario de proposta deixou de carregar percentuais fixos de comissao/repasse.
- O calculo comercial passou a resolver setup, mensalidade, custo, base de comissao e repasse a partir de `pricing_rules`, `cost_rules`, `commission_rules` e regra de parceiro cadastrada.
- Overrides manuais continuam possiveis por proposta, mas nao sao defaults hardcoded.
- Foi adicionado helper de escopo futuro para portal externo, preparando filtros de representante, parceiro e cliente sem liberar acesso externo no MVP.
- Nenhum servico foi iniciado, nenhum proxy foi alterado e nenhuma porta publica foi aberta durante este ajuste.

## 13. Alteracao de dominio alvo

Data: 2026-05-25

- Dominio alvo atualizado para `providerx.n8nmikael.com.br`.
- Verificacao read-only de DNS: `providerx.n8nmikael.com.br` resolve para `213.199.32.244`.
- Verificacao HTTPS sem alterar infraestrutura: `curl -I https://providerx.n8nmikael.com.br` falhou por certificado self-signed.
- Verificacao com `curl -k -I https://providerx.n8nmikael.com.br`: resposta HTTP `404`, indicando que o host chega ao proxy/servidor, mas ainda nao ha rota ProviderX ativa.
- `docker service ls` nao encontrou servico ProviderX ativo.
- Atualizados `docker-stack.yml`, `.env.example`, `README_DEPLOY.md`, `ENV_VARS.md` e checklist de proxy para o novo dominio.
- Nenhum deploy foi executado, nenhuma stack foi publicada, nenhum arquivo Traefik foi editado e nenhuma porta publica foi aberta.

## 14. Deploy seguro no novo dominio

Data: 2026-05-25

- Problema reportado: `404 page not found` e conexao insegura em `providerx.n8nmikael.com.br`.
- Causa confirmada: dominio resolvia e chegava ao proxy, mas nao havia rota ProviderX ativa; antes do deploy, HTTPS apresentava certificado self-signed.
- Backup criado antes do deploy: `/opt/backups/providerx/20260525_202809/providerx-files-before-deploy.tgz`.
- `.env` real criado sem sobrescrever arquivo existente, com secrets gerados localmente e permissao `600`.
- Imagem buildada: `providerx-playbook:latest`.
- Stack publicada: `providerx`.
- Servicos ativos: `providerx_providerx_db` e `providerx_providerx_web`, ambos `1/1`.
- Nenhuma porta publica nova foi publicada pelo ProviderX; o servico web usa somente a rede Traefik `n8nmikaelnet` e a rede interna `providerx_providerx_internal`.
- Labels Traefik confirmadas no servico web para `Host(\`providerx.n8nmikael.com.br\`)`, entrypoint `websecure`, resolver `letsencrypt` e porta interna `3000`.
- Migrations aplicadas com sucesso: `20260525163000_init` e `20260525171000_expand_commercial_platform`.
- Seed executado com sucesso.
- Banco validado apos seed: `users=1`, `products=5`, `roles=8`.
- Verificacao publica: `https://providerx.n8nmikael.com.br` responde `307` para `/login`.
- Verificacao publica: `https://providerx.n8nmikael.com.br/login` responde `200`.
- Certificado verificado via OpenSSL: `subject=CN = providerx.n8nmikael.com.br`, issuer Let's Encrypt `R12`, valido de 2026-05-25 a 2026-08-23.

## 15. Correcao de acesso HTTP e verificacao em navegador

Data: 2026-05-25

- Sintoma reportado apos deploy: usuario ainda via `404 page not found`.
- Diagnostico: HTTPS estava funcional, mas `http://providerx.n8nmikael.com.br` ainda retornava `404`.
- Correcao aplicada somente na stack ProviderX: adicionadas labels `providerx-http` no entrypoint `web` com middleware `redirectscheme` permanente para HTTPS.
- Verificacao apos ajuste: `http://providerx.n8nmikael.com.br` retorna `308 Permanent Redirect` para `https://providerx.n8nmikael.com.br/`.
- Verificacao HTTPS: `https://providerx.n8nmikael.com.br/login` retorna `200`.
- Verificacao em navegador real via Playwright: abrir `http://providerx.n8nmikael.com.br` redireciona para `https://providerx.n8nmikael.com.br/login` e exibe a tela de login `ProviderX Playbook Comercial`.
- Senha inicial do admin foi rotacionada apos teste automatizado e atualizada no banco e no `.env` local do servidor.
- Nenhuma porta publica nova foi publicada e nenhum arquivo Traefik global foi alterado.
