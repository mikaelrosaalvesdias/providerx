export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "json" | "array" | "password" | "date";

export type RelationKey =
  | "product"
  | "productPlan"
  | "company"
  | "partnerCompany"
  | "representative"
  | "salesPerson"
  | "user"
  | "role"
  | "knowledgeTrack"
  | "knowledgeContent"
  | "quiz"
  | "quizQuestion"
  | "playbookSection"
  | "commissionBase"
  | "uploadedAsset";

export type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  relation?: RelationKey;
  help?: string;
};

export type AdminResource = {
  label: string;
  description: string;
  model: string;
  titleField: string;
  fields: AdminField[];
  orderBy?: Record<string, "asc" | "desc">;
};

const statusOptions = [
  { label: "Ativo", value: "ACTIVE" },
  { label: "Inativo", value: "INACTIVE" },
];

const publishOptions = [
  { label: "Rascunho", value: "DRAFT" },
  { label: "Publicado", value: "PUBLISHED" },
  { label: "Arquivado", value: "ARCHIVED" },
];

const proposalStatusOptions = [
  { label: "Rascunho", value: "DRAFT" },
  { label: "Em revisao", value: "REVIEW" },
  { label: "Enviada", value: "SENT" },
  { label: "Em negociacao", value: "NEGOTIATION" },
  { label: "Aprovada", value: "APPROVED" },
  { label: "Perdida", value: "LOST" },
  { label: "Cancelada", value: "CANCELED" },
  { label: "Convertida", value: "CONVERTED" },
];

const contractStatusOptions = [
  { label: "Rascunho", value: "DRAFT" },
  { label: "Em implantacao", value: "IMPLEMENTATION" },
  { label: "Ativo", value: "ACTIVE" },
  { label: "Suspenso", value: "SUSPENDED" },
  { label: "Encerrado", value: "ENDED" },
  { label: "Cancelado", value: "CANCELED" },
  { label: "Renovacao pendente", value: "RENEWAL_PENDING" },
];

const commissionBaseOptions = [
  { label: "Setup", value: "SETUP" },
  { label: "Mensalidade", value: "MONTHLY" },
  { label: "Faturamento bruto", value: "GROSS_REVENUE" },
  { label: "Faturamento liquido", value: "NET_REVENUE" },
  { label: "Margem", value: "MARGIN" },
  { label: "Personalizada", value: "CUSTOM" },
];

const contentTypeOptions = ["VIDEO", "PDF", "LINK", "TEXT", "PRESENTATION", "CHECKLIST"].map((value) => ({ label: value, value }));
const certificateStatusOptions = ["ISSUED", "REVOKED", "EXPIRED"].map((value) => ({ label: value, value }));

