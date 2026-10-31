import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readApiEnvironment } from '../src/config/environment.js';

test('API rejects missing environment configuration', () => {
  assert.throws(() => readApiEnvironment({}), /APP_ENV/);
});

test('invalid configuration exits before listening and does not log secrets', () => {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL('../src/main.js', import.meta.url))],
    {
      env: {
        ...process.env,
        APP_ENV: 'production',
        API_PORT: '3001',
        WEB_PORT: '3000',
        DATABASE_URL:
          'postgresql://fixture:do-not-print@127.0.0.1:55432/fixture',
      },
      encoding: 'utf8',
      timeout: 10000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid local configuration: APP_ENV/);
  assert.doesNotMatch(
    result.stdout + result.stderr,
    /do-not-print|listening|successfully started/i,
  );
});
