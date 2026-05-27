import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const permissions = [
  ["dashboard.view", "Ver central executiva"],
  ["planning.view", "Ver planejamento"],
  ["planning.manage", "Gerenciar planejamento"],
  ["materials.manage", "Gerenciar materiais"],
  ["reports.view", "Ver relatorios"],
  ["exports.manage", "Exportar documentos"],
  ["logs.view", "Ver logs"],
  ["admin.manage", "Administrar sistema"],
] as const;

const roleProfiles = [
  {
    name: "Admin Master",
    description: "Acesso total ao ProviderX Planning Hub.",
    permissions: permissions.map(([key]) => key),
  },
  {
    name: "Diretoria",
    description: "Visao executiva, plano, relatorios, logs e exportacoes.",
    permissions: ["dashboard.view", "planning.view", "reports.view", "exports.manage", "logs.view"],
  },
  {
    name: "Produto",
    description: "Gestao de verticais, produtos, materiais e planejamento.",
    permissions: ["dashboard.view", "planning.view", "planning.manage", "materials.manage", "reports.view", "exports.manage"],
  },
  {
    name: "Comercial",
    description: "Estrategia comercial, modelo de receita, materiais e relatorios.",
    permissions: ["dashboard.view", "planning.view", "planning.manage", "materials.manage", "reports.view"],
  },
  {
    name: "Marketing",
    description: "Materiais, posicionamento, diferenciais e comunicacao.",
    permissions: ["dashboard.view", "planning.view", "materials.manage", "reports.view"],
  },
  {
    name: "Financeiro",
    description: "Modelo de receita, custos, investimentos e projecoes.",
    permissions: ["dashboard.view", "planning.view", "planning.manage", "reports.view", "exports.manage"],
  },
  {
    name: "Tecnologia",
    description: "Estrutura tecnologica, infraestrutura planejada e logs.",
    permissions: ["dashboard.view", "planning.view", "reports.view", "logs.view"],
  },
  {
    name: "Visualizador",
    description: "Acesso de leitura ao hub interno.",
    permissions: ["dashboard.view", "planning.view", "reports.view"],
  },
] as const;

