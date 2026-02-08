# Profile Settings Loading Forever - Fix

## Problem

Profile settings page is stuck on "Loading your profile..." forever.

## Root Cause

The `getProfile` query is failing because:
1. The database schema was missing columns (`isPublic`, `avatar`)
2. The authentication context is not returning a user
3. The query keeps retrying indefinitely

## Fixes Applied

### 1. Added Missing Schema Columns

Fixed `drizzle/schema-simple.ts` to include:
- `isPublic` column
- `avatar` column

### 2. Limited Query Retries

Updated ProfileSettings to only retry once:
```typescript
retry: 1, // Only retry once
retryDelay: 1000, // Wait 1 second before retry
```

### 3. Added Error State

Now shows an error message if profile fails to load instead of loading forever.

## Action Required

### Step 1: Ensure Database Has Columns

Run this SQL in Supabase SQL Editor:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('isPublic', 'avatar');

-- Add columns if missing
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
```

### Step 2: Restart Dev Server

**CRITICAL:** Restart the server for schema changes to take effect:

```bash
# Stop (Ctrl+C) and restart:
npm run dev
```

### Step 3: Clear Browser and Sign In Fresh

1. **Sign out** from the app
2. **Clear browser storage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Clear site data"
3. **Close and reopen** the browser tab
4. **Sign in again**
5. **Go to** /profile/settings

## What Should Happen Now

### Success Case

You should see one of these:

1. **Profile loads successfully** - You see the profile settings form
2. **Error message** - "Failed to Load Profile" with the actual error

### If You See Error Message

The error message will tell you exactly what's wrong:

- **"Please login (10001)"** - Authentication is still failing
  - Check server logs for database errors
  - Verify columns exist in database
  - Try signing out and in again

- **"User not found"** - User doesn't exist in database
  - The system should auto-create users
  - Check server logs for creation errors

- **Other errors** - Check server console for details

## Debugging

### Check Server Logs

After signing in and visiting /profile/settings, check server console for:

```
[Auth] Authorization header: Present
[Auth] Validating Supabase token...
[Auth] Supabase user found: your-email@example.com
[Auth] Creating new user in database...
[Auth] User created: your-email@example.com
[Auth] Final user: your-email@example.com
```

### Check Browser Console

Should see:
```
[Auth] Sending request with Supabase token
```

### Check Database

Verify user was created:
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

## Common Issues

### Issue 1: Still Loading Forever

**Cause:** Query is still retrying despite retry limit

**Solution:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server

### Issue 2: Error "Failed query"

**Cause:** Database columns don't exist

**Solution:**
1. Run the ALTER TABLE SQL above
2. Restart dev server
3. Try again

### Issue 3: Error "Please login"

**Cause:** Authentication context is not working

**Solution:**
1. Check server logs for auth errors
2. Verify Supabase credentials in .env
3. Sign out and sign in again
4. Check if user was created in database

### Issue 4: Blank Page

**Cause:** JavaScript error

**Solution:**
1. Check browser console for errors
2. Check if all imports are correct
3. Restart dev server

## Quick Test

To quickly test if authentication is working:

1. Open browser console
2. Run:
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

If session is null, you're not signed in. Sign in again.

## Files Modified

1. **client/src/pages/ProfileSettings.tsx**
   - Added retry limit (1 retry)
   - Added error state display
   - Better error handling

2. **drizzle/schema-simple.ts**
   - Added `isPublic` column
   - Added `avatar` column

3. **server/_core/context.ts**
   - Better error handling
   - More detailed logging

## Summary

The loading issue should now be resolved. You'll either see:
- ✅ Profile settings form (success!)
- ❌ Error message (tells you what's wrong)

No more infinite loading!
