import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseEnvironment } from '@gametrust/shared';

const root = fileURLToPath(new URL('../', import.meta.url));
const envFile = fileURLToPath(new URL('../.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
let config;
try {
  config = parseEnvironment(process.env);
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Invalid local configuration',
  );
  process.exit(1);
}
const require = createRequire(
  new URL('../apps/web/package.json', import.meta.url),
);
const next = require.resolve('next/dist/bin/next');
const children = [];
let stopping = false;
function stop(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === 'win32') {
      spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      child.kill('SIGTERM');
    }
  }
  process.exitCode = code;
}
for (const [name, args, cwd] of [
  ['API', ['apps/api/dist/main.js'], root],
  [
    'Web',
    [next, 'dev', '--hostname', '127.0.0.1', '--port', String(config.webPort)],
    fileURLToPath(new URL('../apps/web/', import.meta.url)),
  ],
]) {
  const child = spawn(process.execPath, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    windowsHide: true,
  });
  children.push(child);
  child.once('error', () => {
    console.error(`${name} could not start.`);
    stop(1);
  });
  child.once('exit', (code) => {
    if (!stopping) stop(code === 0 ? 0 : 1);
  });
}
process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));
