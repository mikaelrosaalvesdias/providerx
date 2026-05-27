-- Expand enums used by existing tables
ALTER TYPE "ProposalStatus" ADD VALUE IF NOT EXISTS 'REVIEW';
ALTER TYPE "ContractStatus" ADD VALUE IF NOT EXISTS 'IMPLEMENTATION';
ALTER TYPE "ContractStatus" ADD VALUE IF NOT EXISTS 'SUSPENDED';
ALTER TYPE "ContractStatus" ADD VALUE IF NOT EXISTS 'RENEWAL_PENDING';
ALTER TYPE "KnowledgeContentType" ADD VALUE IF NOT EXISTS 'CHECKLIST';

-- New enums
CREATE TYPE "ProposalPageType" AS ENUM ('COVER', 'INSTITUTIONAL', 'PRODUCT', 'PRICING', 'COMMERCIAL_TERMS', 'FREE_TEXT', 'A4_IMAGE', 'ACCEPTANCE');
CREATE TYPE "CommissionBaseType" AS ENUM ('SETUP', 'MONTHLY', 'GROSS_REVENUE', 'NET_REVENUE', 'MARGIN', 'CUSTOM');
CREATE TYPE "CertificateStatus" AS ENUM ('ISSUED', 'REVOKED', 'EXPIRED');

-- Product expansion
ALTER TABLE "products" ADD COLUMN "category" TEXT;
ALTER TABLE "products" ADD COLUMN "approachScripts" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "whatsappScripts" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "callScripts" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "implementationChecklist" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "closingChecklist" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "product_modules" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleType" TEXT NOT NULL DEFAULT 'feature',
    "setupPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlyPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_modules_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "product_modules_productId_name_key" ON "product_modules"("productId", "name");
ALTER TABLE "product_modules" ADD CONSTRAINT "product_modules_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Modular commission engine
CREATE TABLE "commission_bases" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "baseType" "CommissionBaseType" NOT NULL,
    "description" TEXT,
    "formula" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "commission_bases_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "commission_bases_key_key" ON "commission_bases"("key");

ALTER TABLE "commission_rules" ADD COLUMN "planId" TEXT;
ALTER TABLE "commission_rules" ADD COLUMN "baseId" TEXT;
ALTER TABLE "commission_rules" ADD COLUMN "appliesTo" TEXT NOT NULL DEFAULT 'seller';
ALTER TABLE "commission_rules" ADD COLUMN "providerName" TEXT;
ALTER TABLE "commission_rules" ADD COLUMN "commissionBase" "CommissionBaseType" NOT NULL DEFAULT 'NET_REVENUE';
ALTER TABLE "commission_rules" ADD COLUMN "triggerEvent" TEXT NOT NULL DEFAULT 'contract_active';
ALTER TABLE "commission_rules" ADD COLUMN "minQuantity" INTEGER;
ALTER TABLE "commission_rules" ADD COLUMN "maxQuantity" INTEGER;
ALTER TABLE "commission_rules" ADD COLUMN "minMarginPercent" DECIMAL(5,2);
ALTER TABLE "commission_rules" ADD COLUMN "goalMultiplierPercent" DECIMAL(5,2);
ALTER TABLE "commission_rules" ADD COLUMN "customFormula" TEXT;
ALTER TABLE "commission_rules" ADD CONSTRAINT "commission_rules_planId_fkey" FOREIGN KEY ("planId") REFERENCES "product_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "commission_rules" ADD CONSTRAINT "commission_rules_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "commission_bases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- People and partners
ALTER TABLE "partner_companies" ADD COLUMN "phone" TEXT;
ALTER TABLE "partner_companies" ADD COLUMN "email" TEXT;
ALTER TABLE "partner_companies" ADD COLUMN "billingBase" "CommissionBaseType" NOT NULL DEFAULT 'GROSS_REVENUE';
ALTER TABLE "partner_companies" ADD COLUMN "customRules" JSONB;

ALTER TABLE "representatives" ADD COLUMN "document" TEXT;
ALTER TABLE "representatives" ADD COLUMN "phone" TEXT;
ALTER TABLE "representatives" ADD COLUMN "email" TEXT;

ALTER TABLE "sales_people" ADD COLUMN "department" TEXT;

-- Proposal builder
ALTER TABLE "proposals" ADD COLUMN "responsibleName" TEXT;
ALTER TABLE "proposals" ADD COLUMN "responsibleEmail" TEXT;
ALTER TABLE "proposals" ADD COLUMN "responsiblePhone" TEXT;
ALTER TABLE "proposals" ADD COLUMN "cnpj" TEXT;
ALTER TABLE "proposals" ADD COLUMN "commercialCondition" TEXT;
ALTER TABLE "proposals" ADD COLUMN "estimatedMargin" DECIMAL(12,2) NOT NULL DEFAULT 0;

CREATE TABLE "proposal_pages" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "pageType" "ProposalPageType" NOT NULL DEFAULT 'FREE_TEXT',
    "title" TEXT NOT NULL,
    "content" TEXT,
    "imageAssetId" TEXT,
    "productId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "proposal_pages_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "proposal_pages_proposalId_sortOrder_idx" ON "proposal_pages"("proposalId", "sortOrder");
ALTER TABLE "proposal_pages" ADD CONSTRAINT "proposal_pages_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "proposal_pages" ADD CONSTRAINT "proposal_pages_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "proposal_pages" ADD CONSTRAINT "proposal_pages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "proposal_templates" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverAssetId" TEXT,
    "pages" JSONB NOT NULL DEFAULT '[]',
    "footer" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "proposal_templates_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "proposal_templates" ADD CONSTRAINT "proposal_templates_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "proposal_templates" ADD CONSTRAINT "proposal_templates_coverAssetId_fkey" FOREIGN KEY ("coverAssetId") REFERENCES "uploaded_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Contract expansion
ALTER TABLE "contracts" ADD COLUMN "financialStatus" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "contracts" ADD COLUMN "operationalStatus" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "contracts" ADD COLUMN "notes" TEXT;

-- Playbook contents by audience/stage/customer type
CREATE TABLE "playbook_contents" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sectionId" TEXT,
    "audience" TEXT,
    "salesStage" TEXT,
    "customerType" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "playbook_contents_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "playbook_contents" ADD CONSTRAINT "playbook_contents_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "playbook_contents" ADD CONSTRAINT "playbook_contents_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "playbook_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Knowledge ordering, quiz answers and certificates
CREATE TABLE "knowledge_track_items" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "contentId" TEXT,
    "quizId" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "knowledge_track_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "knowledge_track_items" ADD CONSTRAINT "knowledge_track_items_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "knowledge_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_track_items" ADD CONSTRAINT "knowledge_track_items_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "knowledge_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_track_items" ADD CONSTRAINT "knowledge_track_items_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT,
    "productId" TEXT,
    "quizAttemptId" TEXT,
    "title" TEXT NOT NULL,
    "certificateText" TEXT NOT NULL,
    "score" INTEGER,
    "status" "CertificateStatus" NOT NULL DEFAULT 'ISSUED',
    "appearance" JSONB,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "knowledge_tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "quiz_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Assets and org chart expansion
ALTER TABLE "uploaded_assets" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "org_units" ADD COLUMN "position" TEXT;
ALTER TABLE "org_units" ADD COLUMN "company" TEXT;
ALTER TABLE "org_units" ADD COLUMN "department" TEXT;
ALTER TABLE "org_units" ADD COLUMN "email" TEXT;
ALTER TABLE "org_units" ADD COLUMN "phone" TEXT;
ALTER TABLE "org_units" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "org_units" ADD COLUMN "notes" TEXT;
