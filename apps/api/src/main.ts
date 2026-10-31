import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readApiEnvironment } from './config/environment.js';

async function bootstrap() {
  const envFile = fileURLToPath(new URL('../../../.env', import.meta.url));
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const environment = readApiEnvironment(process.env);
  const [{ NestFactory }, { AppModule }] = await Promise.all([
    import('@nestjs/core'),
    import('./app.module.js'),
  ]);
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableShutdownHooks();
  await app.listen(environment.apiPort, '127.0.0.1');
  console.log(`API listening at http://127.0.0.1:${environment.apiPort}`);
}

bootstrap().catch((error: unknown) => {
  console.error(
    error instanceof Error &&
      error.message.startsWith('Invalid local configuration:')
      ? error.message
      : 'API startup failed. Check local configuration and port availability.',
  );
  process.exitCode = 1;
});
