import aiFirewall from './migrated-pages/solution-ai-firewall.json';
import aiAuditTrail from './migrated-pages/solution-ai-audit-trail.json';
import aiEvidenceFile from './migrated-pages/solution-ai-evidence-file.json';
import humanApprovalLayer from './migrated-pages/solution-human-approval-layer.json';
import continuousAiGovernance from './migrated-pages/solution-continuous-ai-governance.json';
import aiRiskClassification from './migrated-pages/solution-ai-risk-classification.json';
import aiUseCaseDiscovery from './migrated-pages/solution-ai-use-case-discovery.json';
import policyToControlMapping from './migrated-pages/solution-policy-to-control-mapping.json';
import banking from './migrated-pages/sector-banking-ai-governance.json';
import government from './migrated-pages/sector-government-ai-governance.json';
import healthcare from './migrated-pages/sector-healthcare-ai-governance.json';
import manufacturing from './migrated-pages/sector-manufacturing-ai-governance.json';
import bankingRiyadh from './migrated-pages/local-banking-ai-governance-riyadh.json';
import governmentDammam from './migrated-pages/local-government-ai-governance-dammam.json';
import healthcareJeddah from './migrated-pages/local-healthcare-ai-governance-jeddah.json';

export interface MigratedPage {
  source: string;
  title: string;
  description: string;
  canonical: string;
  hreflang: { lang: string; href: string }[];
  jsonLd: Record<string, unknown>[];
  html: string;
}

export const migratedSolutionPages: Record<string, MigratedPage> = {
  'ai-firewall': aiFirewall,
  'ai-audit-trail': aiAuditTrail,
  'ai-evidence-file': aiEvidenceFile,
  'human-approval-layer': humanApprovalLayer,
  'continuous-ai-governance': continuousAiGovernance,
  'ai-risk-classification': aiRiskClassification,
  'ai-use-case-discovery': aiUseCaseDiscovery,
  'policy-to-control-mapping': policyToControlMapping,
};

export const migratedSectorPages: Record<string, MigratedPage> = {
  'banking-ai-governance': banking,
  'government-ai-governance': government,
  'healthcare-ai-governance': healthcare,
  'manufacturing-ai-governance': manufacturing,
};

export const migratedLocalPages: Record<string, MigratedPage> = {
  'banking-ai-governance/riyadh': bankingRiyadh,
  'government-ai-governance/dammam': governmentDammam,
  'healthcare-ai-governance/jeddah': healthcareJeddah,
};
