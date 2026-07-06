/**
 * src/pages/api/ai/chat.ts — REPORTS-SEC-01 (2026-07-06)
 *
 * Server-side proxy for AI chat. Reads provider keys from
 * `import.meta.env.GROQ_API_KEY` and `import.meta.env.GEMINI_API_KEY`
 * so the keys NEVER ship to the client bundle.
 *
 * Behavior:
 *  - POST { message: string, systemPrompt?: string, provider?: 'groq'|'gemini'|'auto' }
 *  - Returns { reply: string, provider: 'groq'|'gemini' } on success.
 *  - In-memory rate limit: 10 requests / minute / IP.
 *  - Validates: message is a non-empty string ≤ 4000 chars.
 *  - Auto mode: tries Groq first (fast), falls back to Gemini on failure.
 *  - Both providers fail → 502 with sanitized error.
 *
 * Why this exists:
 *  The BrightAI site (output: 'static' Astro) ships 147 prerendered
 *  pages. Any client-side AI integration would expose the key in the
 *  browser. By adding `@astrojs/vercel` and `export const prerender = false`
 *  on this file, ONLY this route is server-rendered; all other pages
 *  remain pure static HTML.
 *
 * Security:
 *  - Keys read via `import.meta.env.X` (server-only, no PUBLIC_ prefix).
 *  - The client fetch (/api/ai/chat) goes through `fetch()` from the
 *    browser; keys are never returned in any response shape.
 *  - CSP in render.yaml will need an update to allow `connect-src`
 *    for `https://api.groq.com` and `https://generativelanguage.googleapis.com`
 *    if Vercel proxies (otherwise these domains are server-side only).
 *  - No request body is logged.
 *  - No message content is persisted server-side.
 */

import type { APIRoute } from 'astro';

export const prerender = false;

// ─────────────────────────────────────────────────────────────────────────
// Config — overridden via env vars in production
// ─────────────────────────────────────────────────────────────────────────
const MAX_MESSAGE_CHARS = 4000;
const MAX_SYSTEM_PROMPT_CHARS = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const PROVIDER_TIMEOUT_MS = 25_000;

// ─────────────────────────────────────────────────────────────────────────
// In-memory rate limit bucket (per IP)
// Single-instance only; for multi-instance deploys swap to KV/Redis.
// ─────────────────────────────────────────────────────────────────────────
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (!existing || now > existing.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  existing.count += 1;
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { ok: true };
}

// Periodic cleanup so the Map doesn't grow unbounded.
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;
function ensureCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, b] of buckets) {
      if (now > b.resetAt) buckets.delete(ip);
    }
  }, CLEANUP_INTERVAL_MS);
  // Don't keep the process alive solely for cleanup.
  if (typeof cleanupTimer === 'object' && cleanupTimer && 'unref' in cleanupTimer) {
    (cleanupTimer as { unref: () => void }).unref?.();
  }
}

// ─────────────────────────────────────────────────────────────────────────
// JSON helpers
// ─────────────────────────────────────────────────────────────────────────
function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function jsonError(
  status: number,
  error: string,
  extra: Record<string, unknown> = {},
): Response {
  const headers: Record<string, string> = {};
  if (status === 429 && typeof extra.retryAfterSec === 'number') {
    headers['Retry-After'] = String(extra.retryAfterSec);
  }
  return jsonResponse({ error, ...extra }, status, headers);
}

