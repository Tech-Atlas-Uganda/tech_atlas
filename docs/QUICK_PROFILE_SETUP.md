# Quick Profile Settings Setup

## 🚀 Quick Start (5 minutes)

### 1. Create Avatars Bucket

Go to Supabase Dashboard → Storage → New Bucket:
- **Name**: `avatars`
- **Public**: ✅ YES (must be checked)
- Click "Create"

### 2. Run SQL Policies

Go to Supabase Dashboard → SQL Editor → New Query:

```sql
-- Allow public read access to all avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- Allow authenticated users to update avatars
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to delete avatars
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' );
```

Click "Run" ✅

### 3. Test It

1. Go to http://localhost:3000/profile/settings
2. Click camera icon on profile picture
3. Upload an image
4. Click "Save Changes"
5. Done! ✅

## ✅ What's Fixed

- Profile data loads correctly
- Avatar upload works
- All fields are editable and save properly
- No unwanted redirects
- Skills, interests, categories work
- Privacy settings work
- Social links work

## 🐛 Still Having Issues?

See `docs/PROFILE_SETTINGS_FIX.md` for detailed troubleshooting.
