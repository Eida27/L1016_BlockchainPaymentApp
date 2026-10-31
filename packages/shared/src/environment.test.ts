import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { parseEnvironment } from './environment.js';

const valid = {
  APP_ENV: 'local',
  WEB_PORT: '3000',
  API_PORT: '3001',
  DATABASE_URL: 'postgresql://fixture:fixture@127.0.0.1:55432/fixture',
};

describe('local environment validation', () => {
  it('returns typed local configuration even for a production optimization build', () => {
    expect(parseEnvironment({ ...valid, NODE_ENV: 'production' })).toEqual({
      appEnv: 'local',
      webPort: 3000,
      apiPort: 3001,
      databaseUrl: 'postgresql://fixture:fixture@127.0.0.1:55432/fixture',
    });
  });
  for (const key of ['APP_ENV', 'WEB_PORT', 'API_PORT', 'DATABASE_URL']) {
    it(`rejects missing ${key} without silently defaulting`, () => {
      expect(() => parseEnvironment({ ...valid, [key]: undefined })).toThrow(
        key,
      );
    });
  }
  for (const port of ['0', '-1', '65536', '1.5', 'abc', ' 3000 ', '']) {
    it(`rejects invalid port ${JSON.stringify(port)}`, () => {
      expect(() => parseEnvironment({ ...valid, API_PORT: port })).toThrow(
        'API_PORT',
      );
    });
  }
  it('rejects colliding application ports', () => {
    expect(() => parseEnvironment({ ...valid, API_PORT: '3000' })).toThrow(
      'API_PORT',
    );
  });
  for (const mode of ['testnet', 'production', 'LOCAL']) {
    it(`blocks unapproved application mode ${mode}`, () => {
      expect(() => parseEnvironment({ ...valid, APP_ENV: mode })).toThrow(
        'APP_ENV',
      );
    });
  }
  for (const url of [
    'not-a-url',
    'https://fixture:fixture@localhost/db',
    'postgresql://fixture:fixture@remote.example/db',
    'postgresql://localhost/db',
  ]) {
    it('rejects invalid or non-local database configuration without exposing credentials', () => {
      try {
        parseEnvironment({ ...valid, DATABASE_URL: url });
        expect.fail('Configuration should fail');
      } catch (error) {
        expect(String(error)).toContain('DATABASE_URL');
        expect(String(error)).not.toContain(url);
      }
    });
  }
});

it('supports the CommonJS loader used by Next configuration', () => {
  const require = createRequire(import.meta.url);
  const shared = require('@gametrust/shared') as {
    parseEnvironment: typeof parseEnvironment;
  };
  expect(shared.parseEnvironment(valid).apiPort).toBe(3001);
});
