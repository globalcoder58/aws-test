
import { writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// These will be available at build time from Amplify env vars
const envVars = {
  MY_ACCESS_KEY_ID: process.env.MY_ACCESS_KEY_ID || '',
  MY_SECRET_ACCESS_KEY: process.env.MY_SECRET_ACCESS_KEY || '',
  BEDROCK_KB_ID: process.env.BEDROCK_KB_ID || ''
};

console.log('=== inject-env.js ===');
console.log('Has ACCESS_KEY:', !!envVars.MY_ACCESS_KEY_ID);
console.log('Has SECRET_KEY:', !!envVars.MY_SECRET_ACCESS_KEY);
console.log('Has KB_ID:', !!envVars.BEDROCK_KB_ID);

// Write .env to multiple locations to ensure runtime can find it
const locations = [
  '.env',
  'build/.env',
  'build/compute/.env',
  'build/compute/default/.env'
];

const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

for (const loc of locations) {
  try {
    writeFileSync(loc, envContent);
    console.log(`Written .env to: ${loc}`);
  } catch (e) {
    console.log(`Could not write to: ${loc} (${e instanceof Error ? e.message : String(e)})`);
  }
}

// Also list what's in build/compute/default for debugging
const computeDir = 'build/compute/default';
if (existsSync(computeDir)) {
  console.log('\n=== build/compute/default contents ===');
  readdirSync(computeDir).forEach(f => console.log(f));
}

