import chat from './migrated-pages/kernel-chat.json';
import audit from './migrated-pages/kernel-audit.json';
import approvals from './migrated-pages/kernel-approvals.json';
import stats from './migrated-pages/kernel-stats.json';
import connectors from './migrated-pages/kernel-connectors.json';
import scenarios from './migrated-pages/kernel-scenarios.json';
import policies from './migrated-pages/kernel-policies.json';
import evidence from './migrated-pages/kernel-evidence.json';
import compliance from './migrated-pages/kernel-compliance.json';
import reports from './migrated-pages/kernel-reports.json';
import offline from './migrated-pages/kernel-offline.json';
import type { MigratedPage } from './migratedSolutionPages';

export const migratedKernelPages: Record<string, MigratedPage> = {
  chat,
  audit,
  approvals,
  stats,
  connectors,
  scenarios,
  policies,
  evidence,
  compliance,
  reports,
};

export const migratedKernelOffline: MigratedPage = offline;