const businessPlanSections = [
  {
    key: "slogan",
    title: "Slogan",
    content: "Escale servicos. Multiplique receitas.",
  },
  {
    key: "visao-geral",
    title: "Visao Geral",
    content:
      "A ProviderX e uma empresa focada em solucoes White Label para provedores regionais de internet, permitindo que ISPs aumentem receita recorrente atraves de servicos inteligentes voltados para auto monitoramento residencial, interfone virtual, seguranca para comercios, atendimento automatizado, solucoes para varejo e plataformas SaaS.\n\nO modelo permite ao provedor vender servicos adicionais utilizando sua propria marca, fortalecendo fidelizacao, ticket medio, diferenciacao regional e recorrencia financeira.",
  },
  {
    key: "problema-mercado",
    title: "Problema do Mercado",
    content:
      "Os provedores regionais enfrentam guerra de precos, baixa diferenciacao, alta concorrencia, dependencia exclusiva da mensalidade da internet e reducao de margem operacional.\n\nAo mesmo tempo, possuem base de clientes ativa, relacionamento regional forte, estrutura tecnica instalada e potencial de expansao comercial.",
  },
  {
    key: "solucao-providerx",
    title: "Solucao ProviderX",
    content:
      "A ProviderX transforma o ISP em uma plataforma regional de servicos inteligentes.\n\nO provedor deixa de vender apenas internet e passa a oferecer seguranca, automacao, atendimento inteligente, solucoes digitais e servicos de valor agregado, tudo em modelo White Label.",
  },
  {
    key: "estrutura-solucoes",
    title: "Estrutura das Solucoes",
    content:
      "As solucoes estao organizadas em tres verticais iniciais: ProviderX Home, ProviderX Comércios e Serviços Locais e ProviderX Varejo. Cada vertical possui produtos, recursos, publico, dor resolvida, beneficio principal e status de maturidade.",
  },
  {
    key: "modelo-receita",
    title: "Modelo de Receita",
    content:
      "O modelo inicial prioriza receita recorrente SaaS por provedor parceiro. O ticket medio planejado e de R$ 1.500 por provedor, com receitas complementares futuras em setup, implantacao, customizacao, aplicativo white-label e suporte premium.\n\nRevenue share e comissoes nao fazem parte do MVP.",
  },
  {
    key: "publico-alvo",
    title: "Publico-Alvo",
    content:
      "Publico primario: provedores regionais de internet.\n\nPublicos secundarios: integradores, empresas de seguranca, redes varejistas e franquias regionais.",
  },
  {
    key: "diferenciais-competitivos",
    title: "Diferenciais Competitivos",
    content:
      "White Label completo, foco exclusivo em ISPs, plataforma modular, recorrencia previsivel e escalabilidade nacional.",
  },
  {
    key: "estrategia-comercial",
    title: "Estrategia Comercial",
    content:
      "Entrada inicial em pequenos e medios ISPs, cidades regionais e interior.\n\nOferta principal: aumente seu ticket medio sem expandir rede.\n\nCanais planejados: eventos de provedores, HUBs de SVAs, canais regionais, integradores, inside sales e demonstracao pratica.",
  },
  {
    key: "estrutura-operacional",
    title: "Estrutura Operacional",
    content:
      "Comercial: SDR, inside sales, executivo comercial e customer success.\nOperacoes Tecnicas: implantacao, monitoramento e suporte tecnico.\nTecnologia: desenvolvimento, integracoes e infraestrutura.\nMarketing: branding, campanhas, conteudo e materiais comerciais.\nAdministrativo e Financeiro: financeiro, faturamento, cobranca e processos administrativos.",
  },
  {
    key: "estrutura-tecnologica",
    title: "Estrutura Tecnologica",
    content:
      "Itens planejados: aplicativo mobile, painel web, integracao ONVIF/RTSP, notificacoes push, cloud e servidores, APIs e integracoes.",
  },
  {
    key: "projecao-financeira",
    title: "Projecao Financeira",
    content:
      "Cenario inicial: 10 provedores parceiros com ticket medio ProviderX de R$ 1.500, resultando em R$ 15.000 por mes.\n\nCenario escalado no primeiro ano: 150 provedores parceiros com ticket medio ProviderX de R$ 1.500, resultando em R$ 225.000 por mes.",
  },
  {
    key: "custos-principais",
    title: "Custos Principais",
    content: "Custos planejados: servidores, cloud, desenvolvimento, equipe, suporte, marketing e infraestrutura.",
  },
  {
    key: "investimento-inicial",
    title: "Investimento Inicial",
    content:
      "A definir, dependendo de desenvolvimento, equipe, infraestrutura, aplicativo, marketing e expansao comercial.",
  },
  {
    key: "objetivo-estrategico",
    title: "Objetivo Estrategico",
    content:
      "Transformar provedores regionais em plataformas locais de servicos inteligentes, aumentando ticket medio, retencao, recorrencia, fidelizacao e valor da base de assinantes.",
  },
  {
    key: "visao-longo-prazo",
    title: "Visao de Longo Prazo",
    content: "Ser a principal plataforma White Label de servicos inteligentes para ISPs do Brasil.",
  },
  {
    key: "organogramas",
    title: "Organogramas",
    content:
      "CEO / Diretor Geral no topo, com cinco areas principais: Comercial, Operacoes Tecnicas, Tecnologia, Marketing, Administrativo e Financeiro.",
  },
] as const;

