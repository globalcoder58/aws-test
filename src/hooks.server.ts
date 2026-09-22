
import { config } from 'dotenv';
import { resolve } from 'path';

// Try to load .env from multiple possible locations
config({ path: resolve('.env') });
config({ path: resolve('..', '.env') });

console.log('HOOKS ENV CHECK:', {
  hasAccessKey: !!process.env.MY_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.MY_SECRET_ACCESS_KEY,
  kbId: process.env.BEDROCK_KB_ID ?? 'MISSING'
});

export const handle = async ({ event, resolve }) => {
  return resolve(event);
};

