# Escopo do ProviderX Playbook Comercial

Este documento consolida o escopo funcional do MVP e as preparacoes tecnicas para evolucoes futuras.

## Contexto

A ProviderX/Cariap vende e estrutura produtos white-label para provedores de internet e varejo.

O sistema e uma plataforma interna para desenvolvimento comercial, treinamento, padronizacao de discurso, montagem de propostas, simulacao de margem/comissao e gestao de materiais.

## Objetivos de negocio

- Centralizar conhecimento comercial por produto.
- Reduzir tempo de criacao de proposta.
- Padronizar precos, custos, regras e comissoes.
- Acompanhar funil comercial e performance.
- Organizar materiais oficiais de venda.
- Treinar equipe interna e registrar pontuacao.
- Permitir expansao futura para representantes, parceiros e clientes.

## Usuarios do MVP

O MVP e interno.

Perfis:

- Admin Master
- Diretoria
- Gestor Comercial
- Marketing
- Financeiro
- Vendedor Interno
- Operacional
- Visualizador

## Acesso futuro previsto

O banco e as permissoes ja preparam:

- Representante vendo somente as proprias vendas, propostas, contratos e indicadores.
- Parceiro vendo somente dados vinculados a ele.
- Cliente visualizando proposta.
- Aceite digital de proposta.
- Portal externo separado por escopo.

## Produtos iniciais

### Vigia Amigo

Categoria: Residencial e Comercial.

Produto para monitoramento inteligente, CFTV, camera, alarme e interfone virtual.

Seed comercial inicial:

- Setup: R$ 5.500,00.
- Setup parcelado em 5x.
- Licenca monitoramento:
  - Ate 100: R$ 3,00 por unidade.
  - 101 a 500: R$ 2,50 por unidade.
  - 501 a 1000: R$ 2,00 por unidade.
  - 1001 a 5000: R$ 1,50 por unidade.
- Licenca interfone digital:
  - Ate 100: R$ 3,00 por unidade.
  - 101 a 500: R$ 2,50 por unidade.
  - 501 a 1000: R$ 2,00 por unidade.
  - 1001 a 5000: R$ 1,50 por unidade.

### Wi-Facil

Hotspot white-label para provedores e empresas.

Funcionalidades:

- Hotspot simples e rapido.
- Captura de nome e WhatsApp.
- Conformidade LGPD.
- Marketing via WhatsApp.
- Monetizacao da rede Wi-Fi.
- Geracao de leads para o provedor.

### AtendAI

Solucao de atendimento inteligente.

Funcionalidades:

- Atendimento via WhatsApp Oficial/API Meta.
- Filas.
- Setores.
- Historico de atendimento.
- IA de apoio ao atendente.
- Integracoes com ERP/CRM.
- Relatorios de atendimento.

### Pixel Facil

Solucao de TV corporativa, midia indoor e filas.

Funcionalidades:

- Senhas organizadas na TV.
- Midia indoor para ofertas.
- Fila inteligente com WhatsApp.
- Gestao de telas.
- Reducao de percepcao de espera.
- Campanhas por unidade/local.

### 123 Encarte

Solucao para criacao de cartazes, ofertas e encartes.

Funcionalidades:

- Cartazes profissionais.
- Integracao com ERP.
- Modelos prontos.
- Formatos A4, story e TV.
- Sincronizacao de precos.
- Padronizacao visual.

## Regra principal

Produtos, precos, custos, planos, comissoes, percentuais, modelos de proposta, regras de faturamento e regras de repasse devem ser modulares e editaveis pelo Admin.

Nao fixar regra comercial no codigo alem dos seeds iniciais.

## Modulos do MVP

### 1. Autenticacao e usuarios

- Login.
- Logout.
- Cadastro de usuarios pelo Admin.
- Perfis.
- Permissoes.
- Logs de acesso.
- Controle de sessao.

### 2. Dashboard principal

- Propostas abertas.
- Propostas em negociacao.
- Propostas aprovadas.
- Propostas perdidas.
- Receita prevista.
- Receita recorrente prevista.
- Setup vendido.
- Comissao prevista.
- Meta x realizado.
- Produtos mais trabalhados.
- Produtos mais vendidos.
- Top vendedores internos.
- Top representantes.
- Top parceiros.
- Margem estimada.
- Alertas de propostas paradas.
- Alertas de contratos vencendo.

### 3. Admin modular

CRUD para todos os cadastros comerciais, financeiros, operacionais e de conhecimento.

### 4. Produtos

Pagina interna por produto com posicionamento, beneficios, dores, materiais, playbook, scripts e checklists.

### 5. Propostas personalizadas

Construtor de propostas com paginas, itens comerciais, imagens A4, PDF, versoes e conversao em contrato.

### 6. Modelos de proposta

Modelos reutilizaveis com capa, paginas institucionais, paginas de produto, blocos de preco, condicoes comerciais e rodape.

### 7. Contratos

Controle de contratos com status financeiro, status operacional, arquivo, historico, produtos e comissoes.

### 8. Representantes

Cadastro de representantes, produtos autorizados, meta, comissao e historico.

### 9. Empresas parceiras

Cadastro de parceiros e regras de faturamento por base de calculo.

### 10. Comissoes modulares

Motor configuravel por produto, plano, fornecedor, vendedor, representante, parceiro, setup, mensalidade, receita, margem, periodo, meta e faixa.

### 11. Simulador

Simulacao de receita, custo, margem, comissoes, repasses, meta e ponto de equilibrio.

### 12. Playbook comercial

Conteudo por produto, publico, etapa de venda e tipo de cliente.

### 13. Conhecimento

Conteudos, trilhas, provas, pontuacao, obrigatoriedade e certificados.

### 14. Apresentacoes

Materiais comerciais com upload, versao, tags, produto e status.

### 15. Relatorios

Relatorios comerciais, financeiros, de margem e de treinamento.

### 16. Organograma

Arvore de pessoas por empresa, departamento e gestor.

### 17. Logs

Auditoria de acoes criticas e mudancas sensiveis.

## Criterios de aceite do MVP

- Sistema acessivel no dominio configurado.
- Deploy sem quebrar servicos existentes.
- Auditoria tecnica inicial registrada.
- Login funcional.
- Admin cadastra usuarios, produtos, precos, custos, comissoes, representantes e parceiros.
- Produtos iniciais cadastrados via seed.
- Dashboard principal funcionando.
- Produto possui pagina de playbook.
- Proposta pode ser criada com paginas personalizadas.
- Proposta aceita upload/imagem A4 como pagina.
- Proposta gera PDF.
- Precos e modulos de proposta sao configuraveis.
- Comissao modular com bases diferentes de calculo.
- Simulador calcula comissao, meta, margem e repasse.
- Contrato pode ser criado a partir de proposta aprovada.
- Apresentacoes vinculadas a produtos.
- Conhecimento cadastravel.
- Quiz registra pontuacao.
- Certificado disponivel.
- Logs registram acoes criticas.
- README, deploy, variaveis, backup e rollback documentados.

## Fora do MVP

- Portal publico.
- Assinatura digital.
- Gateway de pagamento.
- Integracao real com ERP/CRM externo.
- Envio real de email transacional.
- Storage S3 obrigatorio.
- Aplicativo mobile nativo.

Esses itens foram considerados no desenho para evolucao posterior.
