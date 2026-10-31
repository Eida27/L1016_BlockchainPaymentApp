import { z } from 'zod';

export interface LocalEnvironment {
  appEnv: 'local';
  webPort: number;
  apiPort: number;
  databaseUrl: string;
}

const port = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(z.number().int().max(65535));
const localDatabase = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return (
      ['postgres:', 'postgresql:'].includes(url.protocol) &&
      ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) &&
      Boolean(url.username && url.password && url.pathname.length > 1) &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
});
const schema = z
  .object({
    APP_ENV: z.literal('local'),
    WEB_PORT: port,
    API_PORT: port,
    DATABASE_URL: localDatabase,
  })
  .refine((value) => value.WEB_PORT !== value.API_PORT, { path: ['API_PORT'] });

export function parseEnvironment(
  input: Record<string, string | undefined>,
): LocalEnvironment {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];
    throw new Error(`Invalid local configuration: ${fields.join(', ')}`);
  }
  return {
    appEnv: result.data.APP_ENV,
    webPort: result.data.WEB_PORT,
    apiPort: result.data.API_PORT,
    databaseUrl: result.data.DATABASE_URL,
  };
}
