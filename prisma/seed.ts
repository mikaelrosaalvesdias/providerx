import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const permissions = [
  ["dashboard.view", "Ver dashboard"],
  ["admin.manage", "Gerenciar admin"],
  ["products.manage", "Gerenciar produtos"],
  ["pricing.manage", "Gerenciar precos e custos"],
  ["commissions.manage", "Gerenciar comissoes"],
  ["people.manage", "Gerenciar representantes e parceiros"],
  ["proposals.manage", "Gerenciar propostas"],
  ["proposals.view_own", "Ver apenas propostas vinculadas"],
  ["contracts.manage", "Gerenciar contratos"],
  ["contracts.view_own", "Ver apenas contratos vinculados"],
  ["playbook.manage", "Gerenciar playbook"],
  ["knowledge.manage", "Gerenciar conhecimento"],
  ["certificates.manage", "Gerenciar certificados"],
  ["portal.external", "Acesso futuro ao portal externo"],
  ["proposal_templates.manage", "Gerenciar modelos de proposta"],
  ["org.manage", "Gerenciar organograma"],
  ["reports.view", "Ver relatorios"],
  ["logs.view", "Ver logs"],
];

const roleProfiles = [
  { name: "Admin Master", description: "Acesso total ao ProviderX Playbook Comercial", restricted: false },
  { name: "Diretoria", description: "Visao executiva, relatorios, dashboards e estrategia", restricted: false },
  { name: "Gestor Comercial", description: "Gestao comercial, propostas, playbook, metas e equipe", restricted: false },
  { name: "Marketing", description: "Gestao de materiais, apresentacoes, conhecimento e playbook", restricted: true },
  { name: "Financeiro", description: "Custos, comissoes, contratos e relatorios financeiros", restricted: true },
  { name: "Vendedor Interno", description: "Propostas, simulador, playbook e conhecimento", restricted: true },
  { name: "Operacional", description: "Contratos, implantacao, conhecimento e arquivos", restricted: true },
  { name: "Visualizador", description: "Acesso somente leitura aos principais modulos internos", restricted: true },
];

const commissionBases = [
  { key: "setup", label: "Setup", baseType: "SETUP", description: "Comissao calculada sobre valor de setup." },
  { key: "monthly", label: "Mensalidade", baseType: "MONTHLY", description: "Comissao calculada sobre recorrencia mensal." },
  { key: "gross_revenue", label: "Faturamento bruto", baseType: "GROSS_REVENUE", description: "Base antes de desconto, custos e repasses." },
  { key: "net_revenue", label: "Faturamento liquido", baseType: "NET_REVENUE", description: "Base apos desconto comercial." },
  { key: "margin", label: "Margem", baseType: "MARGIN", description: "Base sobre receita liquida menos custo." },
  { key: "custom", label: "Regra personalizada", baseType: "CUSTOM", description: "Formula documentada em regra personalizada." },
] as const;

