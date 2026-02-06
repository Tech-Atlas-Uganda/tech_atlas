# Avatar Storage Bucket Setup

## Create Bucket in Supabase

1. Go to https://supabase.com/dashboard
2. Select your Tech Atlas project
3. Click **Storage** in left sidebar
4. Click **"New bucket"**
5. Enter bucket name: `avatars`
6. ✅ Check **"Public bucket"**
7. Click **"Create bucket"**

## Bucket Configuration

- **Name**: `avatars`
- **Public**: Yes (so avatars can be displayed)
- **File size limit**: 2MB per image
- **Allowed types**: image/jpeg, image/png, image/gif, image/webp

## Folder Structure

```
avatars/
├── user-{userId}-{timestamp}.jpg
├── user-{userId}-{timestamp}.png
└── ...
```

## Storage Policies (Optional)

If you want to add policies in Supabase SQL Editor:

```sql
-- Allow public read access to avatars
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
```

## That's It!

Once the bucket is created, the avatar upload will work automatically.
