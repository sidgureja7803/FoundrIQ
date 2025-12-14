#!/usr/bin/env node

/**
 * Environment Variable Checker for FoundrIQ Client
 * Run this script to verify your .env configuration
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_DATABASE_ID',
  'VITE_API_URL'
];

const optionalVars = [];

console.log('🔍 Checking FoundrIQ Client Environment Configuration...\n');

// Check if .env file exists
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('\n📋 To fix this:');
  console.log('1. Copy .env.example to .env');
  console.log('   cp .env.example .env');
  console.log('2. Fill in your Appwrite configuration values');
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
  } else if (value.includes('your_') || value.includes('test') || value === 'your_database_id' || value === 'your_actual_project_id') {
    console.log(`⚠️  ${varName}: SET (but contains placeholder value: "${value}")`);
    invalidVars.push(varName);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

console.log('\n📝 Optional Variables:\n');

if (optionalVars.length === 0) {
  console.log('None\n');
}

// Summary
console.log('═══════════════════════════════════════════════════════\n');

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
  
  console.log('📖 Please refer to SETUP_GUIDE.md for detailed instructions on:');
  console.log('   1. Getting your Appwrite Project ID');
  console.log('   2. Creating a database and getting the Database ID');
  console.log('   3. Setting up collections and permissions\n');
  console.log('📍 Location: /Users/siddhantgureja/Desktop/FoundrIQ_IBM/SETUP_GUIDE.md\n');
  
  process.exit(1);
}
