# 🚨 PERPLEXITY API KEY NOT FOUND - FIX REQUIRED

## Problem
Your `.env` file does NOT have the `PERPLEXITY_API_KEY` set, or it's not formatted correctly.

## Solution

### Step 1: Open your `.env` file
Location: `/Users/siddhantgureja/Desktop/Resume/FoundrIQ/server/.env`

### Step 2: Add this line (if missing)
```bash
PERPLEXITY_API_KEY=pplx-your-actual-api-key-here
```

### Step 3: Verify the format
Your `.env` file should look like this:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Perplexity AI - REQUIRED
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxx

# Tavily Search
TAVILY_API_KEY=your_tavily_key

# Appwrite
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=691861af00055d6a4283
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=foundriq
APPWRITE_IDEAS_COLLECTION_ID=ideas
```

## Common Issues & Fixes

### Issue 1: Extra spaces
❌ `PERPLEXITY_API_KEY = pplx-123`  (spaces around =)
✅ `PERPLEXITY_API_KEY=pplx-123`    (no spaces)

### Issue 2: Quotes
❌ `PERPLEXITY_API_KEY="pplx-123"`  (unnecessary quotes)
✅ `PERPLEXITY_API_KEY=pplx-123`    (no quotes)

### Issue 3: Wrong file location
❌ `.env` in root directory
✅ `.env` in `/server/` directory

### Issue 4: Comments on same line
❌ `PERPLEXITY_API_KEY=pplx-123 # my key`
✅ `PERPLEXITY_API_KEY=pplx-123`

## How to Get Your Perplexity API Key

1. Go to: https://www.perplexity.ai/settings/api
2. Sign in to your Perplexity account
3. Create a new API key
4. Copy the key (starts with `pplx-`)
5. Paste it in your `.env` file

## After Adding the Key

1. Save the `.env` file
2. The server will automatically restart (nodemon is watching)
3. You should see: `✅ Perplexity AI Client initialized successfully`

## Test if it Works

Run this command to verify:
```bash
cd server
node test-env.js
```

You should see:
```
🔍 Environment Variable Check:
================================
PERPLEXITY_API_KEY exists: true
PERPLEXITY_API_KEY length: 56
First 10 chars: pplx-xxxxx
================================
```

---

**Current Status:** ❌ API key NOT found in `.env` file
**Action Required:** Add `PERPLEXITY_API_KEY=your-key` to `/server/.env`
