
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Try multiple possible locations for .env
const possiblePaths = [
  resolve('.env'),
  resolve('..', '.env'),
  resolve('../..', '.env'),
  '/var/task/.env',
  '/var/task/compute/default/.env'
];

// Also try relative to this file
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  possiblePaths.push(resolve(__dirname, '.env'));
  possiblePaths.push(resolve(__dirname, '..', '.env'));
  possiblePaths.push(resolve(__dirname, '../..', '.env'));
} catch (e) {
  // ignore
}

for (const envPath of possiblePaths) {
  if (existsSync(envPath)) {
    console.log(`Loading .env from: ${envPath}`);
    config({ path: envPath });
    break;
  } else {
    console.log(`No .env at: ${envPath}`);
  }
}

console.log('HOOKS ENV CHECK:', {
  hasAccessKey: !!process.env.MY_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.MY_SECRET_ACCESS_KEY,
  kbId: process.env.BEDROCK_KB_ID ?? 'MISSING',
  cwd: process.cwd()
});

export const handle = async ({ event, resolve }) => {
  return resolve(event);
};

