# 🔧 Appwrite Database Setup - URGENT FIX

## ❌ Current Error

```
Collection "ideas" not found in database "6922d3d5002dea30bff7"
```

## ✅ Quick Fix - 2 Options

### Option 1: Automatic Setup (Recommended)

Run this command from the server folder:

```bash
cd server
npm install node-appwrite --save-dev
node setup-appwrite-db.js
```

This will automatically create:
- ✅ "ideas" collection
- ✅ All required attributes (userId, title, description, etc.)
- ✅ Indexes for better performance

---

### Option 2: Manual Setup (Appwrite Console)

1. **Go to Appwrite Console:**
   - https://nyc.cloud.appwrite.io/console

2. **Navigate to your database:**
   - Click on your project
   - Go to "Databases"
   - Select database: `6922d3d5002dea30bff7`

3. **Create "ideas" collection:**
   - Click "Add Collection"
   - Collection ID: `ideas`
   - Collection Name: `Ideas`
   - Click "Create"

4. **Add Attributes** (one by one):

   Click "Attributes" → "Add Attribute" for each:

   | Attribute | Type | Size | Required | Default |
   |-----------|------|------|----------|---------|
   | userId | String | 255 | ✅ Yes | - |
   | title | String | 500 | ✅ Yes | - |
   | description | String | 10000 | ✅ Yes | - |
   | isPublic | Boolean | - | ❌ No | false |
   | status | String | 50 | ❌ No | "pending" |
   | createdAt | String | 50 | ✅ Yes | - |
   | updatedAt | String | 50 | ❌ No | - |

5. **Set Permissions:**

   Go to "Settings" → "Permissions":
   - Read: `Any`
   - Create: `Users`
   - Update: `Users`
   - Delete: `Users`

6. **Create Indexes** (optional but recommended):

   Go to "Indexes" → "Create Index":
   - Index 1: `userId_index` → Key: `userId` (ASC)
   - Index 2: `isPublic_index` → Key: `isPublic` (ASC)

---

## 🎯 After Setup

Once the collection is created:

1. **Refresh your browser** (Cmd+R)
2. **Go to** `/my-ideas`
3. **You should see** your ideas page working!

---

## 🔍 Verify Setup

Check if it worked:

```bash
# The console errors should be gone
# You should see "0 ideas" instead of errors
```

---

## 🆘 Still Having Issues?

If you're getting permission errors after creating the collection:

1. Make sure your `.env` has:
   ```bash
   APPWRITE_API_KEY=your_api_key_here  # Must be an API key, not a session token
   APPWRITE_PROJECT_ID=6922d3d5002dea30bff7
   APPWRITE_DATABASE_ID=6922d3d5002dea30bff7
   ```

2. Restart your server:
   ```bash
   cd server
   npm run dev
   ```

3. Hard refresh browser:
   ```bash
   Cmd + Shift + R (Mac)
   Ctrl + Shift + R (Windows)
   ```

---

## 📋 Summary

**Problem:** Appwrite database missing "ideas" collection  
**Solution:** Create collection (auto script or manual)  
**Time:** ~2-5 minutes  
**Result:** All errors gone ✅

