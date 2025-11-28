#!/usr/bin/env node
/**
 * Quick script to check if TAVILY_API_KEY is properly loaded
 * Run: node check-tavily.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('\n=== Environment Variable Check ===\n');

// Check TAVILY_API_KEY
if (process.env.TAVILY_API_KEY) {
  const key = process.env.TAVILY_API_KEY;
  console.log('✅ TAVILY_API_KEY is set');
  console.log(`   Length: ${key.length} characters`);
  console.log(`   Starts with: ${key.substring(0, 8)}...`);
  console.log(`   Ends with: ...${key.substring(key.length - 4)}`);
} else {
  console.log('❌ TAVILY_API_KEY is NOT set');
  console.log('\nPlease check your .env file:');
  console.log('1. Make sure the file exists at:', envPath);
  console.log('2. Add this line to your .env file:');
  console.log('   TAVILY_API_KEY=your_actual_api_key_here');
  console.log('3. Make sure there are NO SPACES around the = sign');
  console.log('4. Make sure there are NO quotes around the key');
  console.log('\nExample:');
  console.log('TAVILY_API_KEY=tvly-1234567890abcdef');
}

console.log('\n=================================\n');

