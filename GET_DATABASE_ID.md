# How to Get Your Appwrite Database ID

## Step 1: Open Appwrite Console
Go to: https://nyc.cloud.appwrite.io/console/project-691861af00055d6a4283

## Step 2: Navigate to Databases
Click **Databases** in the left sidebar

## Step 3: Copy Database ID
You'll see a list of databases. Click on your database and copy the **Database ID** from the URL or the database details.

The URL will look like:
```
https://nyc.cloud.appwrite.io/console/project-691861af00055d6a4283/databases/database-[YOUR_ID_HERE]
```

Copy that ID and paste it in your `/client/.env` file:
```bash
VITE_APPWRITE_DATABASE_ID=your_actual_database_id_here
```

## About OAuth & Your Backend

**IMPORTANT:** OAuth login (Google/GitHub) does NOT go through your Render backend!

Here's how it works:
1. User clicks "Sign in with Google"
2. Browser redirects to → **Appwrite servers** (`nyc.cloud.appwrite.io`)
3. Appwrite handles OAuth with Google
4. User gets redirected back to your app (`/my-ideas`)

**Your Render backend is only used for:**
- AI analysis endpoints (`/api/refiner/*`, `/api/ai/*`)
- Fetching/saving ideas to database

**You won't see Render requests when logging in** - that's correct! OAuth is handled entirely by Appwrite.

## When Your Backend IS Called

Your backend on Render will be called when:
1. You submit an idea for validation → hits `/api/refiner/questions`
2. You refine an idea → hits `/api/refiner/refine`
3. You run analysis → hits `/api/ai/idea/evaluate`

All authentication and database operations go through **Appwrite directly**, not your backend.
