# Authentication Redirect Fix

## Problem

When accessing `/profile/settings` (or any protected route), the app was redirecting to:
```
http://localhost:3000/app-auth?appId=tech-atlas-uganda&redirectUri=...
```

This resulted in a 404 error because the OAuth portal system doesn't exist.

## Root Cause

The app had **two authentication systems**:

1. **Old OAuth Portal System** (not configured, causing 404s)
   - Used `getLoginUrl()` to redirect to external OAuth portal
   - Configured via `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` env vars
   - Not set up, so redirects failed

2. **Supabase Authentication** (the correct system to use)
   - Uses `AuthDialog` component for sign-in
   - Properly configured and working
   - Should be the only auth system

## What Was Happening

1. User visits `/profile/settings`
2. `ProfileSettings` component tries to fetch user profile via tRPC
3. Server returns `UNAUTHORIZED` error (user not signed in)
4. Client-side error handler in `main.tsx` catches the error
5. Calls `getLoginUrl()` which tries to redirect to OAuth portal
6. OAuth portal doesn't exist → 404 error

## The Fix

### 1. Disabled OAuth Redirect in main.tsx

**Before:**
```typescript
const redirectToLoginIfUnauthorized = (error: unknown) => {
  // ... checks ...
  window.location.href = getLoginUrl(); // ❌ Redirects to OAuth portal
};
```

**After:**
```typescript
const redirectToLoginIfUnauthorized = (error: unknown) => {
  // ... checks ...
  // Don't redirect - let ProtectedRoute handle authentication
  console.log('[Auth] Unauthorized error detected, but not redirecting');
};
```

### 2. Deprecated getLoginUrl() in const.ts

**Before:**
```typescript
export const getLoginUrl = () => {
  // Complex OAuth portal URL generation
  const url = new URL(`${oauthPortalUrl}/app-auth`);
  // ...
  return url.toString();
};
```

**After:**
```typescript
export const getLoginUrl = () => {
  console.warn('[Auth] getLoginUrl() is deprecated - use Supabase authentication instead');
  return "/"; // Return home page instead
};
```

## How Authentication Works Now

### For Protected Routes

1. User visits protected route (e.g., `/profile/settings`)
2. `ProtectedRoute` component checks authentication
3. If not authenticated:
   - Shows "Authentication Required" card
   - Displays "Sign In" button
   - Opens `AuthDialog` when clicked
4. User signs in via Supabase (email/password, Google, GitHub)
5. Page content loads after successful authentication

### No More Redirects

- ✅ No redirect to OAuth portal
- ✅ No 404 errors
- ✅ User stays on the same page
- ✅ Clean authentication flow with modal dialog

## Files Modified

1. **client/src/main.tsx**
   - Removed OAuth redirect from error handler
   - Added console log for debugging

2. **client/src/const.ts**
   - Deprecated `getLoginUrl()` function
   - Returns home page instead of OAuth portal
   - Added warning message

3. **client/src/components/Navigation.tsx**
   - Removed `getLoginUrl()` usage
   - Added `AuthDialog` for sign-in
   - Sign-in buttons now open modal instead of redirecting

4. **client/src/components/DashboardLayout.tsx**
   - Removed `getLoginUrl()` usage
   - Added `AuthDialog` for sign-in
   - Sign-in button now opens modal instead of redirecting

## Testing

1. **Sign Out** (if signed in)
2. **Visit** http://localhost:3000/profile/settings
3. **Expected Behavior:**
   - ✅ See "Authentication Required" card
   - ✅ Click "Sign In" button
   - ✅ AuthDialog modal opens
   - ✅ Sign in with Supabase
   - ✅ Profile settings page loads
   - ❌ NO redirect to app-auth
   - ❌ NO 404 error

## Related Components

### ProtectedRoute Component
- Handles authentication checks
- Shows auth dialog when needed
- No redirects, just conditional rendering

### AuthDialog Component
- Modal dialog for sign-in/sign-up
- Uses Supabase authentication
- Supports email/password, Google, GitHub

### useAuth Hook
- Provides authentication state
- Uses Supabase session
- No OAuth portal involvement

## Environment Variables

These OAuth variables are **NOT NEEDED** and can be removed:
```env
# ❌ Not used - can be removed
VITE_OAUTH_PORTAL_URL=
VITE_APP_ID=
```

These Supabase variables **ARE REQUIRED**:
```env
# ✅ Required for authentication
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Future Cleanup (Optional)

Consider removing OAuth-related code entirely:
- [ ] Remove `getLoginUrl()` function
- [ ] Remove OAuth env variables from `.env.example`
- [ ] Update any remaining references to OAuth
- [ ] Remove unused OAuth callback routes

## Summary

✅ **Fixed:** No more redirects to OAuth portal
✅ **Fixed:** No more 404 errors on protected routes
✅ **Working:** Supabase authentication via AuthDialog
✅ **Working:** Profile settings page accessible after sign-in