export const adminResources: Record<string, AdminResource> = {
  products: {
    label: "Produtos",
    description: "Cadastro comercial, posicionamento, beneficios, scripts e identidade visual.",
    model: "product",
    titleField: "name",
    orderBy: { name: "asc" },
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "primaryColor", label: "Cor principal", type: "text" },
      { name: "category", label: "Categoria", type: "text" },
      { name: "shortDescription", label: "Descricao curta", type: "textarea" },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "targetAudience", label: "Publico-alvo", type: "textarea" },
      { name: "pains", label: "Dores", type: "array" },
      { name: "benefits", label: "Beneficios", type: "array" },
      { name: "salesArguments", label: "Argumentos de venda", type: "array" },
      { name: "approachScripts", label: "Scripts de abordagem", type: "array" },
      { name: "whatsappScripts", label: "Scripts de WhatsApp", type: "array" },
      { name: "callScripts", label: "Scripts de ligacao", type: "array" },
      { name: "implementationChecklist", label: "Checklist de implantacao", type: "array" },
      { name: "closingChecklist", label: "Checklist de fechamento", type: "array" },
      { name: "objections", label: "Objecoes e respostas JSON", type: "json" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
  },
  modules: {
    label: "Modulos de produto",
    description: "Modulos comerciais, setups, recorrencias e opcionais por produto.",
    model: "productModule",
    titleField: "name",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "moduleType", label: "Tipo", type: "text" },
      { name: "setupPrice", label: "Setup", type: "number" },
      { name: "monthlyPrice", label: "Mensalidade", type: "number" },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "active", label: "Ativo", type: "boolean" },
    ],
  },
  plans: {
    label: "Planos",
    description: "Planos comerciais vinculados aos produtos.",
    model: "productPlan",
    titleField: "name",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "setupPrice", label: "Setup", type: "number" },
      { name: "monthlyPrice", label: "Mensalidade", type: "number" },
      { name: "active", label: "Ativo", type: "boolean" },
    ],
  },
  pricing: {
    label: "Tabelas de venda",
    description: "Faixas de preco por produto, plano e categoria.",
    model: "pricingRule",
    titleField: "category",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "planId", label: "Plano", type: "select", relation: "productPlan" },
      { name: "category", label: "Categoria", type: "text", required: true },
      { name: "minQuantity", label: "Qtd. minima", type: "number", required: true },
      { name: "maxQuantity", label: "Qtd. maxima", type: "number" },
      { name: "unitPrice", label: "Preco unitario", type: "number", required: true },
      { name: "setupPrice", label: "Setup", type: "number" },
      { name: "active", label: "Ativo", type: "boolean" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  costs: {
    label: "Tabelas de custo",
    description: "Custos internos por produto, plano e faixa.",
    model: "costRule",
    titleField: "category",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "planId", label: "Plano", type: "select", relation: "productPlan" },
      { name: "category", label: "Categoria", type: "text", required: true },
      { name: "minQuantity", label: "Qtd. minima", type: "number", required: true },
      { name: "maxQuantity", label: "Qtd. maxima", type: "number" },
      { name: "unitCost", label: "Custo unitario", type: "number", required: true },
      { name: "setupCost", label: "Custo setup", type: "number" },
      { name: "active", label: "Ativo", type: "boolean" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  commissionBases: {
    label: "Bases de comissao",
    description: "Bases de calculo: setup, mensalidade, bruto, liquido, margem ou formula.",
    model: "commissionBase",
    titleField: "label",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "label", label: "Nome", type: "text", required: true },
      { name: "baseType", label: "Tipo", type: "select", options: commissionBaseOptions },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "formula", label: "Formula", type: "textarea" },
      { name: "active", label: "Ativo", type: "boolean" },
    ],
  },
  commissions: {
    label: "Regras de comissao",
    description: "Motor modular por produto, plano, fornecedor, base, faixa, meta e evento.",
    model: "commissionRule",
    titleField: "name",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "planId", label: "Plano", type: "select", relation: "productPlan" },
      { name: "baseId", label: "Base cadastrada", type: "select", relation: "commissionBase" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "appliesTo", label: "Aplica para", type: "text" },
      { name: "providerName", label: "Fornecedor", type: "text" },
      { name: "commissionBase", label: "Base de calculo", type: "select", options: commissionBaseOptions },
      { name: "triggerEvent", label: "Evento de liberacao", type: "text" },
      { name: "salesPersonCommissionPercent", label: "% vendedor", type: "number" },
      { name: "representativeCommissionPercent", label: "% representante", type: "number" },
      { name: "partnerRevenuePercent", label: "% parceiro", type: "number" },
      { name: "minQuantity", label: "Faixa minima", type: "number" },
      { name: "maxQuantity", label: "Faixa maxima", type: "number" },
      { name: "minMarginPercent", label: "Margem minima %", type: "number" },
      { name: "goalMultiplierPercent", label: "Multiplicador por meta %", type: "number" },
      { name: "customFormula", label: "Formula personalizada", type: "textarea" },
      { name: "active", label: "Ativo", type: "boolean" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  companies: {
    label: "Provedores/clientes",
    description: "Empresas provedoras e clientes finais.",
    model: "company",
    titleField: "legalName",
    fields: [
      { name: "legalName", label: "Razao social", type: "text", required: true },
      { name: "tradeName", label: "Nome fantasia", type: "text" },
      { name: "cnpj", label: "CNPJ", type: "text" },
      { name: "contactName", label: "Responsavel", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "city", label: "Cidade", type: "text" },
      { name: "state", label: "UF", type: "text" },
      { name: "segment", label: "Segmento", type: "text" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  partners: {
    label: "Empresas parceiras",
    description: "Parceiros com base de repasse e regras especificas por produto.",
    model: "partnerCompany",
    titleField: "legalName",
    fields: [
      { name: "companyId", label: "Empresa base", type: "select", relation: "company" },
      { name: "legalName", label: "Razao social", type: "text", required: true },
      { name: "tradeName", label: "Nome fantasia", type: "text" },
      { name: "cnpj", label: "CNPJ", type: "text" },
      { name: "responsibleName", label: "Responsavel", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "partnershipType", label: "Tipo de parceria", type: "text", required: true },
      { name: "revenueSharePercent", label: "% faturamento", type: "number" },
      { name: "billingBase", label: "Base de repasse", type: "select", options: commissionBaseOptions },
      { name: "customRules", label: "Regras especificas JSON", type: "json" },
      { name: "products", label: "Produtos vinculados", type: "array" },
      { name: "status", label: "Status", type: "text" },
    ],
  },
  representatives: {
    label: "Representantes",
    description: "Representantes comerciais, regioes, metas e comissao padrao.",
    model: "representative",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "document", label: "Documento", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "region", label: "Regiao", type: "text" },
      { name: "contact", label: "Contato", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "defaultCommissionPercent", label: "% comissao padrao", type: "number" },
      { name: "goalAmount", label: "Meta", type: "number" },
      { name: "status", label: "Status", type: "text" },
      { name: "history", label: "Historico JSON", type: "json" },
    ],
  },
  sellers: {
    label: "Vendedores internos",
    description: "Equipe comercial e metas individuais.",
    model: "salesPerson",
    titleField: "name",
    fields: [
      { name: "userId", label: "Usuario vinculado", type: "select", relation: "user" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "email", label: "E-mail", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "department", label: "Departamento", type: "text" },
      { name: "defaultCommissionPercent", label: "% comissao padrao", type: "number" },
      { name: "goalAmount", label: "Meta", type: "number" },
      { name: "status", label: "Status", type: "text" },
    ],
  },
  proposals: {
    label: "Propostas",
    description: "Cabecalho, status, condicoes comerciais e totais.",
    model: "proposal",
    titleField: "code",
    fields: [
      { name: "code", label: "Codigo", type: "text", required: true },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "companyId", label: "Empresa", type: "select", relation: "company", required: true },
      { name: "partnerId", label: "Parceiro", type: "select", relation: "partnerCompany" },
      { name: "representativeId", label: "Representante", type: "select", relation: "representative" },
      { name: "salesPersonId", label: "Vendedor", type: "select", relation: "salesPerson" },
      { name: "validityDate", label: "Validade", type: "date" },
      { name: "status", label: "Status", type: "select", options: proposalStatusOptions },
      { name: "responsibleName", label: "Responsavel", type: "text" },
      { name: "responsibleEmail", label: "E-mail responsavel", type: "text" },
      { name: "responsiblePhone", label: "Telefone responsavel", type: "text" },
      { name: "cnpj", label: "CNPJ", type: "text" },
      { name: "commercialCondition", label: "Condicao comercial", type: "textarea" },
      { name: "setupTotal", label: "Setup", type: "number" },
      { name: "monthlyTotal", label: "Mensalidade", type: "number" },
      { name: "discountAmount", label: "Desconto", type: "number" },
      { name: "commissionTotal", label: "Comissao", type: "number" },
      { name: "partnerShareTotal", label: "Repasse parceiro", type: "number" },
      { name: "estimatedMargin", label: "Margem estimada", type: "number" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "lossReason", label: "Motivo de perda", type: "textarea" },
    ],
  },
  proposalTemplates: {
    label: "Modelos de proposta",
    description: "Modelos com capa, paginas A4, blocos de texto, preco e condicoes.",
    model: "proposalTemplate",
    titleField: "name",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "coverAssetId", label: "Capa", type: "select", relation: "uploadedAsset" },
      { name: "pages", label: "Paginas JSON", type: "json" },
      { name: "footer", label: "Rodape", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  contracts: {
    label: "Contratos",
    description: "Contratos, vigencia, status financeiro/operacional, setup e recorrencia.",
    model: "contract",
    titleField: "code",
    fields: [
      { name: "code", label: "Codigo", type: "text", required: true },
      { name: "companyId", label: "Empresa", type: "select", relation: "company", required: true },
      { name: "partnerId", label: "Parceiro", type: "select", relation: "partnerCompany" },
      { name: "representativeId", label: "Representante", type: "select", relation: "representative" },
      { name: "salesPersonId", label: "Vendedor", type: "select", relation: "salesPerson" },
      { name: "startDate", label: "Inicio", type: "date", required: true },
      { name: "endDate", label: "Fim", type: "date" },
      { name: "setupValue", label: "Setup", type: "number" },
      { name: "monthlyValue", label: "Mensalidade", type: "number" },
      { name: "licenses", label: "Licencas", type: "number" },
      { name: "commissionValue", label: "Comissao", type: "number" },
      { name: "status", label: "Status", type: "select", options: contractStatusOptions },
      { name: "financialStatus", label: "Status financeiro", type: "text" },
      { name: "operationalStatus", label: "Status operacional", type: "text" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  users: {
    label: "Usuarios",
    description: "Usuarios do sistema, status e perfil inicial.",
    model: "user",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "email", label: "E-mail", type: "text", required: true },
      { name: "password", label: "Senha", type: "password", help: "Em edicao, deixe em branco para manter." },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      { name: "roleId", label: "Perfil", type: "select", relation: "role" },
    ],
  },
  roles: {
    label: "Perfis",
    description: "Perfis de acesso internos e futuros externos.",
    model: "role",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
  },
  permissions: {
    label: "Permissoes",
    description: "Chaves de permissao usadas pela aplicacao.",
    model: "permission",
    titleField: "key",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "label", label: "Rotulo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
  },
  org: {
    label: "Organograma",
    description: "Arvore hierarquica de pessoas, cargos, departamentos e gestores.",
    model: "orgUnit",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "position", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "department", label: "Departamento", type: "text" },
      { name: "managerUserId", label: "Gestor", type: "select", relation: "user" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "status", label: "Status", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
  },
  playbook: {
    label: "Conteudos do playbook",
    description: "Secoes comerciais por produto.",
    model: "playbookSection",
    titleField: "title",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "kind", label: "Tipo", type: "text", required: true },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "content", label: "Conteudo", type: "textarea", required: true },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  playbookContents: {
    label: "Estrategias do playbook",
    description: "Conteudos por publico-alvo, etapa de venda e tipo de cliente.",
    model: "playbookContent",
    titleField: "title",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product", required: true },
      { name: "sectionId", label: "Secao", type: "select", relation: "playbookSection" },
      { name: "audience", label: "Publico-alvo", type: "text" },
      { name: "salesStage", label: "Etapa de venda", type: "text" },
      { name: "customerType", label: "Tipo de cliente", type: "text" },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "content", label: "Conteudo", type: "textarea", required: true },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  tracks: {
    label: "Trilhas",
    description: "Trilhas de treinamento.",
    model: "knowledgeTrack",
    titleField: "title",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  trackItems: {
    label: "Itens de trilha",
    description: "Ordem e obrigatoriedade de conteudos e quizzes.",
    model: "knowledgeTrackItem",
    titleField: "id",
    fields: [
      { name: "trackId", label: "Trilha", type: "select", relation: "knowledgeTrack", required: true },
      { name: "contentId", label: "Conteudo", type: "select", relation: "knowledgeContent" },
      { name: "quizId", label: "Quiz", type: "select", relation: "quiz" },
      { name: "required", label: "Obrigatorio", type: "boolean" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
  },
  knowledge: {
    label: "Conteudos de conhecimento",
    description: "Aulas, PDFs, videos, checklists, apresentacoes e links.",
    model: "knowledgeContent",
    titleField: "title",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "trackId", label: "Trilha", type: "select", relation: "knowledgeTrack" },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "contentType", label: "Tipo", type: "select", options: contentTypeOptions },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "url", label: "URL", type: "text" },
      { name: "durationMinutes", label: "Duracao em minutos", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  quizzes: {
    label: "Provas/quizzes",
    description: "Avaliacoes de conhecimento.",
    model: "quiz",
    titleField: "title",
    fields: [
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "trackId", label: "Trilha", type: "select", relation: "knowledgeTrack" },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "passingScore", label: "Nota minima", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
  },
  questions: {
    label: "Perguntas de quiz",
    description: "Perguntas, alternativas JSON e resposta correta.",
    model: "quizQuestion",
    titleField: "prompt",
    fields: [
      { name: "quizId", label: "Quiz", type: "select", relation: "quiz", required: true },
      { name: "prompt", label: "Pergunta", type: "textarea", required: true },
      { name: "options", label: "Alternativas JSON", type: "json", required: true },
      { name: "correctAnswer", label: "Resposta correta", type: "text", required: true },
      { name: "explanation", label: "Explicacao", type: "textarea" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
  },
  answers: {
    label: "Respostas de quiz",
    description: "Alternativas estruturadas para perguntas de prova.",
    model: "quizAnswer",
    titleField: "label",
    fields: [
      { name: "questionId", label: "Pergunta", type: "select", relation: "quizQuestion", required: true },
      { name: "label", label: "Alternativa", type: "text", required: true },
      { name: "isCorrect", label: "Correta", type: "boolean" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
  },
  certificates: {
    label: "Certificados",
    description: "Certificados emitidos por trilha/produto/prova.",
    model: "certificate",
    titleField: "title",
    fields: [
      { name: "userId", label: "Usuario", type: "select", relation: "user", required: true },
      { name: "trackId", label: "Trilha", type: "select", relation: "knowledgeTrack" },
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "certificateText", label: "Texto", type: "textarea", required: true },
      { name: "score", label: "Nota", type: "number" },
      { name: "status", label: "Status", type: "select", options: certificateStatusOptions },
      { name: "appearance", label: "Aparencia JSON", type: "json" },
    ],
  },
  goals: {
    label: "Metas",
    description: "Metas por vendedor, representante ou produto.",
    model: "goal",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "salesPersonId", label: "Vendedor", type: "select", relation: "salesPerson" },
      { name: "representativeId", label: "Representante", type: "select", relation: "representative" },
      { name: "productId", label: "Produto", type: "select", relation: "product" },
      { name: "periodStart", label: "Inicio", type: "date", required: true },
      { name: "periodEnd", label: "Fim", type: "date", required: true },
      { name: "targetAmount", label: "Meta", type: "number", required: true },
      { name: "achievedAmount", label: "Realizado", type: "number" },
    ],
  },
  settings: {
    label: "Configuracoes",
    description: "Chaves operacionais do sistema.",
    model: "setting",
    titleField: "key",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "value", label: "Valor JSON", type: "json", required: true },
      { name: "type", label: "Tipo", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
  },
};

export function getResource(entity: string) {
  return adminResources[entity];
}
