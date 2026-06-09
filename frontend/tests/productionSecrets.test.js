import { describe, expect, it, vi } from 'vitest';
import productionSecrets from '../middleware/productionSecrets.js';

const {
  assessRequiredSecrets,
  enforceProductionSecrets
} = productionSecrets;

const strongEnvironment = {
  NODE_ENV: 'production',
  JWT_SECRET: '7a5bc4a2f6ec9db89162731b0c1de74df431984f72ad25dc7cab63dd10775ec9',
  SESSION_SECRET: '95dc39eb4d474d7d2375a8f3a369af2b1b2aa972d5771ccf3804b52d9878c1a6'
};

describe('production secret policy', () => {
  it('identifies missing, short, and development secrets', () => {
    const findings = assessRequiredSecrets({
      JWT_SECRET: 'dev-secret',
      SESSION_SECRET: ''
    });

    expect(findings).toEqual([
      expect.objectContaining({ name: 'JWT_SECRET', reason: 'development value' }),
      expect.objectContaining({ name: 'SESSION_SECRET', reason: 'missing' })
    ]);
  });

  it('throws before startup when production secrets are weak', () => {
    const logger = { warn: vi.fn() };

    expect(() => enforceProductionSecrets({
      NODE_ENV: 'production',
      JWT_SECRET: 'change-me',
      SESSION_SECRET: 'also-too-short'
    }, logger)).toThrow(/Refusing to start in production/);

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('JWT_SECRET'));
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('SESSION_SECRET'));
  });

  it('allows production startup with strong distinct secrets', () => {
    expect(enforceProductionSecrets(strongEnvironment)).toBe(true);
  });

  it('warns in development instead of blocking startup', () => {
    const logger = { warn: vi.fn() };

    expect(enforceProductionSecrets({
      NODE_ENV: 'development',
      JWT_SECRET: 'dev-secret',
      SESSION_SECRET: 'dev-session-secret'
    }, logger)).toBe(false);

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('JWT_SECRET'));
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('SESSION_SECRET'));
  });

  it('rejects reusing the same secret for JWT and sessions', () => {
    const reusedSecret = strongEnvironment.JWT_SECRET;

    expect(() => enforceProductionSecrets({
      NODE_ENV: 'production',
      JWT_SECRET: reusedSecret,
      SESSION_SECRET: reusedSecret
    })).toThrow(/must use different values/);
  });
});
