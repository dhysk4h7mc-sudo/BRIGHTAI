'use strict';

const { config } = require('../config');

const PROVIDER_ORDER = ['nvidia', 'gemini', 'openai', 'anthropic', 'allam', 'local'];

function hasSecret(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function providerStatus(name, overrides = {}) {
  const base = {
    name,
    configured: false,
    model: '',
    region: 'global',
    dataResidency: 'external provider region',
    supportsArabic: true,
    mode: 'production',
    adapter: name
  };
  return { ...base, ...overrides };
}

function getProviderStatuses() {
  return {
    nvidia: providerStatus('nvidia', {
      configured: hasSecret(config.nvidia.apiKey),
      model: config.nvidia.model,
      region: config.nvidia.region,
      dataResidency: config.nvidia.dataResidency,
      adapter: 'openai-compatible'
    }),
    gemini: providerStatus('gemini', {
      configured: hasSecret(config.gemini.apiKey),
      model: config.gemini.model,
      region: config.gemini.region,
      dataResidency: config.gemini.dataResidency
    }),
    openai: providerStatus('openai', {
      configured: hasSecret(config.openai.apiKey),
      model: config.openai.model,
      region: config.openai.region,
      dataResidency: config.openai.dataResidency
    }),
    anthropic: providerStatus('anthropic', {
      configured: hasSecret(config.anthropic.apiKey),
      model: config.anthropic.model,
      region: config.anthropic.region,
      dataResidency: config.anthropic.dataResidency
    }),
    allam: providerStatus('allam', {
      configured: false,
      model: config.allam.model,
      region: config.allam.region,
      dataResidency: config.allam.dataResidency,
      mode: 'demo',
      adapter: 'demo',
      note: 'ALLaM is displayed as a Saudi sovereign option; this build uses a demo adapter and does not claim a live ALLaM connection.'
    }),
    local: providerStatus('local', {
      configured: true,
      model: config.local.model,
      region: config.local.region,
      dataResidency: config.local.dataResidency,
      mode: 'demo',
      adapter: 'demo',
      note: 'Built-in demo fallback; no external model call is made.'
    })
  };
}

function normalizeProviderName(value) {
  const name = String(value || '').trim().toLowerCase();
  if (name === 'google') return 'gemini';
  if (name === 'demo') return 'local';
  if (PROVIDER_ORDER.includes(name)) return name;
  return '';
}

function getActiveProvider() {
  const providers = getProviderStatuses();
  const preferred = normalizeProviderName(process.env.KERNEL_PROVIDER || process.env.AI_PROVIDER);

  if (preferred && providers[preferred]) {
    if (providers[preferred].configured || providers[preferred].mode === 'demo') {
      return providers[preferred];
    }
  }

  for (const name of PROVIDER_ORDER) {
    const provider = providers[name];
    if (provider && provider.configured && provider.mode !== 'demo') return provider;
  }

  return providers.local;
}

function getProvidersResponse() {
  const providers = getProviderStatuses();
  const activeProvider = getActiveProvider();
  return {
    activeProvider,
    provider: activeProvider,
    providers,
    order: PROVIDER_ORDER,
    demoMode: activeProvider.mode === 'demo'
  };
}

module.exports = {
  PROVIDER_ORDER,
  getProviderStatuses,
  getActiveProvider,
  getProvidersResponse
};