const products = [
  {
    name: "Vigia Amigo",
    slug: "vigia-amigo",
    primaryColor: "#2ce9ff",
    category: "Residencial e Comercial",
    shortDescription: "Monitoramento inteligente para CFTV e interfone virtual.",
    description:
      "Produto white-label para provedores que querem vender monitoramento inteligente, interfone virtual e recorrencia em condominios, empresas e residencias.",
    targetAudience: "Provedores de internet com carteira B2B, condominios, comercio local e clientes residenciais premium.",
    pains: ["Baixa recorrencia alem da internet", "CFTV sem monitoramento ativo", "Condominios com atendimento manual"],
    benefits: ["Nova receita recorrente", "Oferta de seguranca com marca do provedor", "Setup claro e licencas escalaveis"],
    salesArguments: ["Comece com base atual de clientes", "Ticket recorrente por licenca", "Produto com apelo de seguranca e conveniencia"],
    approachScripts: ["Abra pela dor de seguranca e pela chance de recorrencia adicional na base atual."],
    whatsappScripts: ["Oi, tudo bem? A ProviderX tem uma oferta white-label de monitoramento inteligente e interfone virtual para provedores. Podemos avaliar sua carteira?"],
    callScripts: ["Validar base CFTV, condominios atendidos, equipe tecnica e ticket desejado antes de apresentar tabela."],
    implementationChecklist: ["Validar escopo", "Confirmar licencas", "Definir responsavel tecnico", "Agendar setup"],
    closingChecklist: ["Confirmar decisor", "Validar setup", "Validar mensalidade", "Registrar condicao comercial", "Converter proposta em contrato"],
    objections: [
      { objection: "Ja tenho cameras instaladas", answer: "O Vigia Amigo adiciona inteligencia e monitoramento ao parque existente." },
      { objection: "Minha equipe nao vende seguranca", answer: "O playbook entrega roteiro, diagnostico e proposta pronta por perfil de cliente." },
    ],
  },
  {
    name: "Wi-Facil",
    slug: "wi-facil",
    primaryColor: "#63ff9a",
    category: "Hotspot e Marketing",
    shortDescription: "Hotspot simples com captura de nome e WhatsApp.",
    description:
      "Hotspot white-label para capturar contatos, manter conformidade LGPD, ativar marketing via WhatsApp e monetizar Wi-Fi.",
    targetAudience: "Provedores, varejo, franquias, food service, eventos e espacos com fluxo de publico.",
    pains: ["Wi-Fi gratuito sem retorno comercial", "Base de contatos descentralizada", "Baixa ativacao no WhatsApp"],
    benefits: ["Captura de leads", "Marketing local", "Monetizacao do Wi-Fi"],
    salesArguments: ["Transforma Wi-Fi em canal comercial", "Implantacao simples", "Fortalece relacionamento com o cliente final"],
    approachScripts: ["Venda como transformacao do Wi-Fi gratuito em canal de lead e relacionamento."],
    whatsappScripts: ["Seu Wi-Fi hoje gera base de contatos? O Wi-Facil captura nome e WhatsApp com LGPD e abre marketing local."],
    callScripts: ["Pergunte onde o cliente oferece Wi-Fi, como captura contatos e se ja ativa campanhas por WhatsApp."],
    implementationChecklist: ["Mapear locais", "Configurar portal", "Validar LGPD", "Testar captura"],
    closingChecklist: ["Confirmar locais", "Confirmar base desejada", "Definir campanha inicial"],
    objections: [{ objection: "O cliente so quer Wi-Fi gratis", answer: "A captura simples gera base propria sem atrito relevante." }],
  },
  {
    name: "AtendAI",
    slug: "atendai",
    primaryColor: "#8a5cff",
    category: "Atendimento e IA",
    shortDescription: "Atendimento via WhatsApp Oficial/API Meta com IA de apoio.",
    description:
      "Central de atendimento white-label com filas, setores, historico, contexto, IA de apoio e integracoes com ERP/CRM.",
    targetAudience: "Provedores e operacoes de atendimento com alto volume de WhatsApp.",
    pains: ["Atendimento disperso", "Fila sem visibilidade", "Perda de contexto entre atendentes"],
    benefits: ["Organizacao por setores", "Historico centralizado", "Relatorios por atendente e fila"],
    salesArguments: ["WhatsApp oficial reduz risco operacional", "IA apoia resposta sem tirar controle humano", "Indicadores claros para gestao"],
    approachScripts: ["Comece pelo custo de atendimento disperso e pela falta de visibilidade de fila."],
    whatsappScripts: ["Como esta o controle das filas no WhatsApp hoje? O AtendAI organiza setores, historico e IA de apoio."],
    callScripts: ["Levantar volume de mensagens, setores, atendentes, ERP/CRM e indicadores atuais."],
    implementationChecklist: ["Validar API Meta", "Criar setores", "Configurar filas", "Treinar atendentes"],
    closingChecklist: ["Confirmar numeros", "Confirmar setores", "Validar integracoes", "Aprovar cronograma"],
    objections: [{ objection: "Ja uso WhatsApp Web", answer: "O AtendAI organiza escala, historico, filas, permissoes e relatorios." }],
  },
  {
    name: "Pixel Facil",
    slug: "pixel-facil",
    primaryColor: "#ffd166",
    category: "TV Corporativa e Filas",
    shortDescription: "Senhas na TV, midia indoor e fila inteligente com WhatsApp.",
    description:
      "Gestao de TVs, campanhas e chamadas de senha para reduzir percepcao de espera e abrir espaco para midia indoor.",
    targetAudience: "Lojas de provedor, clinicas, varejo, assistencias e recepcoes com fila.",
    pains: ["Fila desorganizada", "TV sem conteudo comercial", "Cliente sem previsao de atendimento"],
    benefits: ["Organizacao visual", "Campanhas na TV", "WhatsApp na jornada da fila"],
    salesArguments: ["Melhora experiencia presencial", "Aumenta exposicao de ofertas", "Padroniza comunicacao em lojas"],
    approachScripts: ["Conecte fila organizada, midia indoor e reducao de percepcao de espera."],
    whatsappScripts: ["Sua loja usa TV para fila e ofertas? O Pixel Facil organiza senhas e campanhas por unidade."],
    callScripts: ["Mapear quantidade de TVs, unidades, fluxo de atendimento e campanhas atuais."],
    implementationChecklist: ["Cadastrar telas", "Criar campanhas", "Configurar fila", "Testar chamada"],
    closingChecklist: ["Confirmar TVs", "Confirmar unidades", "Aprovar primeira campanha"],
    objections: [{ objection: "Minha loja e pequena", answer: "Mesmo operacoes pequenas ganham percepcao de organizacao e espaco de oferta." }],
  },
  {
    name: "123 Encarte",
    slug: "123-encarte",
    primaryColor: "#ff3df2",
    category: "Varejo e Encartes",
    shortDescription: "Cartazes profissionais integrados ao ERP.",
    description:
      "Criacao de cartazes, artes A4, story e TV com modelos prontos, sincronizacao de precos e padronizacao visual.",
    targetAudience: "Mercados, varejo alimentar, lojas, redes regionais e operacoes com troca frequente de precos.",
    pains: ["Cartazes manuais", "Preco divergente do ERP", "Visual sem padrao"],
    benefits: ["Padronizacao visual", "Sincronizacao de precos", "Agilidade em campanhas"],
    salesArguments: ["Reduz retrabalho", "Mantem preco consistente", "Gera materiais para loja e redes sociais"],
    approachScripts: ["Ataque divergencia de preco, retrabalho e falta de padrao visual."],
    whatsappScripts: ["Como voces criam cartazes e stories de ofertas hoje? O 123 Encarte padroniza e sincroniza precos."],
    callScripts: ["Entender ERP, volume de ofertas, formatos usados e frequencia de campanhas."],
    implementationChecklist: ["Mapear ERP", "Configurar modelos", "Testar sincronizacao", "Validar formatos"],
    closingChecklist: ["Confirmar ERP", "Confirmar formatos", "Aprovar modelos iniciais"],
    objections: [{ objection: "Ja faco no Canva", answer: "O 123 Encarte conecta modelo, preco e padrao operacional em escala." }],
  },
];

