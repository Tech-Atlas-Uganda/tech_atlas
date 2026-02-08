# Debug Authentication Issue

## Current Status

Added extensive logging to debug the "Please login (10001)" error.

## Steps to Debug

### 1. Restart the Development Server

**IMPORTANT:** You must restart the server for the changes to take effect.

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
pnpm dev
```

### 2. Check Server Startup Logs

When the server starts, you should see:

```
[Supabase] Initializing server client...
[Supabase] URL: Set
[Supabase] Using: Service Role Key
```

If you see "Anon Key" instead of "Service Role Key", the `SUPABASE_SERVICE_ROLE_KEY` environment variable is not being read.

### 3. Sign In and Try to Save Profile

1. Open browser console (F12)
2. Sign in to the app
3. Go to http://localhost:3000/profile/settings
4. Make a change (e.g., update your name)
5. Click "Save Changes"

### 4. Check Browser Console

You should see:

```
[Auth] Sending request with Supabase token
```

If you see:

```
[Auth] No Supabase session found - request will be unauthenticated
```

Then the client doesn't have a Supabase session. Try signing out and signing in again.

### 5. Check Server Console

After clicking "Save Changes", check the server console. You should see:

```
[Auth] Authorization header: Present
[Auth] Validating Supabase token...
[Auth] Supabase user found: your-email@example.com
[Auth] Existing user found: your-email@example.com
[Auth] Final user: your-email@example.com
```

## Common Issues and Solutions

### Issue 1: "Authorization header: Missing"

**Problem:** Client is not sending the auth token

**Solutions:**
1. Check browser console - do you see "[Auth] Sending request with Supabase token"?
2. If not, sign out and sign in again
3. Check if Supabase session exists: Open browser console and run:
   ```javascript
   (async () => {
     const { data } = await window.supabase.auth.getSession();
     console.log('Session:', data.session);
   })();
   ```

### Issue 2: "Supabase token validation error"

**Problem:** Server can't validate the token

**Possible causes:**
1. Server is using anon key instead of service role key
2. Token is expired (tokens expire after 1 hour)
3. Supabase URL mismatch

**Solutions:**
1. Check server startup logs - should say "Using: Service Role Key"
2. Sign out and sign in again to get fresh token
3. Verify `.env` has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Issue 3: "Trying OAuth fallback..."

**Problem:** Supabase auth failed, falling back to OAuth

**This means:**
- Authorization header was missing, OR
- Token validation failed, OR
- User lookup in database failed

**Check:**
- All the above issues
- Database connection is working
- Users table exists

### Issue 4: "Final user: null"

**Problem:** Both Supabase and OAuth authentication failed

**Solutions:**
1. Check all server logs for errors
2. Verify database connection
3. Check if users table exists:
   ```sql
   SELECT * FROM users LIMIT 1;
   ```

## Environment Variables Check

Make sure your `.env` file has:

```env
# Server-side (required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Client-side (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

## Testing Supabase Connection

### Test 1: Check if server can connect to Supabase

Add this to `server/_core/context.ts` temporarily:

```typescript
// Test Supabase connection
const { data, error } = await supabase.auth.admin.listUsers();
console.log('[Test] Supabase connection:', error ? 'Failed' : 'Success');
```

### Test 2: Check if client has session

In browser console:

```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('Access token:', session?.access_token);
```

## Next Steps

1. **Restart the server** (most important!)
2. **Check all logs** as described above
3. **Report back** with:
   - Server startup logs
   - Browser console logs
   - Server console logs after clicking "Save"
   
This will help identify exactly where the authentication is failing.

## Quick Fix: Force Re-authentication

If nothing works, try this:

1. Sign out completely
2. Clear browser storage:
   - Open DevTools (F12)
   - Go to Application tab
   - Clear all storage
3. Restart the dev server
4. Sign in again
5. Try saving profile

This ensures you have a fresh Supabase session and the server has the latest code.
