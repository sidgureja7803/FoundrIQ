# Environment Variables Setup Guide

## Quick Fix for "TAVILY_API_KEY is not set" Error

### Problem
Even after adding `TAVILY_API_KEY` to your `.env` file, the server shows: "TAVILY_API_KEY is not set"

### Common Causes & Solutions

#### 1. **Wrong Format** ❌
```bash
# WRONG - Has spaces around =
TAVILY_API_KEY = your_key_here

# WRONG - Has quotes
TAVILY_API_KEY="your_key_here"

# WRONG - Has comment on same line
TAVILY_API_KEY=your_key_here # My API key
```

#### 2. **Correct Format** ✅
```bash
# RIGHT - No spaces, no quotes
TAVILY_API_KEY=tvly-1234567890abcdef
```

#### 3. **Check Your Setup**
Run this command to verify your API key is loaded correctly:
```bash
cd server
node check-tavily.js
```

### Required Environment Variables

Your `.env` file should have these **required** variables:

```bash
# IBM Watsonx (Granite AI)
IBM_WATSONX_API_KEY=your_ibm_api_key
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_project_id

# Appwrite (Database & Auth)
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_DATABASE_ID=your_database_id

# Tavily (Search API) - Optional but recommended
TAVILY_API_KEY=tvly-your_actual_key_here
```

### How to Get Tavily API Key

1. Go to https://tavily.com
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key
5. Paste it into your `.env` file (no spaces, no quotes!)

### Verify Your Setup

After editing your `.env` file:

1. **Stop the server** (Ctrl+C)
2. **Check the key is loaded**: `node check-tavily.js`
3. **Restart the server**: `npm run dev`

You should now see:
```
🔍 Search: ✓ Tavily
```

Instead of:
```
🔍 Search: ✗ Tavily (API key missing)
```

---

## Troubleshooting

### Still not working?

1. **Check file location**: Make sure `.env` is in the `server/` folder, not the root
2. **Check file name**: It should be exactly `.env` (with the dot)
3. **No trailing spaces**: Make sure there are no spaces after your API key
4. **Restart required**: Always restart the server after changing `.env`

### Need Help?

Run the diagnostic script:
```bash
cd server
node check-tavily.js
```

This will tell you exactly what's wrong with your setup.

