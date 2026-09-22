
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({
    hasAccessKey: !!env.MY_ACCESS_KEY_ID,
    accessKeyPrefix: env.MY_ACCESS_KEY_ID?.slice(0, 4) ?? 'MISSING',
    hasSecretKey: !!env.MY_SECRET_ACCESS_KEY,
    kbId: env.BEDROCK_KB_ID ?? 'MISSING',
    nodeEnv: env.NODE_ENV ?? 'MISSING'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