const verticals = [
  {
    name: "ProviderX Home",
    slug: "providerx-home",
    description: "Auto monitoramento residencial e Interfone Virtual.",
    color: "#2ce9ff",
    targetAudience: "Residencias, condominios e pequenas propriedades.",
    notes: "Recursos: aplicativo white label, gravacao em nuvem, gravacao local, notificacoes e interfone virtual.",
  },
  {
    name: "ProviderX Comércios e Serviços Locais",
    slug: "providerx-comercios-servicos-locais",
    description: "Solucoes inteligentes para pequenos negocios.",
    color: "#4fffa6",
    targetAudience: "Lojas, escritorios, pequenos mercados, farmacias, restaurantes e prestadores de servicos locais.",
    notes: "Recursos: auto monitoramento, alertas, cerca virtual, analytics, multiusuario, chatbot, atendimento automatizado e hotspot.",
  },
  {
    name: "ProviderX Varejo",
    slug: "providerx-varejo",
    description: "Solucoes inteligentes para varejo.",
    color: "#ff5bb8",
    targetAudience: "Redes varejistas, franquias regionais, mercados, lojas e operacoes com fluxo de clientes.",
    notes: "Inclui Wi-Facil, AtendAI, Pixel Facil e 123 Encarte.",
  },
] as const;

