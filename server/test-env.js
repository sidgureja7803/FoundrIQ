/**
 * Quick test script to verify PERPLEXITY_API_KEY is loaded
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('\n🔍 Environment Variable Check:');
console.log('================================');
console.log('PERPLEXITY_API_KEY exists:', !!process.env.PERPLEXITY_API_KEY);
console.log('PERPLEXITY_API_KEY length:', process.env.PERPLEXITY_API_KEY?.length || 0);
console.log('First 10 chars:', process.env.PERPLEXITY_API_KEY?.substring(0, 10) || 'NOT SET');
console.log('================================\n');