async function ensurePricing(productId: string, category: string, minQuantity: number, maxQuantity: number | null, unitPrice: string) {
  const existing = await prisma.pricingRule.findFirst({
    where: { productId, category, minQuantity, maxQuantity },
  });

  if (existing) {
    return prisma.pricingRule.update({
      where: { id: existing.id },
      data: { unitPrice, active: true },
    });
  }

  return prisma.pricingRule.create({
    data: { productId, category, minQuantity, maxQuantity, unitPrice, active: true },
  });
}

async function ensureCost(productId: string, category: string, minQuantity: number, maxQuantity: number | null, unitCost: string) {
  const existing = await prisma.costRule.findFirst({
    where: { productId, category, minQuantity, maxQuantity },
  });

  if (existing) {
    return prisma.costRule.update({
      where: { id: existing.id },
      data: { unitCost, active: true },
    });
  }

  return prisma.costRule.create({
    data: { productId, category, minQuantity, maxQuantity, unitCost, active: true },
  });
}

async function main() {
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@providerx.local";
  const adminName = process.env.BOOTSTRAP_ADMIN_NAME || "Admin ProviderX";

  if (!adminPassword) {
    throw new Error("Defina BOOTSTRAP_ADMIN_PASSWORD antes de rodar o seed.");
  }

  for (const [key, label] of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: { label },
      create: { key, label },
    });
  }

  for (const base of commissionBases) {
    await prisma.commissionBase.upsert({
      where: { key: base.key },
      update: {
        label: base.label,
        baseType: base.baseType,
        description: base.description,
        active: true,
      },
      create: {
        key: base.key,
        label: base.label,
        baseType: base.baseType,
        description: base.description,
        active: true,
      },
    });
  }

  const roleRecords = new Map<string, { id: string }>();
  for (const profile of roleProfiles) {
    const role = await prisma.role.upsert({
      where: { name: profile.name },
      update: { description: profile.description },
      create: { name: profile.name, description: profile.description },
    });
    roleRecords.set(profile.name, role);
  }

  const adminRole = roleRecords.get("Admin Master");
  const sellerRole = roleRecords.get("Vendedor Interno");
  if (!adminRole || !sellerRole) {
    throw new Error("Perfis iniciais nao foram criados.");
  }

  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permission.id },
    });
  }

  for (const profile of roleProfiles.filter((item) => item.restricted)) {
    const role = roleRecords.get(profile.name);
    if (!role) continue;
    const allowedPermissions =
      profile.name === "Visualizador"
        ? allPermissions.filter((item) => item.key === "dashboard.view")
        : allPermissions.filter((item) => !item.key.includes("admin") && !item.key.includes("logs"));

    for (const permission of allowedPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      status: "ACTIVE",
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      status: "ACTIVE",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });

  await prisma.salesPerson.upsert({
    where: { userId: admin.id },
    update: { name: adminName, email: adminEmail, defaultCommissionPercent: "5.00", goalAmount: "50000.00" },
    create: { userId: admin.id, name: adminName, email: adminEmail, defaultCommissionPercent: "5.00", goalAmount: "50000.00" },
  });

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });

    const basePlan = await prisma.productPlan.upsert({
      where: { productId_name: { productId: product.id, name: "Plano Base" } },
      update: {
        description: `Plano comercial inicial para ${product.name}`,
        setupPrice: product.slug === "vigia-amigo" ? "5500.00" : "0.00",
        monthlyPrice: "0.00",
        active: true,
      },
      create: {
        productId: product.id,
        name: "Plano Base",
        description: `Plano comercial inicial para ${product.name}`,
        setupPrice: product.slug === "vigia-amigo" ? "5500.00" : "0.00",
        monthlyPrice: "0.00",
        active: true,
      },
    });

    const moduleNames =
      product.slug === "vigia-amigo"
        ? ["Setup de implantacao", "Licenca monitoramento", "Licenca interfone digital"]
        : ["Modulo principal", "Treinamento comercial", "Materiais de venda"];

    for (const [sortOrder, moduleName] of moduleNames.entries()) {
      await prisma.productModule.upsert({
        where: { productId_name: { productId: product.id, name: moduleName } },
        update: {
          description: `Modulo inicial editavel para ${product.name}.`,
          moduleType: sortOrder === 0 ? "commercial" : "recurring",
          setupPrice: product.slug === "vigia-amigo" && sortOrder === 0 ? "5500.00" : "0.00",
          monthlyPrice: "0.00",
          active: true,
          sortOrder,
        },
        create: {
          productId: product.id,
          name: moduleName,
          description: `Modulo inicial editavel para ${product.name}.`,
          moduleType: sortOrder === 0 ? "commercial" : "recurring",
          setupPrice: product.slug === "vigia-amigo" && sortOrder === 0 ? "5500.00" : "0.00",
          monthlyPrice: "0.00",
          active: true,
          sortOrder,
        },
      });
    }

    const netRevenueBase = await prisma.commissionBase.findUniqueOrThrow({ where: { key: "net_revenue" } });

    await prisma.commissionRule.upsert({
      where: { id: `${product.slug}-default-commission` },
      update: {
        productId: product.id,
        planId: basePlan.id,
        baseId: netRevenueBase.id,
        commissionBase: "NET_REVENUE",
        triggerEvent: "contract_active",
        appliesTo: "seller_representative_partner",
        active: true,
      },
      create: {
        id: `${product.slug}-default-commission`,
        productId: product.id,
        planId: basePlan.id,
        baseId: netRevenueBase.id,
        name: `Comissao padrao - ${product.name}`,
        appliesTo: "seller_representative_partner",
        salesPersonCommissionPercent: "5.00",
        representativeCommissionPercent: "10.00",
        partnerRevenuePercent: "15.00",
        commissionBase: "NET_REVENUE",
        triggerEvent: "contract_active",
        active: true,
      },
    });

    const track = await prisma.knowledgeTrack.upsert({
      where: { id: `${product.slug}-track` },
      update: { title: `Trilha comercial - ${product.name}`, productId: product.id },
      create: {
        id: `${product.slug}-track`,
        productId: product.id,
        title: `Trilha comercial - ${product.name}`,
        description: `Conteudos iniciais para vender ${product.name}.`,
        status: "PUBLISHED",
      },
    });

    const introContent = await prisma.knowledgeContent.upsert({
      where: { id: `${product.slug}-intro-content` },
      update: { title: `Visao comercial - ${product.name}`, productId: product.id, trackId: track.id },
      create: {
        id: `${product.slug}-intro-content`,
        productId: product.id,
        trackId: track.id,
        title: `Visao comercial - ${product.name}`,
        contentType: "TEXT",
        description: item.description,
        status: "PUBLISHED",
      },
    });

    const quiz = await prisma.quiz.upsert({
      where: { id: `${product.slug}-quiz` },
      update: { title: `Prova rapida - ${product.name}`, productId: product.id, trackId: track.id },
      create: {
        id: `${product.slug}-quiz`,
        productId: product.id,
        trackId: track.id,
        title: `Prova rapida - ${product.name}`,
        description: "Avaliacao inicial de conhecimento comercial.",
        passingScore: 70,
        status: "PUBLISHED",
      },
    });

    const question = await prisma.quizQuestion.upsert({
      where: { id: `${product.slug}-quiz-q1` },
      update: {
        options: ["Gerar recorrencia e padronizar venda", "Substituir todo o ERP do cliente", "Vender somente hardware"],
        correctAnswer: "Gerar recorrencia e padronizar venda",
      },
      create: {
        id: `${product.slug}-quiz-q1`,
        quizId: quiz.id,
        prompt: `Qual e o principal objetivo comercial do ${product.name}?`,
        options: ["Gerar recorrencia e padronizar venda", "Substituir todo o ERP do cliente", "Vender somente hardware"],
        correctAnswer: "Gerar recorrencia e padronizar venda",
        explanation: "A ProviderX vende produtos white-label com foco em recorrencia, playbook e operacao comercial.",
      },
    });

    const answerOptions = [
      ["Gerar recorrencia e padronizar venda", true],
      ["Substituir todo o ERP do cliente", false],
      ["Vender somente hardware", false],
    ] as const;
    for (const [sortOrder, [label, isCorrect]] of answerOptions.entries()) {
      await prisma.quizAnswer.upsert({
        where: { id: `${product.slug}-quiz-q1-a${sortOrder + 1}` },
        update: { label, isCorrect, sortOrder },
        create: {
          id: `${product.slug}-quiz-q1-a${sortOrder + 1}`,
          questionId: question.id,
          label,
          isCorrect,
          sortOrder,
        },
      });
    }

    await prisma.knowledgeTrackItem.upsert({
      where: { id: `${product.slug}-track-content` },
      update: { trackId: track.id, contentId: introContent.id, sortOrder: 0, required: true },
      create: { id: `${product.slug}-track-content`, trackId: track.id, contentId: introContent.id, sortOrder: 0, required: true },
    });

    await prisma.knowledgeTrackItem.upsert({
      where: { id: `${product.slug}-track-quiz` },
      update: { trackId: track.id, quizId: quiz.id, sortOrder: 1, required: true },
      create: { id: `${product.slug}-track-quiz`, trackId: track.id, quizId: quiz.id, sortOrder: 1, required: true },
    });

    const sections = [
      ["como-vender", "Como vender", `Posicione ${product.name} como oferta white-label de alto valor, conectando dor operacional, ganho de recorrencia e implantacao guiada.`],
      ["diagnostico", "Perguntas de diagnostico", `Mapeie base de clientes, volume de atendimento, canais atuais, responsavel pela decisao e urgencia da dor.`],
      ["whatsapp", "Script de WhatsApp", `Oi, tudo bem? A ProviderX esta habilitando provedores a vender ${product.name} com marca propria. Faz sentido avaliar um piloto para sua base?`],
      ["objecoes", "Objecoes e respostas", `Use respostas curtas, sempre conectando retorno financeiro, simplicidade operacional e suporte comercial.`],
      ["fechamento", "Checklist de fechamento", `Validar decisor, escopo, licencas, setup, mensalidade, parceiro, comissoes, contrato e proximos passos.`],
    ];

    for (const [kind, title, content] of sections) {
      await prisma.playbookSection.upsert({
        where: { id: `${product.slug}-${kind}` },
        update: { title, content, productId: product.id },
        create: {
          id: `${product.slug}-${kind}`,
          productId: product.id,
          kind,
          title,
          content,
          status: "PUBLISHED",
          sortOrder: sections.findIndex((section) => section[0] === kind),
        },
      });
    }

    await prisma.playbookContent.upsert({
      where: { id: `${product.slug}-strategy-isp` },
      update: {
        productId: product.id,
        audience: "Provedores de internet",
        salesStage: "Diagnostico",
        customerType: "ISP",
        title: `Estrategia por segmento - ${product.name}`,
        content: `Use ${product.name} para ampliar carteira, criar recorrencia e reduzir dependencia de internet como unico produto.`,
      },
      create: {
        id: `${product.slug}-strategy-isp`,
        productId: product.id,
        audience: "Provedores de internet",
        salesStage: "Diagnostico",
        customerType: "ISP",
        title: `Estrategia por segmento - ${product.name}`,
        content: `Use ${product.name} para ampliar carteira, criar recorrencia e reduzir dependencia de internet como unico produto.`,
      },
    });

    await prisma.proposalTemplate.upsert({
      where: { id: `${product.slug}-proposal-template` },
      update: {
        productId: product.id,
        name: `Modelo comercial - ${product.name}`,
        status: "PUBLISHED",
      },
      create: {
        id: `${product.slug}-proposal-template`,
        productId: product.id,
        name: `Modelo comercial - ${product.name}`,
        description: "Modelo inicial com capa, produto, precos e condicoes comerciais.",
        pages: [
          { pageType: "COVER", title: `Proposta ${product.name}`, content: "Capa comercial ProviderX" },
          { pageType: "PRODUCT", title: product.name, content: item.description },
          { pageType: "PRICING", title: "Condicoes comerciais", content: "Bloco modular de setup, licencas, mensalidade e descontos." },
          { pageType: "COMMERCIAL_TERMS", title: "Proximos passos", content: "Validade, implantacao, responsaveis e aceite futuro." },
        ],
        footer: "ProviderX/Cariap - Produtos white-label para provedores e varejo",
        status: "PUBLISHED",
      },
    });

    await ensureCost(product.id, "licenca", 1, null, "0.00");
  }

  const vigia = await prisma.product.findUniqueOrThrow({ where: { slug: "vigia-amigo" } });
  for (const category of ["monitoramento", "interfone-digital"]) {
    await ensurePricing(vigia.id, category, 100, 100, "3.00");
    await ensurePricing(vigia.id, category, 101, 500, "2.50");
    await ensurePricing(vigia.id, category, 501, 1000, "2.00");
    await ensurePricing(vigia.id, category, 1001, 5000, "1.50");
  }

  await prisma.company.upsert({
    where: { id: "seed-provider-demo" },
    update: {},
    create: {
      id: "seed-provider-demo",
      legalName: "Provedor Demo LTDA",
      tradeName: "Provedor Demo",
      segment: "ISP",
      contactName: "Responsavel Comercial",
      email: "contato@provedordemo.local",
      city: "Sao Paulo",
      state: "SP",
    },
  });

  await prisma.representative.upsert({
    where: { id: "seed-representative-demo" },
    update: {
      document: "00000000000",
      phone: "(11) 0000-0000",
      email: "representante@providerx.local",
    },
    create: {
      id: "seed-representative-demo",
      name: "Representante Demo",
      document: "00000000000",
      company: "ProviderX Parceiros",
      region: "Sudeste",
      contact: "representante@providerx.local",
      phone: "(11) 0000-0000",
      email: "representante@providerx.local",
      defaultCommissionPercent: "10.00",
      goalAmount: "80000.00",
    },
  });

  await prisma.partnerCompany.upsert({
    where: { id: "seed-partner-demo" },
    update: {
      phone: "(11) 0000-0000",
      email: "parceiro@providerx.local",
      billingBase: "GROSS_REVENUE",
      customRules: { type: "gross_or_custom", note: "Regra editavel no Admin" },
    },
    create: {
      id: "seed-partner-demo",
      legalName: "Parceiro Demo LTDA",
      tradeName: "Parceiro Demo",
      phone: "(11) 0000-0000",
      email: "parceiro@providerx.local",
      partnershipType: "Faturamento compartilhado",
      revenueSharePercent: "15.00",
      billingBase: "GROSS_REVENUE",
      customRules: { type: "gross_or_custom", note: "Regra editavel no Admin" },
      products: products.map((item) => item.name),
    },
  });

  await prisma.orgUnit.upsert({
    where: { id: "seed-org-comercial" },
    update: {
      position: "Gestao Comercial",
      company: "ProviderX/Cariap",
      department: "Comercial",
      email: adminEmail,
      status: "ACTIVE",
    },
    create: {
      id: "seed-org-comercial",
      name: "Comercial ProviderX",
      position: "Gestao Comercial",
      company: "ProviderX/Cariap",
      department: "Comercial",
      managerUserId: admin.id,
      email: adminEmail,
      status: "ACTIVE",
      description: "Unidade inicial para representantes, vendedores e parceiros.",
    },
  });

  await prisma.setting.upsert({
    where: { key: "commercial_currency" },
    update: { value: "BRL", type: "string" },
    create: {
      key: "commercial_currency",
      value: "BRL",
      type: "string",
      description: "Moeda padrao para propostas e relatorios.",
    },
  });

  await prisma.setting.upsert({
    where: { key: "certificate_template" },
    update: {
      value: {
        title: "Certificado ProviderX",
        text: "Certificamos que {{user}} concluiu a trilha {{track}} do produto {{product}} em {{date}} com nota {{score}}.",
        accentColor: "#2ce9ff",
      },
      type: "json",
    },
    create: {
      key: "certificate_template",
      value: {
        title: "Certificado ProviderX",
        text: "Certificamos que {{user}} concluiu a trilha {{track}} do produto {{product}} em {{date}} com nota {{score}}.",
        accentColor: "#2ce9ff",
      },
      type: "json",
      description: "Modelo visual/textual interno para certificados de conhecimento.",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "seed",
      entity: "system",
      metadata: { products: products.length, permissions: permissions.length },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