// ─────────────────────────────────────────────────────────────────────────
// Provider: Groq (OpenAI-compatible)
// ─────────────────────────────────────────────────────────────────────────
async function callGroq(
  message: string,
  systemPrompt: string | undefined,
  signal: AbortSignal,
): Promise<string> {
  const apiKey = import.meta.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_placeholder') {
    throw new Error('GROQ_API_KEY not configured');
  }
  const model = (import.meta.env.GROQ_MODEL as string) || 'llama-3.3-70b-versatile';
  const endpoint =
    (import.meta.env.GROQ_ENDPOINT as string) ||
    'https://api.groq.com/openai/v1/chat/completions';

  const res = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.4,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`groq_${res.status}:${t.slice(0, 120)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text) {
    throw new Error('groq_empty_response');
  }
  return text;
}

// ─────────────────────────────────────────────────────────────────────────
// Provider: Gemini (generativelanguage.googleapis.com)
// ─────────────────────────────────────────────────────────────────────────
async function callGemini(
  message: string,
  systemPrompt: string | undefined,
  signal: AbortSignal,
): Promise<string> {
  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_placeholder') {
    throw new Error('GEMINI_API_KEY not configured');
  }
  const model = (import.meta.env.GEMINI_MODEL as string) || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      ...(systemPrompt
        ? { systemInstruction: { parts: [{ text: systemPrompt }] } }
        : {}),
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.4,
      },
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`gemini_${res.status}:${t.slice(0, 120)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string' || !text) {
    throw new Error('gemini_empty_response');
  }
  return text;
}

// ─────────────────────────────────────────────────────────────────────────
// POST handler — the only exported route used by the client.
// ─────────────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  ensureCleanup();

  // 1. Rate limit
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return jsonError(429, 'rate_limited', { retryAfterSec: rl.retryAfterSec });
  }

  // 2. Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'invalid_json');
  }
  if (!body || typeof body !== 'object') {
    return jsonError(400, 'invalid_body');
  }
  const b = body as Record<string, unknown>;

  // 3. Validate message
  const messageRaw = b.message;
  if (typeof messageRaw !== 'string') {
    return jsonError(400, 'message_must_be_string');
  }
  const message = messageRaw.trim();
  if (!message) {
    return jsonError(400, 'message_empty');
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return jsonError(400, 'message_too_long', {
      max: MAX_MESSAGE_CHARS,
      length: message.length,
    });
  }

  // 4. Optional system prompt
  let systemPrompt: string | undefined;
  if (typeof b.systemPrompt === 'string') {
    systemPrompt = b.systemPrompt.slice(0, MAX_SYSTEM_PROMPT_CHARS);
  }

  // 5. Provider selection
  const requestedProvider =
    typeof b.provider === 'string' ? b.provider.toLowerCase() : 'auto';

  // 6. Timeout control
  const abortCtrl = new AbortController();
  const timer = setTimeout(() => abortCtrl.abort(), PROVIDER_TIMEOUT_MS);

  let reply = '';
  let usedProvider: 'groq' | 'gemini' | '' = '';
  let lastError = '';

  try {
    if (requestedProvider === 'groq') {
      reply = await callGroq(message, systemPrompt, abortCtrl.signal);
      usedProvider = 'groq';
    } else if (requestedProvider === 'gemini') {
      reply = await callGemini(message, systemPrompt, abortCtrl.signal);
      usedProvider = 'gemini';
    } else {
      // auto: try Groq first, fallback to Gemini
      try {
        reply = await callGroq(message, systemPrompt, abortCtrl.signal);
        usedProvider = 'groq';
      } catch (e) {
        lastError = (e as Error).message;
        reply = await callGemini(message, systemPrompt, abortCtrl.signal);
        usedProvider = 'gemini';
      }
    }
  } catch (e) {
    clearTimeout(timer);
    return jsonError(502, 'provider_failed', { detail: (e as Error).message });
  } finally {
    clearTimeout(timer);
  }

  if (!usedProvider || !reply) {
    return jsonError(502, 'provider_failed', { detail: lastError || 'empty' });
  }

  return jsonResponse({ reply, provider: usedProvider });
};

// ─────────────────────────────────────────────────────────────────────────
// Other HTTP methods → 405 (don't burn rate-limit budget on GET/HEAD).
// ─────────────────────────────────────────────────────────────────────────
export const GET: APIRoute = async () =>
  jsonError(405, 'method_not_allowed', { allowed: ['POST'] });

export const PUT: APIRoute = async () =>
  jsonError(405, 'method_not_allowed', { allowed: ['POST'] });

export const DELETE: APIRoute = async () =>
  jsonError(405, 'method_not_allowed', { allowed: ['POST'] });
