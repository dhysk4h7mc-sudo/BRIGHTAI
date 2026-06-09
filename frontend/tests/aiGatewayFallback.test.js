import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const CONFIG_PATH = '../config/index.js';
const GATEWAY_PATH = '../services/aiGateway.js';

function clearGatewayModules() {
  delete require.cache[require.resolve(CONFIG_PATH)];
  delete require.cache[require.resolve(GATEWAY_PATH)];
}

function setProviderEnv() {
  process.env.NODE_ENV = 'test';
  process.env.GEMINI_API_KEY = 'test-gemini-key';
  process.env.GROQ_API_KEY = 'test-groq-key';
  process.env.NVIDIA_API_KEY = 'test-nvidia-key';
  process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';
  process.env.AI_GATEWAY_MOCK_MODE = '0';
}

beforeEach(() => {
  vi.restoreAllMocks();
  setProviderEnv();
  clearGatewayModules();
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  delete process.env.GROQ_API_KEY;
  delete process.env.NVIDIA_API_KEY;
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.AI_GATEWAY_MOCK_MODE;
  clearGatewayModules();
});

describe('AI provider configuration health', () => {
  it('warns for missing providers without failing validation', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    clearGatewayModules();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { validateConfig, getProviderHealthChecks } = require(CONFIG_PATH);

    expect(validateConfig()).toBe(true);
    expect(warnSpy.mock.calls.flat().join('\n')).toContain('GROQ_API_KEY');
    expect(warnSpy.mock.calls.flat().join('\n')).toContain('OPENAI_API_KEY');
    expect(warnSpy.mock.calls.flat().join('\n')).toContain('DEEPSEEK_API_KEY');

    const health = getProviderHealthChecks();
    expect(health.gemini.status).toBe('ready');
    expect(health.groq.status).toBe('missing_key');
    expect(health.deepseek.required).toBe(false);
  });
});

describe('AI Gateway fallback chain', () => {
  it('tries Gemini, Groq, NVIDIA, DeepSeek, then Demo Mode in order', async () => {
    const logSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 503,
      text: async () => 'provider unavailable',
      json: async () => ({ error: { message: 'provider unavailable' } })
    }));

    const gateway = require(GATEWAY_PATH);
    const result = await gateway.openAiCompatChat({
      body: {
        messages: [{ role: 'user', content: 'حلل جاهزية الأتمتة' }],
        response_format: { json_schema: { name: 'generic_demo', schema: { type: 'object' } } }
      }
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe('demo');
    expect(result.fallbackChain).toEqual(['gemini', 'groq', 'nvidia', 'deepseek', 'demo']);
    expect(logSpy.mock.calls.flat().join('\n')).toContain('Switching AI provider from gemini to groq');
    expect(logSpy.mock.calls.flat().join('\n')).toContain('Switching AI provider from deepseek to demo');
  });

  it('keeps /api/ai/chat available when Gemini is missing by using Demo Mode', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.GROQ_API_KEY;
    delete process.env.NVIDIA_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    clearGatewayModules();

    const gateway = require(GATEWAY_PATH);
    const result = await gateway.chat({
      body: {
        message: 'أحتاج أتمتة لخدمة العملاء',
        sessionId: 'fallback-chat-test'
      }
    });

    expect(result.reply).toContain('executive_summary_ar');
    expect(result.provider).toBe('demo');
    expect(result.fallback).toBe(true);
  });
});
