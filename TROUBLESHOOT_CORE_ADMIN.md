# 🔧 Troubleshoot: Can't Access Core Admin

## ❌ Problem
You can't access `/core-admin` even after running the SQL scripts.

---

## ✅ SOLUTION: Run This Script

### **File:** `sql/fix-core-admin-access.sql`

This script updates **BOTH** places where the role is stored:
1. ✅ `users` table (for backend)
2. ✅ `auth.users.raw_user_meta_data` (for frontend) ← **THIS IS KEY!**

---

## 🚀 Quick Fix (3 Steps)

### Step 1: Run the Fix Script

Open Supabase SQL Editor and run:

```sql
-- Update users table
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';

-- Update auth.users metadata (CRITICAL - Frontend reads this!)
UPDATE auth.users
SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', 'core_admin')
WHERE email = 'techatlasug@gmail.com';

-- Force session refresh
UPDATE auth.users
SET updated_at = NOW()
WHERE email = 'techatlasug@gmail.com';

-- Verify
SELECT 
    email,
    raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'techatlasug@gmail.com';
```

**Expected output:**
```
email                  | role
-----------------------|------------
techatlasug@gmail.com  | core_admin
```

### Step 2: Sign Out Completely

**IMPORTANT:** You MUST sign out and sign in again!

1. Click your profile → Sign Out
2. Close ALL browser tabs with the platform
3. (Optional) Clear browser cache: Ctrl+Shift+Delete

### Step 3: Sign In Again

1. Go to your platform URL
2. Sign in with `techatlasug@gmail.com`
3. Look for 👑 **Core Admin** in the sidebar
4. Click to access `/core-admin`

---

## 🔍 Why This Happens

### The Frontend Checks Two Places:

```typescript
// In ProtectedRoute.tsx
const userRole = user?.user_metadata?.role || user?.role || 'user';
```

1. **First**: `user.user_metadata.role` ← From Supabase auth
2. **Fallback**: `user.role` ← From your users table

### The Issue:

- ✅ You updated `users.role` = 'core_admin'
- ❌ But `auth.users.raw_user_meta_data.role` was still 'user' or missing
- Result: Frontend sees 'user', not 'core_admin'

### The Fix:

Update **BOTH** places, then sign out/in to refresh the session.

---

## 🧪 Verify It Worked

### Check 1: Database

```sql
-- Should show core_admin in BOTH places
SELECT 
    u.email,
    u.role as users_table_role,
    au.raw_user_meta_data->>'role' as auth_metadata_role
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE u.email = 'techatlasug@gmail.com';
```

**Expected:**
```
email                  | users_table_role | auth_metadata_role
-----------------------|------------------|-------------------
techatlasug@gmail.com  | core_admin       | core_admin
```

### Check 2: Browser Console

After signing in, open browser console (F12) and check:

```javascript
// Should show core_admin
console.log(user?.user_metadata?.role);
```

### Check 3: Sidebar

You should see:
- 👑 **Core Admin** link (yellow/gold color)
- Below the Admin link
- Only visible to core_admin users

### Check 4: Access Dashboard

Navigate to `/core-admin` - you should see:
- User management tab
- Role hierarchy tab
- Audit log tab
- System tab

---

## 🆘 Still Not Working?

### Issue 1: "Still shows 'user' role"

**Solution:** You didn't sign out properly.

1. Sign out from the platform
2. Close ALL browser tabs
3. Clear cookies for your domain
4. Sign in again

### Issue 2: "Core Admin link not in sidebar"

**Solution:** Check the Sidebar component.

Run this in browser console after signing in:
```javascript
console.log('User:', user);
console.log('Role:', user?.user_metadata?.role);
```

Should show `role: "core_admin"`

### Issue 3: "Access Denied on /core-admin"

**Solution:** The ProtectedRoute is checking the role.

1. Verify database has correct role (see Check 1 above)
2. Sign out and sign in again
3. Check browser console for errors

### Issue 4: "User doesn't exist"

**Solution:** Create the user first.

```sql
-- Check if user exists
SELECT * FROM auth.users WHERE email = 'techatlasug@gmail.com';

-- If not, they need to sign up first through the platform
-- Then run the role update scripts
```

---

## 📋 Complete Checklist

- [ ] Ran `sql/complete-role-setup.sql` (adds core_admin to enum)
- [ ] Ran `sql/fix-core-admin-access.sql` (updates both tables)
- [ ] Verified `users.role` = 'core_admin'
- [ ] Verified `auth.users.raw_user_meta_data.role` = 'core_admin'
- [ ] Signed out completely
- [ ] Closed all browser tabs
- [ ] Signed in again
- [ ] See 👑 Core Admin in sidebar
- [ ] Can access `/core-admin`

---

## 🎯 Quick Reference

### Files to Run (In Order):

1. **`sql/complete-role-setup.sql`** - First time setup
2. **`sql/fix-core-admin-access.sql`** - Fix access issue
3. **`sql/debug-user-role.sql`** - Debug if still not working

### Key Commands:

```sql
-- Check role in both places
SELECT 
    u.email,
    u.role as users_role,
    au.raw_user_meta_data->>'role' as metadata_role
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE u.email = 'techatlasug@gmail.com';

-- Fix if needed
UPDATE users SET role = 'core_admin' WHERE email = 'techatlasug@gmail.com';
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role":"core_admin"}'::jsonb WHERE email = 'techatlasug@gmail.com';
```

---

## ✅ Success Indicators

When it's working, you'll see:

1. ✅ 👑 **Core Admin** link in sidebar (yellow/gold)
2. ✅ Can click and access `/core-admin`
3. ✅ See all 4 tabs: Users, Roles, Audit Log, System
4. ✅ Can view and manage all users
5. ✅ Can assign any role to any user

---

**If you've followed all steps and it's still not working, run `sql/debug-user-role.sql` and share the output!**