const products = [
  {
    verticalSlug: "providerx-home",
    name: "Auto Monitoramento Residencial",
    slug: "auto-monitoramento-residencial",
    shortDescription: "Monitoramento residencial white-label para provedores.",
    description: "Solucao para transformar a base residencial do ISP em oportunidade de seguranca e recorrencia.",
    features: ["Aplicativo white label", "Gravacao em nuvem", "Gravacao local", "Notificacoes"],
    targetAudience: "Residencias e pequenas propriedades.",
    painSolved: "Dependencia exclusiva da mensalidade da internet.",
    mainBenefit: "Nova camada de servico recorrente com marca do provedor.",
    whiteLabelModel: "Oferta operada pelo provedor com marca propria.",
    status: "STRUCTURING",
  },
  {
    verticalSlug: "providerx-home",
    name: "Interfone Virtual",
    slug: "interfone-virtual",
    shortDescription: "Interfone virtual com foco em condominios e propriedades conectadas.",
    description: "Produto para modernizar acesso, atendimento e conveniencia residencial.",
    features: ["Interfone virtual", "Controle de acesso", "Notificacoes", "Aplicativo"],
    targetAudience: "Condominios e pequenas propriedades.",
    painSolved: "Atendimento de acesso manual e pouco escalavel.",
    mainBenefit: "Modernizacao da experiencia residencial.",
    whiteLabelModel: "Aplicativo e comunicacao com marca do provedor.",
    status: "ANALYSIS",
  },
  {
    verticalSlug: "providerx-comercios-servicos-locais",
    name: "Monitoramento Comercial",
    slug: "monitoramento-comercial",
    shortDescription: "Auto monitoramento para cameras de seguranca em pequenos negocios.",
    description: "Solucao para comercios que precisam de alertas, cerca virtual, analytics e multiusuario.",
    features: ["CFTV", "Alertas", "Cerca virtual", "Analytics", "Multiusuario"],
    targetAudience: "Lojas, escritorios, mercados, farmacias e restaurantes.",
    painSolved: "Cameras instaladas sem inteligencia operacional.",
    mainBenefit: "Seguranca e recorrencia para a carteira B2B do ISP.",
    whiteLabelModel: "Servicos com marca do provedor para clientes locais.",
    status: "STRUCTURING",
  },
  {
    verticalSlug: "providerx-comercios-servicos-locais",
    name: "Atendimento Automatizado Local",
    slug: "atendimento-automatizado-local",
    shortDescription: "Chatbot e atendimento automatizado para negocios locais.",
    description: "Planejamento de solucao para reduzir atrito no atendimento de comercios regionais.",
    features: ["Chatbot", "Atendimento automatizado", "Historico", "Fluxos"],
    targetAudience: "Prestadores de servicos locais e pequenos comercios.",
    painSolved: "Atendimento disperso e pouco padronizado.",
    mainBenefit: "Produtividade e velocidade no relacionamento com clientes.",
    whiteLabelModel: "Produto vendido e posicionado pelo ISP.",
    status: "ANALYSIS",
  },
  {
    verticalSlug: "providerx-comercios-servicos-locais",
    name: "Hotspot Wi-Fi Marketing",
    slug: "hotspot-wifi-marketing",
    shortDescription: "Wi-Fi Marketing para captura de leads em ambientes locais.",
    description: "Solucao para transformar Wi-Fi em canal de relacionamento e geracao de leads.",
    features: ["Hotspot", "Captura de nome e WhatsApp", "LGPD", "Campanhas"],
    targetAudience: "Comercios com fluxo de publico.",
    painSolved: "Wi-Fi gratuito sem retorno comercial.",
    mainBenefit: "Gera base de contatos e ativa relacionamento.",
    whiteLabelModel: "Portal com marca do provedor ou cliente.",
    status: "READY",
  },
  {
    verticalSlug: "providerx-varejo",
    name: "Wi-Facil",
    slug: "wi-facil",
    shortDescription: "Wi-Fi marketing white-label.",
    description: "Hotspot simples e rapido para captura de nome e WhatsApp, conformidade LGPD, marketing via WhatsApp e monetizacao de Wi-Fi.",
    features: ["Hotspot", "Captura de WhatsApp", "LGPD", "Marketing via WhatsApp", "Leads"],
    targetAudience: "Provedores, varejo, franquias, food service e eventos.",
    painSolved: "Wi-Fi gratuito sem inteligencia de relacionamento.",
    mainBenefit: "Transforma conexao em base de leads.",
    whiteLabelModel: "Portal e comunicacao com marca do provedor.",
    status: "READY",
  },
  {
    verticalSlug: "providerx-varejo",
    name: "AtendAI",
    slug: "atendai",
    shortDescription: "Chatbot e atendimento automatizado.",
    description: "Solucao de atendimento inteligente via WhatsApp Oficial/API Meta com filas, setores, historico, IA de apoio e relatorios.",
    features: ["WhatsApp Oficial", "Filas", "Setores", "Historico", "IA de apoio", "Relatorios"],
    targetAudience: "Provedores e operacoes de atendimento com alto volume de WhatsApp.",
    painSolved: "Atendimento disperso e sem visibilidade de fila.",
    mainBenefit: "Padroniza atendimento e melhora gestao.",
    whiteLabelModel: "Central de atendimento com marca e processo do provedor.",
    status: "STRUCTURING",
  },
  {
    verticalSlug: "providerx-varejo",
    name: "Pixel Facil",
    slug: "pixel-facil",
    shortDescription: "Captacao e inteligencia de leads.",
    description: "Solucao para captacao e inteligencia de leads no varejo, com potencial de evolucao para midia indoor e jornadas presenciais.",
    features: ["Captacao", "Inteligencia de leads", "Campanhas", "Segmentacao"],
    targetAudience: "Varejo regional e operacoes com presenca fisica.",
    painSolved: "Baixa inteligencia sobre visitantes e interessados.",
    mainBenefit: "Transforma fluxo em dados comerciais.",
    whiteLabelModel: "Ferramenta posicionada como produto do provedor para varejo.",
    status: "ANALYSIS",
  },
  {
    verticalSlug: "providerx-varejo",
    name: "123 Encarte",
    slug: "123-encarte",
    shortDescription: "Sistema promocional para varejo.",
    description: "Criacao de cartazes, ofertas e encartes com modelos prontos, formatos A4, story e TV, sincronizacao de precos e padronizacao visual.",
    features: ["Cartazes", "ERP", "Modelos prontos", "A4", "Story", "TV", "Precos sincronizados"],
    targetAudience: "Mercados, varejo alimentar e lojas regionais.",
    painSolved: "Cartazes manuais, preco divergente e visual sem padrao.",
    mainBenefit: "Agilidade promocional com padrao visual.",
    whiteLabelModel: "Solucao ofertada pelo provedor para carteira varejista.",
    status: "READY",
  },
] as const;

const targetAudiences = [
  ["Provedores regionais de internet", "PRIMARY", "Base primaria para aumento de ticket medio e recorrencia."],
  ["Integradores", "SECONDARY", "Canal tecnico e comercial para solucoes de seguranca e automacao."],
  ["Empresas de seguranca", "SECONDARY", "Parceiros potenciais para monitoramento e implantacao."],
  ["Redes varejistas", "SECONDARY", "Clientes e parceiros para solucoes de varejo."],
  ["Franquias regionais", "SECONDARY", "Operacoes replicaveis com necessidade de padrao e escala."],
] as const;

