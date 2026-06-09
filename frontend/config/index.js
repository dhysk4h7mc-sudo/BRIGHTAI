/**
 * Server Configuration
 * Loads environment variables and provides configuration object
 * Requirements: 23.4, 23.9
 */

const fs = require('fs');
const path = require('path');

const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), '.env')
];

const selectedEnvPath = envCandidates.find(candidate => fs.existsSync(candidate));
try {
  const dotenv = require('dotenv');
  if (selectedEnvPath) {
    dotenv.config({ path: selectedEnvPath });
  } else {
    dotenv.config();
  }
} catch (_dotenvMissing) {
  // dotenv not installed — rely on process.env set by the hosting platform (Render, Netlify, etc.)
}

function readSecret(name, fallback = '') {
  const rawValue = process.env[name] || fallback;
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';
  if (
    !value ||
    value === 'YOUR_SECRET_HERE' ||
    /^your[_-].+[_-](key|url)$/i.test(value) ||
    /placeholder/i.test(value)
  ) return '';
  return value;
}

const nvidiaBaseUrl = (process.env.NVIDIA_URL || 'https://integrate.api.nvidia.com/v1').trim();
const groqBaseUrl = (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1').trim();

const config = {
  // Gemini AI Configuration
  gemini: {
    apiKey: readSecret('GEMINI_API_KEY') || readSecret('GOOGLE_API_KEY'),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    region: process.env.GEMINI_REGION || 'global',
    dataResidency: process.env.GEMINI_DATA_RESIDENCY || 'Google configured region'
  },

  // Groq AI Configuration
  groq: {
    apiKey:
      readSecret('GROQ_API_KEY') ||
      readSecret('GROQ_KEY') ||
      readSecret('GROQ_TOKEN') ||
      '',
    model: process.env.GROQ_MODEL || process.env.GROQ_DEFAULT_MODEL || 'llama-3.3-70b-versatile',
    visionModel: process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview',
    baseUrl: groqBaseUrl,
    endpoint: process.env.GROQ_ENDPOINT || `${groqBaseUrl.replace(/\/$/, '')}/chat/completions`,
    transcribeModel: process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo',
    streamTimeoutMs: parseInt(process.env.GROQ_STREAM_TIMEOUT_MS, 10) || 30000
  },

  // NVIDIA NIM Configuration
  nvidia: {
    apiKey: readSecret('NVIDIA_API_KEY'),
    model: process.env.NVIDIA_MODEL || 'minimaxai/minimax-m2.7',
    baseUrl: nvidiaBaseUrl,
    endpoint: process.env.NVIDIA_ENDPOINT || `${nvidiaBaseUrl.replace(/\/$/, '')}/chat/completions`,
    region: process.env.NVIDIA_REGION || 'global',
    dataResidency: process.env.NVIDIA_DATA_RESIDENCY || 'NVIDIA configured region'
  },

  // OpenAI Configuration
  openai: {
    apiKey: readSecret('OPENAI_API_KEY'),
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    endpoint: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    region: process.env.OPENAI_REGION || 'global',
    dataResidency: process.env.OPENAI_DATA_RESIDENCY || 'OpenAI configured region'
  },

  // Anthropic Configuration
  anthropic: {
    apiKey: readSecret('ANTHROPIC_API_KEY'),
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
    endpoint: process.env.ANTHROPIC_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    region: process.env.ANTHROPIC_REGION || 'global',
    dataResidency: process.env.ANTHROPIC_DATA_RESIDENCY || 'Anthropic configured region'
  },

  // ALLaM sovereign option for Saudi demos. This adapter is intentionally demo-only here.
  allam: {
    model: process.env.ALLAM_MODEL || 'allam-demo-sovereign-sa',
    region: process.env.ALLAM_REGION || 'Saudi Arabia',
    dataResidency: process.env.ALLAM_DATA_RESIDENCY || 'Saudi Arabia sovereign option (demo adapter)'
  },

  local: {
    model: process.env.LOCAL_MODEL || 'brightai-kernel-demo',
    region: process.env.LOCAL_REGION || 'local',
    dataResidency: process.env.LOCAL_DATA_RESIDENCY || 'Browser/server demo only; no external transfer'
  },

  // DeepSeek Configuration
  deepseek: {
    apiKey: readSecret('DEEPSEEK_API_KEY'),
    model: process.env.DEEPSEEKAI_MODEL || process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    endpoint: process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions'
  },

  // GA4 Measurement Protocol (optional)
  analytics: {
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
    ga4ApiSecret: readSecret('GA4_API_SECRET'),
    webhookKey: readSecret('ANALYTICS_WEBHOOK_KEY'),
    mpDebug: process.env.GA4_MP_DEBUG === '1'
  },
  
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    requestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE, 10) || 30,
    windowMs: 60 * 1000, // 1 minute
    storage: process.env.RATE_LIMIT_STORAGE || 'memory' // 'memory' or 'redis'
  },
  
  // Input Validation
  validation: {
    maxInputLength: 1000,
    maxBodyBytes: parseInt(process.env.MAX_BODY_BYTES, 10) || 10240,
    ocrMaxBodyBytes: parseInt(process.env.OCR_MAX_BODY_BYTES, 10) || 8 * 1024 * 1024,
    uploadMaxBodyBytes: parseInt(process.env.MAX_UPLOAD_BODY_BYTES, 10) || 40 * 1024 * 1024
  }
};

