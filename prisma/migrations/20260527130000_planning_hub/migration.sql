-- ProviderX Planning Hub
-- Adds strategic planning entities without dropping legacy tables.

CREATE TYPE "PlanningStatus" AS ENUM ('IDEA', 'ANALYSIS', 'STRUCTURING', 'READY', 'VALIDATION', 'ACTIVE', 'PAUSED');
CREATE TYPE "StrategicMaterialType" AS ENUM ('PRESENTATION', 'PDF', 'IMAGE', 'VIDEO', 'SPREADSHEET', 'DOCUMENT', 'EXTERNAL_LINK', 'DESIGN_REFERENCE', 'INSTITUTIONAL');
CREATE TYPE "StrategicMaterialStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'OFFICIAL', 'OBSOLETE');
CREATE TYPE "PlanningPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE "business_plan_sections" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_plan_sections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "business_plan_sections_key_key" ON "business_plan_sections"("key");

CREATE TABLE "business_plan_versions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "business_plan_versions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "business_plan_versions_sectionId_version_key" ON "business_plan_versions"("sectionId", "version");
ALTER TABLE "business_plan_versions" ADD CONSTRAINT "business_plan_versions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "business_plan_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "verticals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2ce9ff',
    "icon" TEXT,
    "status" "PlanningStatus" NOT NULL DEFAULT 'ACTIVE',
    "targetAudience" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "verticals_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "verticals_name_key" ON "verticals"("name");
CREATE UNIQUE INDEX "verticals_slug_key" ON "verticals"("slug");

CREATE TABLE "planning_products" (
    "id" TEXT NOT NULL,
    "verticalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetAudience" TEXT,
    "painSolved" TEXT,
    "mainBenefit" TEXT,
    "whiteLabelModel" TEXT,
    "status" "PlanningStatus" NOT NULL DEFAULT 'IDEA',
    "responsible" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "planning_products_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "planning_products_slug_key" ON "planning_products"("slug");
CREATE INDEX "planning_products_verticalId_idx" ON "planning_products"("verticalId");
ALTER TABLE "planning_products" ADD CONSTRAINT "planning_products_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "verticals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "product_features" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "PlanningStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_features_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "product_features_productId_idx" ON "product_features"("productId");

CREATE TABLE "target_audiences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audienceType" TEXT NOT NULL DEFAULT 'PRIMARY',
    "description" TEXT,
    "notes" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "target_audiences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "target_audiences_name_key" ON "target_audiences"("name");

CREATE TABLE "competitive_differentials" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "competitive_differentials_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "competitive_differentials_title_key" ON "competitive_differentials"("title");

CREATE TABLE "revenue_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "revenue_models_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "revenue_models_name_key" ON "revenue_models"("name");

CREATE TABLE "revenue_items" (
    "id" TEXT NOT NULL,
    "modelId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "periodicity" TEXT NOT NULL DEFAULT 'monthly',
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "revenue_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "revenue_items" ADD CONSTRAINT "revenue_items_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "revenue_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "financial_scenarios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "providerCount" INTEGER NOT NULL,
    "averageTicket" DECIMAL(12,2) NOT NULL,
    "monthlyRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "annualRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimatedCosts" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimatedMargin" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "scenarioType" TEXT NOT NULL DEFAULT 'base',
    "notes" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "financial_scenarios_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "financial_scenarios_name_key" ON "financial_scenarios"("name");

CREATE TABLE "cost_items" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "periodicity" TEXT NOT NULL DEFAULT 'monthly',
    "notes" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cost_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "investment_items" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "estimatedValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "priority" "PlanningPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "investment_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "acquisition_channels" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "description" TEXT,
    "priority" "PlanningPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "responsible" TEXT,
    "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "acquisition_channels_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "responsibilities" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "positions" ADD CONSTRAINT "positions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "org_chart_nodes" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "departmentId" TEXT,
    "label" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL DEFAULT 'department',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "org_chart_nodes_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "org_chart_nodes" ADD CONSTRAINT "org_chart_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "org_chart_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "materialType" "StrategicMaterialType" NOT NULL,
    "verticalId" TEXT,
    "productId" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "externalUrl" TEXT,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "StrategicMaterialStatus" NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "materials_status_idx" ON "materials"("status");
ALTER TABLE "materials" ADD CONSTRAINT "materials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "planning_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "strategic_decisions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "relatedArea" TEXT,
    "verticalId" TEXT,
    "productId" TEXT,
    "context" TEXT,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "expectedImpact" TEXT,
    "responsible" TEXT,
    "decisionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "strategic_decisions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "strategic_decisions_decisionDate_idx" ON "strategic_decisions"("decisionDate");
ALTER TABLE "strategic_decisions" ADD CONSTRAINT "strategic_decisions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "planning_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