const differentials = [
  ["White Label completo", "O provedor utiliza sua propria marca."],
  ["Foco exclusivo em ISPs", "Mercado sob dominio de comportamento de compras."],
  ["Plataforma modular", "O provedor escolhe quais solucoes ativar."],
  ["Recorrencia previsivel", "Modelo SaaS mensal."],
  ["Escalabilidade nacional", "Expansao sem necessidade de operacao fisica em todas regioes."],
] as const;

const acquisitionChannels = [
  ["Eventos de provedores", "Gerar demanda e validacao com decisores de ISPs.", "HIGH"],
  ["HUBs de SVAs", "Entrar em canais que ja vendem servicos agregados para provedores.", "HIGH"],
  ["Canais regionais", "Aproveitar relacoes locais para tracao inicial.", "MEDIUM"],
  ["Integradores", "Usar capacidade tecnica e carteira de integradores regionais.", "MEDIUM"],
  ["Inside sales", "Abordagem consultiva com demonstracao pratica.", "HIGH"],
  ["Demonstracao pratica", "Mostrar valor em cenarios reais de provedor e varejo.", "CRITICAL"],
] as const;

const departments = [
  ["Comercial", "Responsavel por prospeccao, expansao da base de ISPs, geracao de demanda, vendas e relacionamento comercial.", ["SDR", "Inside Sales", "Executivo Comercial", "Customer Success"]],
  ["Operacoes Tecnicas", "Responsavel por implantacao, monitoramento, suporte tecnico e estabilidade operacional.", ["Implantacao", "Monitoramento", "Suporte Tecnico"]],
  ["Tecnologia", "Responsavel pelo desenvolvimento, evolucao, integracoes e infraestrutura da plataforma.", ["Desenvolvimento", "Infraestrutura", "Integracoes e APIs"]],
  ["Marketing", "Responsavel por branding, campanhas, comunicacao e geracao de demanda.", ["Marketing Estrategico", "Conteudo e Design", "Branding e Eventos"]],
  ["Administrativo e Financeiro", "Responsavel pela gestao financeira, administrativa e processos internos.", ["Financeiro", "Administrativo", "Faturamento", "Cobranca"]],
] as const;

const technologyItems = [
  ["aplicativo-mobile", "Aplicativo mobile", "Aplicativo white-label para usuarios finais.", "STRUCTURING"],
  ["painel-web", "Painel web", "Painel de gestao ProviderX e clientes internos.", "STRUCTURING"],
  ["onvif-rtsp", "Integracao ONVIF/RTSP", "Camada tecnica para cameras e monitoramento.", "ANALYSIS"],
  ["push", "Notificacoes push", "Comunicacao em tempo real para alertas e jornada.", "ANALYSIS"],
  ["cloud-servidores", "Cloud e servidores", "Base de infraestrutura escalavel.", "STRUCTURING"],
  ["apis-integracoes", "APIs e integracoes", "Integracoes com sistemas de provedores e varejo.", "ANALYSIS"],
] as const;

const costItems = [
  ["servidores", "Servidores", 0],
  ["cloud", "Cloud", 0],
  ["desenvolvimento", "Desenvolvimento", 0],
  ["equipe", "Equipe", 0],
  ["suporte", "Suporte", 0],
  ["marketing", "Marketing", 0],
  ["infraestrutura", "Infraestrutura", 0],
] as const;

const investmentItems = [
  ["desenvolvimento", "Desenvolvimento", "HIGH"],
  ["equipe", "Equipe", "HIGH"],
  ["infraestrutura", "Infraestrutura", "HIGH"],
  ["aplicativo", "Aplicativo", "MEDIUM"],
  ["marketing", "Marketing", "MEDIUM"],
  ["expansao-comercial", "Expansao comercial", "MEDIUM"],
] as const;