const providerDefinitions = [
  { id: 'gemini', label: 'Gemini', env: 'GEMINI_API_KEY', required: true, configured: () => isApiKeyConfigured(), model: () => config.gemini.model },
  { id: 'groq', label: 'Groq', env: 'GROQ_API_KEY', required: false, configured: () => isGroqConfigured(), model: () => config.groq.model },
  { id: 'nvidia', label: 'NVIDIA', env: 'NVIDIA_API_KEY', required: false, configured: () => isNvidiaConfigured(), model: () => config.nvidia.model },
  { id: 'deepseek', label: 'DeepSeek', env: 'DEEPSEEK_API_KEY', required: false, configured: () => isDeepSeekConfigured(), model: () => config.deepseek.model },
  { id: 'openai', label: 'OpenAI', env: 'OPENAI_API_KEY', required: false, configured: () => isOpenAiConfigured(), model: () => config.openai.model },
  { id: 'anthropic', label: 'Anthropic', env: 'ANTHROPIC_API_KEY', required: false, configured: () => isAnthropicConfigured(), model: () => config.anthropic.model }
];

function getProviderHealthChecks() {
  return Object.fromEntries(providerDefinitions.map(provider => {
    const configured = provider.configured();
    return [provider.id, {
      provider: provider.id,
      label: provider.label,
      env: provider.env,
      configured,
      required: provider.required,
      status: configured ? 'ready' : 'missing_key',
      model: provider.model(),
      message: configured
        ? `${provider.env} configured`
        : `${provider.env} is missing; ${provider.required ? 'primary provider unavailable' : 'secondary provider will be skipped'}`
    }];
  }));
}

/**
 * Validate that required configuration is present
 * @returns {boolean} - True if configuration is valid
 */
function validateConfig() {
  const errors = [];
  const mockMode = process.env.AI_GATEWAY_MOCK_MODE === '1';

  if (mockMode && config.server.nodeEnv === 'production') {
    errors.push('AI_GATEWAY_MOCK_MODE must not be enabled in production');
  }

  const providerHealth = getProviderHealthChecks();
  Object.values(providerHealth)
    .filter(provider => !provider.configured)
    .forEach(provider => {
      console.warn(`Warning: ${provider.env} not set. ${provider.required ? 'Primary provider unavailable.' : 'Secondary provider will be skipped if needed.'}`);
    });

  if (!mockMode && !Object.values(providerHealth).some(provider => provider.configured)) {
    console.warn('Warning: No production AI provider key is configured. Demo/local fallback will be used where supported.');
  }

  if (config.server.nodeEnv === 'production' && !config.gemini.apiKey) {
    console.warn('Warning: GEMINI_API_KEY not set in production. Primary AI provider will be unavailable.');
  }

  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }

  return true;
}

function runStartupProviderHealthCheck(logger = console) {
  const checks = getProviderHealthChecks();
  Object.values(checks).forEach(provider => {
    const log = provider.configured ? logger.info || logger.log : logger.warn || logger.log;
    log.call(
      logger,
      `[AI Provider Health] ${provider.label}: ${provider.status} (${provider.env}${provider.model ? `, model=${provider.model}` : ''})`
    );
  });
  return checks;
}

/**
 * Check if API key is configured
 * @returns {boolean}
 */
function isApiKeyConfigured() {
  return !!config.gemini.apiKey;
}

/**
 * Check if Groq API key is configured
 * @returns {boolean}
 */
function isGroqConfigured() {
  return !!config.groq.apiKey;
}

function isNvidiaConfigured() {
  return !!config.nvidia.apiKey;
}

function isDeepSeekConfigured() {
  return !!config.deepseek.apiKey;
}

function isOpenAiConfigured() {
  return !!config.openai.apiKey;
}

function isAnthropicConfigured() {
  return !!config.anthropic.apiKey;
}

/**
 * Check if GA4 Measurement Protocol is configured
 * @returns {boolean}
 */
function isGa4MpConfigured() {
  return !!config.analytics.ga4MeasurementId && !!config.analytics.ga4ApiSecret;
}

module.exports = {
  config,
  validateConfig,
  getProviderHealthChecks,
  runStartupProviderHealthCheck,
  isApiKeyConfigured,
  isGeminiConfigured: isApiKeyConfigured,
  isGroqConfigured,
  isNvidiaConfigured,
  isDeepSeekConfigured,
  isOpenAiConfigured,
  isAnthropicConfigured,
  isGa4MpConfigured
};
