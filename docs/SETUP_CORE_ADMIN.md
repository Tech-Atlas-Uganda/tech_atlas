# Setup Core Admin - Quick Guide

## 🎯 Goal
Make `techatlasug@gmail.com` a Core Admin with full platform control.

---

## 📋 Prerequisites

1. Access to Supabase Dashboard
2. SQL Editor access
3. User must have signed in at least once (or we'll create the account)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your Tech Atlas project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Run the SQL Script

**Copy and paste this into the SQL Editor:**

```sql
-- Make techatlasug@gmail.com a Core Admin
UPDATE users 
SET role = 'core_admin'
WHERE email = 'techatlasug@gmail.com';

-- Verify the result
SELECT 
  id,
  email,
  name,
  role,
  "createdAt"
FROM users 
WHERE email = 'techatlasug@gmail.com';
```

**Click "Run" or press Ctrl+Enter**

---

### Step 3: Verify

You should see output like:

```
| id | email                    | name              | role       | createdAt           |
|----|--------------------------|-------------------|------------|---------------------|
| 1  | techatlasug@gmail.com    | Tech Atlas Uganda | core_admin | 2024-02-09 10:00:00 |
```

✅ **Success!** The user is now a Core Admin.

---

## 🔧 Alternative: If User Doesn't Exist Yet

If the user hasn't signed in yet, you can create the account:

```sql
-- Create Core Admin user
INSERT INTO users (
  "openId",
  name,
  email,
  role,
  "loginMethod",
  "createdAt",
  "updatedAt",
  "lastSignedIn"
)
VALUES (
  'core-admin-techatlasug',
  'Tech Atlas Uganda',
  'techatlasug@gmail.com',
  'core_admin',
  'supabase',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT ("openId") DO UPDATE
SET role = 'core_admin';

-- Verify
SELECT id, email, name, role FROM users WHERE email = 'techatlasug@gmail.com';
```

---

## 📁 SQL Files Available

I've created two SQL files for you:

### 1. `sql/make-core-admin.sql` (Comprehensive)
- Checks if user exists
- Updates role to core_admin
- Logs the change in audit log
- Includes error handling
- Shows success message

**Use this for:** Production setup with full audit trail

### 2. `sql/setup-core-admin-simple.sql` (Simple)
- Quick UPDATE statement
- Option to create user if needed
- Minimal code
- Easy to understand

**Use this for:** Quick setup or testing

---

## 🧪 Testing

### 1. Login as Core Admin

1. Go to your Tech Atlas platform
2. Sign in with `techatlasug@gmail.com`
3. Look for the 👑 **Core Admin** link in the sidebar

### 2. Access Core Admin Dashboard

1. Click the 👑 **Core Admin** link
2. Or navigate directly to: `/core-admin`
3. You should see the Core Admin Dashboard

### 3. Verify Permissions

You should be able to:
- ✅ View all users
- ✅ Change any user's role
- ✅ Assign Core Admin role to others
- ✅ Deactivate users
- ✅ View audit logs
- ✅ Access system settings

---

## 🔐 Security Notes

### Core Admin Powers:
- **UNLIMITED** role assignment (including other Core Admins)
- System-level configuration access
- Database administration capabilities
- Security settings management
- Complete platform control

### Best Practices:
1. **Limit Core Admins**: Only assign to trusted individuals
2. **Use Audit Logs**: Track all role changes
3. **Regular Reviews**: Periodically review Core Admin list
4. **Secure Accounts**: Use strong passwords and 2FA
5. **Document Changes**: Always provide reasons for role changes

---

## 🆘 Troubleshooting

### Issue: "User not found"

**Solution:** The user hasn't signed in yet. Either:
1. Have them sign in first, then run the UPDATE
2. Use the CREATE script to create the account

### Issue: "Permission denied"

**Solution:** You need database admin access in Supabase:
1. Go to Supabase Dashboard
2. Check your project permissions
3. Ensure you're the project owner or have SQL access

### Issue: "Column 'role' does not exist"

**Solution:** Run the database setup script first:
```sql
-- Add role column if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
```

### Issue: "Can't access /core-admin"

**Solution:** 
1. Clear browser cache
2. Sign out and sign in again
3. Check browser console for errors
4. Verify role in database: `SELECT role FROM users WHERE email = 'techatlasug@gmail.com'`

---

## 📊 Verify in Database

### Check Current Role:
```sql
SELECT id, email, name, role 
FROM users 
WHERE email = 'techatlasug@gmail.com';
```

### Check All Core Admins:
```sql
SELECT id, email, name, role, "createdAt"
FROM users 
WHERE role = 'core_admin'
ORDER BY "createdAt" ASC;
```

### Check Role Audit Log:
```sql
SELECT 
  "userId",
  "previousRole",
  "newRole",
  "assignedBy",
  reason,
  "createdAt"
FROM role_audit_log
WHERE "newRole" = 'core_admin'
ORDER BY "createdAt" DESC
LIMIT 10;
```

---

## 🎯 Next Steps

After setting up Core Admin:

1. **Login**: Sign in with `techatlasug@gmail.com`
2. **Access Dashboard**: Go to `/core-admin`
3. **Assign Roles**: Set up other administrators
4. **Configure Platform**: Review system settings
5. **Review Users**: Check all user accounts
6. **Setup Moderators**: Assign moderator roles to trusted users

---

## 📞 Need Help?

If you encounter issues:

1. Check the SQL files: `sql/make-core-admin.sql` or `sql/setup-core-admin-simple.sql`
2. Review the governance docs: `docs/GOVERNANCE_SYSTEM_COMPLETE.md`
3. Check role hierarchy: `docs/ROLE_HIERARCHY.md`
4. Verify database setup: `sql/supabase-setup-safe.sql`

---

## ✅ Success Checklist

- [ ] SQL script executed successfully
- [ ] User role shows as `core_admin` in database
- [ ] User can login to the platform
- [ ] 👑 Core Admin link appears in sidebar
- [ ] `/core-admin` dashboard is accessible
- [ ] Can view and manage all users
- [ ] Can assign any role to any user
- [ ] Audit log shows the role change

---

**Once all checkboxes are complete, `techatlasug@gmail.com` is fully set up as Core Admin!** 🎉

---

*Last Updated: February 2026*  
*For: Tech Atlas Uganda Platform*
