import type { NextConfig } from 'next';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseEnvironment } from '@gametrust/shared';

const envFile = fileURLToPath(new URL('../../.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
parseEnvironment(process.env);

const config: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1'],
};
export default config;
