export type FieldType = "text" | "textarea" | "number" | "select" | "boolean" | "json" | "array" | "password" | "date";

export type RelationKey =
  | "businessPlanSection"
  | "department"
  | "orgChartNode"
  | "productSolution"
  | "revenueModel"
  | "role"
  | "user"
  | "vertical";

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

const userStatusOptions = [
  { label: "Ativo", value: "ACTIVE" },
  { label: "Inativo", value: "INACTIVE" },
  { label: "Convidado", value: "INVITED" },
];

const publishOptions = [
  { label: "Rascunho", value: "DRAFT" },
  { label: "Publicado", value: "PUBLISHED" },
  { label: "Arquivado", value: "ARCHIVED" },
];

const planningStatusOptions = [
  { label: "Ideia", value: "IDEA" },
  { label: "Em analise", value: "ANALYSIS" },
  { label: "Em estruturacao", value: "STRUCTURING" },
  { label: "Pronto para apresentacao", value: "READY" },
  { label: "Em validacao", value: "VALIDATION" },
  { label: "Ativo", value: "ACTIVE" },
  { label: "Pausado", value: "PAUSED" },
];

const priorityOptions = [
  { label: "Baixa", value: "LOW" },
  { label: "Media", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" },
  { label: "Critica", value: "CRITICAL" },
];

const materialTypeOptions = [
  { label: "Apresentacao", value: "PRESENTATION" },
  { label: "PDF", value: "PDF" },
  { label: "Imagem", value: "IMAGE" },
  { label: "Video", value: "VIDEO" },
  { label: "Planilha", value: "SPREADSHEET" },
  { label: "Documento", value: "DOCUMENT" },
  { label: "Link externo", value: "EXTERNAL_LINK" },
  { label: "Referencia de design", value: "DESIGN_REFERENCE" },
  { label: "Institucional", value: "INSTITUTIONAL" },
];

const materialStatusOptions = [
  { label: "Rascunho", value: "DRAFT" },
  { label: "Em revisao", value: "REVIEW" },
  { label: "Aprovado", value: "APPROVED" },
  { label: "Oficial", value: "OFFICIAL" },
  { label: "Obsoleto", value: "OBSOLETE" },
];

export const adminResources: Record<string, AdminResource> = {
  users: {
    label: "Usuarios",
    description: "Acessos internos do ProviderX Planning Hub.",
    model: "user",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "email", label: "E-mail", type: "text", required: true },
      { name: "password", label: "Senha", type: "password", help: "Em edicao, deixe em branco para manter a senha atual." },
      { name: "status", label: "Status", type: "select", options: userStatusOptions },
      { name: "roleId", label: "Perfil", type: "select", relation: "role" },
    ],
    orderBy: { name: "asc" },
  },
  roles: {
    label: "Perfis",
    description: "Perfis internos: Admin Master, Diretoria, Produto, Comercial, Marketing, Financeiro, Tecnologia e Visualizador.",
    model: "role",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
    orderBy: { name: "asc" },
  },
  permissions: {
    label: "Permissoes",
    description: "Chaves usadas para controlar acesso aos modulos do Planning Hub.",
    model: "permission",
    titleField: "key",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "label", label: "Rotulo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
    orderBy: { key: "asc" },
  },
  businessPlanSections: {
    label: "Plano de negocios",
    description: "Secoes editaveis do documento vivo ProviderX.",
    model: "businessPlanSection",
    titleField: "title",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "content", label: "Conteudo", type: "textarea", required: true },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
    orderBy: { sortOrder: "asc" },
  },
  verticals: {
    label: "Verticais",
    description: "ProviderX Home, Comércios e Serviços Locais, Varejo e futuras verticais.",
    model: "vertical",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea", required: true },
      { name: "color", label: "Cor", type: "text" },
      { name: "icon", label: "Icone", type: "text" },
      { name: "status", label: "Status", type: "select", options: planningStatusOptions },
      { name: "targetAudience", label: "Publico-alvo", type: "textarea" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  products: {
    label: "Produtos e solucoes",
    description: "Solucoes planejadas por vertical, dor de mercado, beneficio e modelo white-label.",
    model: "productSolution",
    titleField: "name",
    fields: [
      { name: "verticalId", label: "Vertical", type: "select", relation: "vertical", required: true },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "shortDescription", label: "Descricao curta", type: "textarea" },
      { name: "description", label: "Descricao completa", type: "textarea" },
      { name: "features", label: "Recursos", type: "array" },
      { name: "targetAudience", label: "Publico-alvo", type: "textarea" },
      { name: "painSolved", label: "Dor resolvida", type: "textarea" },
      { name: "mainBenefit", label: "Beneficio principal", type: "textarea" },
      { name: "whiteLabelModel", label: "Modelo white-label", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: planningStatusOptions },
      { name: "responsible", label: "Responsavel", type: "text" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  productFeatures: {
    label: "Recursos de produto",
    description: "Recursos planejados para produtos e solucoes.",
    model: "productFeature",
    titleField: "name",
    fields: [
      { name: "productId", label: "Produto/solucao", type: "select", relation: "productSolution", required: true },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: planningStatusOptions },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  targetAudiences: {
    label: "Publicos-alvo",
    description: "Publicos primarios e secundarios do plano ProviderX.",
    model: "targetAudience",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "audienceType", label: "Tipo", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  differentials: {
    label: "Diferenciais competitivos",
    description: "Diferenciais estrategicos da ProviderX.",
    model: "competitiveDifferential",
    titleField: "title",
    fields: [
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: publishOptions },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  revenueModels: {
    label: "Modelos de receita",
    description: "Receita SaaS recorrente e outras receitas planejadas.",
    model: "revenueModel",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
    orderBy: { name: "asc" },
  },
  revenueItems: {
    label: "Itens de receita",
    description: "Itens planejados de receita por modelo.",
    model: "revenueItem",
    titleField: "name",
    fields: [
      { name: "modelId", label: "Modelo", type: "select", relation: "revenueModel" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "amount", label: "Valor", type: "number" },
      { name: "periodicity", label: "Periodicidade", type: "text" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
    orderBy: { name: "asc" },
  },
  financialScenarios: {
    label: "Cenarios financeiros",
    description: "Cenarios estrategicos de receita, custo e margem.",
    model: "financialScenario",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "providerCount", label: "Qtd. provedores", type: "number", required: true },
      { name: "averageTicket", label: "Ticket medio", type: "number", required: true },
      { name: "monthlyRevenue", label: "Receita mensal", type: "number" },
      { name: "annualRevenue", label: "Receita anual", type: "number" },
      { name: "estimatedCosts", label: "Custos estimados", type: "number" },
      { name: "estimatedMargin", label: "Margem estimada", type: "number" },
      { name: "scenarioType", label: "Tipo de cenario", type: "text" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
    orderBy: { monthlyRevenue: "asc" },
  },
  costs: {
    label: "Custos planejados",
    description: "Mapa de custos principais do negócio.",
    model: "costItem",
    titleField: "category",
    fields: [
      { name: "category", label: "Categoria", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea", required: true },
      { name: "estimatedValue", label: "Valor estimado", type: "number" },
      { name: "periodicity", label: "Periodicidade", type: "text" },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
    orderBy: { category: "asc" },
  },
  investments: {
    label: "Investimentos",
    description: "Itens de investimento inicial planejado.",
    model: "investmentItem",
    titleField: "item",
    fields: [
      { name: "item", label: "Item", type: "text", required: true },
      { name: "estimatedValue", label: "Valor estimado", type: "number" },
      { name: "priority", label: "Prioridade", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: publishOptions },
      { name: "notes", label: "Observacoes", type: "textarea" },
    ],
    orderBy: { item: "asc" },
  },
  acquisitionChannels: {
    label: "Canais de aquisicao",
    description: "Planejamento de canais comerciais, prioridade, status e responsaveis.",
    model: "acquisitionChannel",
    titleField: "channel",
    fields: [
      { name: "channel", label: "Canal", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "priority", label: "Prioridade", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: publishOptions },
      { name: "notes", label: "Observacoes", type: "textarea" },
      { name: "responsible", label: "Responsavel", type: "text" },
      { name: "materials", label: "Materiais relacionados", type: "array" },
    ],
    orderBy: { channel: "asc" },
  },
  departments: {
    label: "Departamentos",
    description: "Estrutura operacional planejada.",
    model: "department",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "responsibilities", label: "Responsabilidades", type: "textarea" },
      { name: "status", label: "Status", type: "text" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  positions: {
    label: "Cargos",
    description: "Cargos por departamento.",
    model: "position",
    titleField: "title",
    fields: [
      { name: "departmentId", label: "Departamento", type: "select", relation: "department", required: true },
      { name: "title", label: "Cargo", type: "text", required: true },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "status", label: "Status", type: "text" },
      { name: "sortOrder", label: "Ordem", type: "number" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  orgChart: {
    label: "Organograma",
    description: "Nos hierarquicos do organograma executivo.",
    model: "orgChartNode",
    titleField: "label",
    fields: [
      { name: "parentId", label: "No superior", type: "select", relation: "orgChartNode" },
      { name: "departmentId", label: "Departamento", type: "select", relation: "department" },
      { name: "label", label: "Rotulo", type: "text", required: true },
      { name: "nodeType", label: "Tipo", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "sortOrder", label: "Ordem", type: "number" },
      { name: "status", label: "Status", type: "text" },
    ],
    orderBy: { sortOrder: "asc" },
  },
  materials: {
    label: "Materiais estrategicos",
    description: "Biblioteca de materiais oficiais, referencias, documentos, links e arquivos.",
    model: "strategicMaterial",
    titleField: "title",
    fields: [
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "materialType", label: "Tipo", type: "select", options: materialTypeOptions },
      { name: "verticalId", label: "Vertical", type: "select", relation: "vertical" },
      { name: "productId", label: "Produto/solucao", type: "select", relation: "productSolution" },
      { name: "fileName", label: "Arquivo", type: "text" },
      { name: "filePath", label: "Caminho do arquivo", type: "text" },
      { name: "externalUrl", label: "Link externo", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
      { name: "version", label: "Versao", type: "text" },
      { name: "status", label: "Status", type: "select", options: materialStatusOptions },
      { name: "tags", label: "Tags", type: "array" },
      { name: "isOfficial", label: "Material oficial", type: "boolean" },
    ],
    orderBy: { updatedAt: "desc" },
  },
  decisions: {
    label: "Decisoes estrategicas",
    description: "Registro de contexto, decisao tomada, motivo e impacto esperado.",
    model: "strategicDecision",
    titleField: "title",
    fields: [
      { name: "title", label: "Titulo", type: "text", required: true },
      { name: "relatedArea", label: "Area relacionada", type: "text" },
      { name: "verticalId", label: "Vertical", type: "select", relation: "vertical" },
      { name: "productId", label: "Produto/solucao", type: "select", relation: "productSolution" },
      { name: "context", label: "Contexto", type: "textarea" },
      { name: "decision", label: "Decisao tomada", type: "textarea", required: true },
      { name: "reason", label: "Motivo", type: "textarea" },
      { name: "expectedImpact", label: "Impacto esperado", type: "textarea" },
      { name: "responsible", label: "Responsavel", type: "text" },
      { name: "decisionDate", label: "Data", type: "date" },
      { name: "attachments", label: "Anexos JSON", type: "json" },
      { name: "tags", label: "Tags", type: "array" },
      { name: "status", label: "Status", type: "select", options: publishOptions },
    ],
    orderBy: { decisionDate: "desc" },
  },
  settings: {
    label: "Configuracoes",
    description: "Configuracoes gerais do ProviderX Planning Hub.",
    model: "setting",
    titleField: "key",
    fields: [
      { name: "key", label: "Chave", type: "text", required: true },
      { name: "value", label: "Valor JSON", type: "json", required: true },
      { name: "type", label: "Tipo", type: "text" },
      { name: "description", label: "Descricao", type: "textarea" },
    ],
    orderBy: { key: "asc" },
  },
};

export function getResource(entity: string) {
  return adminResources[entity];
}
