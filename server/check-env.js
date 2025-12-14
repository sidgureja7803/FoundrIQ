#!/usr/bin/env node

/**
 * Environment Variable Checker for FoundrIQ Server
 * Run this script to verify your .env configuration
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredVars = [
  'PORT',
  'APPWRITE_ENDPOINT',
  'APPWRITE_PROJECT_ID',
  'APPWRITE_API_KEY',
  'APPWRITE_DATABASE_ID',
  'APPWRITE_IDEAS_COLLECTION_ID'
];

const optionalVars = [
  'IBM_WATSONX_API_KEY',
  'TAVILY_API_KEY',
  'CORS_ORIGIN'
];

console.log('🔍 Checking FoundrIQ Server Environment Configuration...\n');

// Check if .env file exists
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('\n📋 To fix this:');
  console.log('1. Copy .env.example to .env');
  console.log('   cp .env.example .env');
  console.log('2. Fill in your configuration values');
  console.log('3. Run this script again\n');
  process.exit(1);
}

// Read .env file
let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    if (key) {
      envVars[key.trim()] = value;
    }
  }
});

// Check required variables
let missingVars = [];
let invalidVars = [];

console.log('📝 Required Variables:\n');

requiredVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    missingVars.push(varName);
  } else if (value.includes('your_') && varName !== 'CORS_ORIGIN') {
    console.log(`⚠️  ${varName}: SET (but contains placeholder value)`);
    invalidVars.push(varName);
  } else {
    // Mask sensitive values
    const maskedValue = varName.includes('KEY') || varName.includes('API') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

console.log('\n📝 Optional Variables (for full functionality):\n');

optionalVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    console.log(`⚠️  ${varName}: NOT SET`);
  } else if (value.includes('your_')) {
    console.log(`⚠️  ${varName}: SET (but contains placeholder value)`);
  } else {
    const maskedValue = varName.includes('KEY') || varName.includes('API') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

// Summary
console.log('\n═══════════════════════════════════════════════════════\n');

if (missingVars.length === 0 && invalidVars.length === 0) {
  console.log('✅ All required environment variables are properly configured!\n');
  console.log('🚀 You can now run:');
  console.log('   npm run dev\n');
  process.exit(0);
} else {
  console.log('❌ Configuration incomplete!\n');
  
  if (missingVars.length > 0) {
    console.log('Missing variables:');
    missingVars.forEach(v => console.log(`  - ${v}`));
    console.log('');
  }
  
  if (invalidVars.length > 0) {
    console.log('⚠️  Variables with placeholder values (need real values):');
    invalidVars.forEach(v => console.log(`  - ${v}`));
    console.log('');
  }
  
  console.log('📖 Please refer to SETUP_GUIDE.md for detailed instructions.\n');
  console.log('📍 Location: /Users/siddhantgureja/Desktop/FoundrIQ_IBM/SETUP_GUIDE.md\n');
  
  process.exit(1);
}
