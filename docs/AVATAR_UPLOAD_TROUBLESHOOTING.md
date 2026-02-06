# Avatar Upload Troubleshooting Guide

## Issue: Users can't upload avatars

### Step 1: Verify Bucket Exists
1. Go to Supabase Dashboard → Storage
2. Check if `avatars` bucket exists
3. Verify it's marked as **Public**

### Step 2: Set Up Storage Policies
Run this SQL in Supabase SQL Editor:

```sql
-- Run the check-avatar-bucket.sql file
```

This will:
- Drop any conflicting policies
- Create proper policies for authenticated users
- Allow public read access to avatars

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading an avatar
4. Look for these log messages:
   - `📸 Starting avatar upload:` - Shows file info
   - `📤 Uploading to Supabase Storage:` - Shows upload attempt
   - `✅ Upload successful:` - Confirms upload worked
   - `🔗 Public URL:` - Shows the avatar URL

### Step 4: Common Errors & Solutions

#### Error: "new row violates row-level security policy"
**Solution:** Run the storage policies SQL (check-avatar-bucket.sql)

#### Error: "Bucket not found"
**Solution:** Create the `avatars` bucket in Supabase Storage

#### Error: "The resource already exists"
**Solution:** The file already exists. Try uploading again (timestamp will be different)

#### Error: "File size exceeds limit"
**Solution:** Image must be under 2MB. Compress the image first.

#### Error: "Invalid file type"
**Solution:** Only image files (JPG, PNG, GIF, WebP) are allowed

### Step 5: Verify Upload Worked
1. After upload, you should see the avatar preview update
2. Click "Save Changes" to persist to database
3. Check Settings page - avatar should appear there too
4. Check People page (if profile is public) - avatar should show

### Step 6: Check Database
Run this SQL to verify avatar URL was saved:

```sql
SELECT id, name, email, avatar, "isPublic" 
FROM users 
WHERE email = 'your-email@example.com';
```

### Step 7: Test Public Access
1. Copy the avatar URL from the database
2. Open it in a new browser tab
3. If you see the image, public access is working
4. If you get an error, check storage policies again

## Quick Fix Checklist
- [ ] Bucket `avatars` exists and is public
- [ ] Storage policies are set up (run check-avatar-bucket.sql)
- [ ] User is authenticated (logged in)
- [ ] Image is under 2MB
- [ ] Image is a valid type (JPG, PNG, GIF, WebP)
- [ ] Browser console shows no errors
- [ ] Avatar URL is saved to database after clicking "Save Changes"

## Still Not Working?
Check these:
1. Supabase project is not paused
2. Storage quota is not exceeded
3. Network connection is stable
4. Browser has permission to access files
5. Ad blockers are not interfering
