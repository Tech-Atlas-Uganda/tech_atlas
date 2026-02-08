# Schema Fix - Missing Columns

## Problem Found!

The database query was failing because the schema file (`drizzle/schema-simple.ts`) was missing two columns:
- `isPublic` (boolean)
- `avatar` (varchar)

## Root Cause

The server uses `schema-simple.ts` instead of `schema-postgres.ts`, and this schema was outdated and missing the profile-related columns.

## The Fix

Added the missing columns to `drizzle/schema-simple.ts`:

```typescript
isPublic: boolean("isPublic").default(false).notNull(),
avatar: varchar("avatar", { length: 500 }),
```

## Files Modified

1. **drizzle/schema-simple.ts** - Added `isPublic` and `avatar` columns
2. **server/_core/context.ts** - Better error handling for database operations
3. **server/db.ts** - Added try-catch to getUserByOpenId for better error reporting

## What This Fixes

✅ Database queries will now include all columns
✅ User creation will work properly
✅ Profile updates (including avatar and privacy settings) will save
✅ No more "Failed query" errors

## Next Steps

### 1. Restart the Server

**CRITICAL:** You must restart the dev server:

```bash
# Stop the server (Ctrl+C)
# Restart:
npm run dev
```

### 2. Test Profile Save

1. Sign in to the app
2. Go to http://localhost:3000/profile/settings
3. Update your profile
4. Click "Save Changes"
5. Should see success toast!

### 3. Check Server Logs

You should now see:

```
[Auth] Authorization header: Present
[Auth] Validating Supabase token...
[Auth] Supabase user found: your-email@example.com
[Auth] Creating new user in database...
[Auth] User created: your-email@example.com
[Auth] Final user: your-email@example.com
```

No more "Failed query" errors!

## Why This Happened

The codebase has two schema files:
- `schema-postgres.ts` - Full schema with enums (not used by server)
- `schema-simple.ts` - Simplified schema without enums (used by server)

The `schema-simple.ts` was created to avoid enum conflicts but wasn't kept in sync with the full schema when `isPublic` and `avatar` columns were added.

## Database Migration

If your database doesn't have these columns yet, you may need to add them:

```sql
-- Add isPublic column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT FALSE NOT NULL;

-- Add avatar column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
```

Run this in your Supabase SQL Editor if you get errors about missing columns.

## Verification

After restarting, the profile save should work. If you still get errors:

1. Check if the columns exist in your database:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

2. If columns are missing, run the migration SQL above

3. Restart the server again

## Summary

The authentication was working perfectly - Supabase token validation was successful. The issue was purely a schema mismatch between the code and what the database queries expected.

With the schema fixed, everything should work now!
