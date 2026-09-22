
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({
    hasAccessKey: !!process.env.MY_ACCESS_KEY_ID,
    accessKeyPrefix: process.env.MY_ACCESS_KEY_ID?.slice(0, 4) ?? 'MISSING',
    hasSecretKey: !!process.env.MY_SECRET_ACCESS_KEY,
    kbId: process.env.BEDROCK_KB_ID ?? 'MISSING',
    nodeEnv: process.env.NODE_ENV ?? 'MISSING'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

