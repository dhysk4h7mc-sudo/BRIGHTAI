'use strict';

const REQUIRED_SECRETS = ['JWT_SECRET', 'SESSION_SECRET'];
const MIN_SECRET_LENGTH = 32;
const DEVELOPMENT_VALUE_PATTERN =
  /(?:change[-_ ]?me|development|dev[-_ ]?secret|example|placeholder|your[-_ ]?secret|secret123|password|brightai[-_ ]?secret)/i;

function assessRequiredSecrets(environment = process.env) {
  return REQUIRED_SECRETS.flatMap(name => {
    const value = String(environment[name] || '').trim();

    if (!value) return [{ name, reason: 'missing' }];
    if (DEVELOPMENT_VALUE_PATTERN.test(value)) return [{ name, reason: 'development value' }];
    if (value.length < MIN_SECRET_LENGTH) return [{ name, reason: `shorter than ${MIN_SECRET_LENGTH} characters` }];

    return [];
  });
}

function enforceProductionSecrets(environment = process.env, logger = console) {
  const findings = assessRequiredSecrets(environment);
  const secretsAreReused =
    environment.JWT_SECRET &&
    environment.JWT_SECRET === environment.SESSION_SECRET;

  if (environment.NODE_ENV === 'production') {
    findings.forEach(({ name, reason }) => {
      logger.warn(`[Security] Production secret rejected: ${name} is ${reason}.`);
    });

    if (secretsAreReused) {
      logger.warn('[Security] Production secrets rejected: JWT_SECRET and SESSION_SECRET use the same value.');
      throw new Error('Refusing to start in production: JWT_SECRET and SESSION_SECRET must use different values.');
    }

    if (findings.length > 0) {
      const details = findings.map(({ name, reason }) => `${name} (${reason})`).join(', ');
      throw new Error(`Refusing to start in production: weak or missing secrets: ${details}.`);
    }

    return true;
  }

  findings.forEach(({ name, reason }) => {
    logger.warn(`[Security] ${name} is ${reason}. Use a random value of at least ${MIN_SECRET_LENGTH} characters before production.`);
  });

  if (secretsAreReused) {
    logger.warn('[Security] JWT_SECRET and SESSION_SECRET should use different values before production.');
  }

  return findings.length === 0 && !secretsAreReused;
}

module.exports = {
  REQUIRED_SECRETS,
  MIN_SECRET_LENGTH,
  assessRequiredSecrets,
  enforceProductionSecrets
};