const decisions = [
  ["ProviderX focada em ISPs regionais", "Mercado inicial definido como provedores regionais de internet.", "Foco reduz dispersao comercial e acelera validacao."],
  ["ProviderX Health e Digital retirados do escopo", "Verticais Health e Digital nao entram no MVP.", "Evitar escopo excessivo antes de consolidar verticais atuais."],
  ["ProviderX Varejo substitui ProviderX Retail", "Nome da vertical ajustado para melhor entendimento no Brasil.", "Melhor aderencia ao publico interno e comercial."],
  ["Revenue share fora do modelo inicial", "Nao criar modulo de revenue share no MVP.", "Manter modelo inicial simples e editavel por receita planejada."],
  ["Ticket medio inicial de R$ 1.500", "Cenario financeiro parte de R$ 1.500 por provedor parceiro.", "Referencia para planejamento conservador e escalado."],
] as const;

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

  const permissionRecords = await prisma.permission.findMany({ where: { key: { in: permissions.map(([key]) => key) } } });
  const permissionByKey = new Map(permissionRecords.map((permission) => [permission.key, permission]));

  for (const profile of roleProfiles) {
    const role = await prisma.role.upsert({
      where: { name: profile.name },
      update: { description: profile.description },
      create: { name: profile.name, description: profile.description },
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const key of profile.permissions) {
      const permission = permissionByKey.get(key);
      if (!permission) continue;
      await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: permission.id } });
    }
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "Admin Master" } });
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, status: "ACTIVE" },
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

  for (const [sortOrder, section] of businessPlanSections.entries()) {
    await prisma.businessPlanSection.upsert({
      where: { key: section.key },
      update: { title: section.title, content: section.content, sortOrder, status: "PUBLISHED" },
      create: { ...section, sortOrder, status: "PUBLISHED" },
    });
  }

  const verticalBySlug = new Map<string, { id: string }>();
  for (const [sortOrder, vertical] of verticals.entries()) {
    const record = await prisma.vertical.upsert({
      where: { slug: vertical.slug },
      update: { ...vertical, sortOrder, status: "ACTIVE" },
      create: { ...vertical, sortOrder, status: "ACTIVE" },
    });
    verticalBySlug.set(vertical.slug, record);
  }

  const productBySlug = new Map<string, { id: string }>();
  for (const [sortOrder, product] of products.entries()) {
    const vertical = verticalBySlug.get(product.verticalSlug);
    if (!vertical) throw new Error(`Vertical nao encontrada: ${product.verticalSlug}`);
    const record = await prisma.productSolution.upsert({
      where: { slug: product.slug },
      update: {
        verticalId: vertical.id,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        features: [...product.features],
        targetAudience: product.targetAudience,
        painSolved: product.painSolved,
        mainBenefit: product.mainBenefit,
        whiteLabelModel: product.whiteLabelModel,
        status: product.status,
        sortOrder,
      },
      create: {
        verticalId: vertical.id,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        features: [...product.features],
        targetAudience: product.targetAudience,
        painSolved: product.painSolved,
        mainBenefit: product.mainBenefit,
        whiteLabelModel: product.whiteLabelModel,
        status: product.status,
        sortOrder,
      },
    });
    productBySlug.set(product.slug, record);

    for (const [featureOrder, feature] of product.features.entries()) {
      await prisma.productFeature.upsert({
        where: { id: `${product.slug}-feature-${featureOrder}` },
        update: { productId: record.id, name: feature, sortOrder: featureOrder, status: "ACTIVE" },
        create: { id: `${product.slug}-feature-${featureOrder}`, productId: record.id, name: feature, sortOrder: featureOrder, status: "ACTIVE" },
      });
    }
  }

  for (const [sortOrder, [name, audienceType, description]] of targetAudiences.entries()) {
    await prisma.targetAudience.upsert({
      where: { name },
      update: { audienceType, description, sortOrder, status: "PUBLISHED" },
      create: { name, audienceType, description, sortOrder, status: "PUBLISHED" },
    });
  }

  for (const [sortOrder, [title, description]] of differentials.entries()) {
    await prisma.competitiveDifferential.upsert({
      where: { title },
      update: { description, sortOrder, status: "PUBLISHED" },
      create: { title, description, sortOrder, status: "PUBLISHED" },
    });
  }

  const recurringModel = await prisma.revenueModel.upsert({
    where: { name: "Receita recorrente SaaS" },
    update: { description: "Modelo inicial de mensalidade por provedor parceiro.", status: "PUBLISHED" },
    create: { name: "Receita recorrente SaaS", description: "Modelo inicial de mensalidade por provedor parceiro.", status: "PUBLISHED" },
  });

  const revenueItems = [
    ["receita-saas-provedor", recurringModel.id, "Mensalidade por provedor parceiro", "Ticket medio ProviderX por provedor.", 1500, "monthly"],
    ["setup", recurringModel.id, "Setup", "Receita planejada de setup.", 0, "one_time"],
    ["implantacao", recurringModel.id, "Implantacao", "Receita planejada de implantacao.", 0, "one_time"],
    ["customizacao", recurringModel.id, "Customizacao", "Receita planejada de customizacao.", 0, "one_time"],
    ["app-white-label", recurringModel.id, "Aplicativo white-label", "Receita planejada por app white-label.", 0, "one_time"],
    ["suporte-premium", recurringModel.id, "Suporte premium", "Receita planejada de suporte premium.", 0, "monthly"],
  ] as const;

  for (const [id, modelId, name, description, amount, periodicity] of revenueItems) {
    await prisma.revenueItem.upsert({
      where: { id },
      update: { modelId, name, description, amount, periodicity, status: "PUBLISHED" },
      create: { id, modelId, name, description, amount, periodicity, status: "PUBLISHED" },
    });
  }

  const scenarios = [
    ["cenario-conservador", "Cenario conservador", 5, 1500, 0, "conservador", "Validacao inicial com poucos provedores."],
    ["cenario-inicial", "Cenario inicial", 10, 1500, 0, "base", "10 provedores x R$ 1.500 = R$ 15.000/mes."],
    ["cenario-escalado-ano-1", "Cenario escalado - primeiro ano", 150, 1500, 0, "agressivo", "150 provedores x R$ 1.500 = R$ 225.000/mes."],
  ] as const;

  for (const [id, name, providerCount, averageTicket, estimatedCosts, scenarioType, notes] of scenarios) {
    const monthlyRevenue = providerCount * averageTicket;
    await prisma.financialScenario.upsert({
      where: { id },
      update: {
        name,
        providerCount,
        averageTicket,
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        estimatedCosts,
        estimatedMargin: monthlyRevenue - estimatedCosts,
        scenarioType,
        notes,
        status: "PUBLISHED",
      },
      create: {
        id,
        name,
        providerCount,
        averageTicket,
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        estimatedCosts,
        estimatedMargin: monthlyRevenue - estimatedCosts,
        scenarioType,
        notes,
        status: "PUBLISHED",
      },
    });
  }

  for (const [id, description, estimatedValue] of costItems) {
    await prisma.costItem.upsert({
      where: { id: `cost-${id}` },
      update: { category: description, description, estimatedValue, periodicity: "monthly", status: "PUBLISHED" },
      create: { id: `cost-${id}`, category: description, description, estimatedValue, periodicity: "monthly", status: "PUBLISHED" },
    });
  }

  for (const [id, item, priority] of investmentItems) {
    await prisma.investmentItem.upsert({
      where: { id: `investment-${id}` },
      update: { item, estimatedValue: 0, priority, status: "DRAFT", notes: "A definir" },
      create: { id: `investment-${id}`, item, estimatedValue: 0, priority, status: "DRAFT", notes: "A definir" },
    });
  }

  for (const [index, [channel, description, priority]] of acquisitionChannels.entries()) {
    await prisma.acquisitionChannel.upsert({
      where: { id: `channel-${index}` },
      update: { channel, description, priority, status: "PUBLISHED" },
      create: { id: `channel-${index}`, channel, description, priority, status: "PUBLISHED" },
    });
  }

  for (const [index, [name, responsibilities, positions]] of departments.entries()) {
    const department = await prisma.department.upsert({
      where: { name },
      update: { description: responsibilities, responsibilities, sortOrder: index, status: "ACTIVE" },
      create: { name, description: responsibilities, responsibilities, sortOrder: index, status: "ACTIVE" },
    });
    for (const [positionOrder, title] of positions.entries()) {
      await prisma.position.upsert({
        where: { id: `${department.id}-${positionOrder}` },
        update: { departmentId: department.id, title, sortOrder: positionOrder, status: "ACTIVE" },
        create: { id: `${department.id}-${positionOrder}`, departmentId: department.id, title, sortOrder: positionOrder, status: "ACTIVE" },
      });
    }
  }

  const ceoNode = await prisma.orgChartNode.upsert({
    where: { id: "org-ceo" },
    update: { label: "CEO / Diretor Geral", nodeType: "root", sortOrder: 0, status: "ACTIVE" },
    create: { id: "org-ceo", label: "CEO / Diretor Geral", nodeType: "root", sortOrder: 0, status: "ACTIVE" },
  });

  for (const [index, [name, responsibilities]] of departments.entries()) {
    const department = await prisma.department.findUniqueOrThrow({ where: { name } });
    await prisma.orgChartNode.upsert({
      where: { id: `org-${index}` },
      update: {
        parentId: ceoNode.id,
        departmentId: department.id,
        label: name,
        nodeType: "department",
        description: responsibilities,
        sortOrder: index,
        status: "ACTIVE",
      },
      create: {
        id: `org-${index}`,
        parentId: ceoNode.id,
        departmentId: department.id,
        label: name,
        nodeType: "department",
        description: responsibilities,
        sortOrder: index,
        status: "ACTIVE",
      },
    });
  }

  for (const [id, title, description, status] of technologyItems) {
    await prisma.setting.upsert({
      where: { key: `technology.${id}` },
      update: { value: { title, description, status }, type: "json", description: "Item tecnologico planejado." },
      create: { key: `technology.${id}`, value: { title, description, status }, type: "json", description: "Item tecnologico planejado." },
    });
  }

  for (const [index, [title, decision, reason]] of decisions.entries()) {
    await prisma.strategicDecision.upsert({
      where: { id: `decision-${index}` },
      update: { title, decision, reason, relatedArea: "Estrategia", status: "PUBLISHED" },
      create: {
        id: `decision-${index}`,
        title,
        decision,
        reason,
        relatedArea: "Estrategia",
        responsible: "Diretoria",
        tags: ["seed", "planejamento"],
        status: "PUBLISHED",
      },
    });
  }

  await prisma.strategicMaterial.upsert({
    where: { id: "material-plano-negocios" },
    update: {
      title: "Plano de Negocios ProviderX",
      materialType: "DOCUMENT",
      description: "Documento base do Planning Hub.",
      version: "1.0",
      status: "OFFICIAL",
      isOfficial: true,
      createdById: admin.id,
    },
    create: {
      id: "material-plano-negocios",
      title: "Plano de Negocios ProviderX",
      materialType: "DOCUMENT",
      description: "Documento base do Planning Hub.",
      version: "1.0",
      status: "OFFICIAL",
      tags: ["plano", "providerx", "oficial"],
      isOfficial: true,
      createdById: admin.id,
    },
  });

  await prisma.setting.upsert({
    where: { key: "app.scope" },
    update: {
      value: {
        name: "ProviderX Planning Hub",
        slogan: "Escale servicos. Multiplique receitas.",
        excludedModules: ["proposals", "contracts", "crm", "knowledge", "quizzes", "certificates", "commissions"],
      },
      type: "json",
      description: "Escopo atual do MVP.",
    },
    create: {
      key: "app.scope",
      value: {
        name: "ProviderX Planning Hub",
        slogan: "Escale servicos. Multiplique receitas.",
        excludedModules: ["proposals", "contracts", "crm", "knowledge", "quizzes", "certificates", "commissions"],
      },
      type: "json",
      description: "Escopo atual do MVP.",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "seed.planning_hub",
      entity: "system",
      metadata: { sections: businessPlanSections.length, verticals: verticals.length, products: products.length },
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
