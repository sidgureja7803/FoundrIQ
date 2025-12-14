#!/usr/bin/env node

/**
 * Appwrite Database Setup Script
 * Creates the required collections and attributes for FoundrIQ
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

console.log('🔧 Appwrite Database Setup\n');
console.log('Endpoint:', APPWRITE_ENDPOINT);
console.log('Project ID:', APPWRITE_PROJECT_ID);
console.log('Database ID:', DATABASE_ID);
console.log('');

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
  console.error('❌ Missing required environment variables!');
  console.error('Please set: APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID');
  process.exit(1);
}

// Initialize Appwrite
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function createIdeasCollection() {
  console.log('📦 Creating "ideas" collection...');
  
  try {
    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      'ideas',
      'ideas',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Wait a bit for Appwrite to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create attributes
    console.log('📝 Creating attributes...');
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'userId', 255, true);
    console.log('  ✅ userId');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'title', 500, true);
    console.log('  ✅ title');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'description', 10000, true);
    console.log('  ✅ description');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createBooleanAttribute(DATABASE_ID, 'ideas', 'isPublic', false);
    console.log('  ✅ isPublic');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'status', 50, false, 'pending');
    console.log('  ✅ status');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'createdAt', 50, true);
    console.log('  ✅ createdAt');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await databases.createStringAttribute(DATABASE_ID, 'ideas', 'updatedAt', 50, false);
    console.log('  ✅ updatedAt');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('⏳ Waiting for attributes to be ready (this takes ~10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Create indexes
    console.log('🔍 Creating indexes...');
    
    try {
      await databases.createIndex(DATABASE_ID, 'ideas', 'userId_index', 'key', ['userId'], ['ASC']);
      console.log('  ✅ userId_index');
    } catch (e) {
      console.log('  ⚠️  userId_index may already exist or attributes not ready yet');
    }
    
    try {
      await databases.createIndex(DATABASE_ID, 'ideas', 'isPublic_index', 'key', ['isPublic'], ['ASC']);
      console.log('  ✅ isPublic_index');
    } catch (e) {
      console.log('  ⚠️  isPublic_index may already exist or attributes not ready yet');
    }
    
    console.log('\n✅ "ideas" collection setup complete!');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Collection "ideas" already exists');
      console.log('If you\'re still seeing errors, the collection may have incorrect attributes.');
      console.log('Delete it from Appwrite Console and run this script again.');
    } else {
      console.error('❌ Error:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    await createIdeasCollection();
    console.log('\n🎉 Database setup complete!');
    console.log('You can now use the application.');
    console.log('\n👉 Refresh your browser to see changes!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
