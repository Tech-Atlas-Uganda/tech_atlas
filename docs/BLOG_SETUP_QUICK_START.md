# Blog Setup - Quick Start (5 Minutes)

## 🚀 Fast Track Setup

### Step 1: Create Bucket (2 minutes)
1. Open Supabase Dashboard
2. Go to **Storage** → Click **"New bucket"**
3. Settings:
   - Name: `blog-images`
   - Public: ✅ **CHECK THIS**
4. Click **"Create bucket"**

### Step 2: Run SQL (1 minute)
1. Go to **SQL Editor** → **"New query"**
2. Copy & paste from: `sql/setup-blog-complete.sql`
3. Click **"Run"**
4. ✅ Should see "Setup Complete!"

### Step 3: Test (2 minutes)
```bash
# Restart server
pnpm dev
```

1. Open app → Log in
2. Go to `/submit-blog`
3. Fill form + upload image
4. Click **"Submit for Review"**
5. ✅ Success!

---

## 📋 Verification Checklist

Quick checks before testing:

```bash
# 1. Check bucket exists
✅ Supabase → Storage → See "blog-images" with 🌐 icon

# 2. Check policies
✅ Storage → Policies → See 4 policies for blog-images

# 3. Check table column
✅ Table Editor → blog_posts → See "coverImage" column

# 4. Check env vars
✅ .env has SUPABASE_URL and keys
```

---

## 🎨 Generate Default Images

Open in browser: `docs/generate-default-blog-image.html`

1. Choose template (Blue/Purple/Green/Orange)
2. Enter title
3. Click "Generate Image"
4. Download PNG
5. Upload to Supabase Storage → blog-images

---

## 🐛 Quick Fixes

### "Bucket not found"
```bash
→ Create bucket in Storage (Step 1)
```

### "Upload failed"
```bash
→ Run sql/setup-blog-complete.sql (Step 2)
```

### "Column doesn't exist"
```sql
-- Run in SQL Editor:
ALTER TABLE blog_posts ADD COLUMN "coverImage" varchar(500);
```

### "Not working"
```bash
# Nuclear option:
1. Delete blog-images bucket
2. Recreate it (public)
3. Run sql/setup-blog-complete.sql
4. Restart: pnpm dev
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ "Choose Image" button appears
2. ✅ Image preview shows after selecting
3. ✅ Submit succeeds with toast
4. ✅ Redirects to /blog
5. ✅ Image in Storage → blog-images
6. ✅ Row in Table Editor → blog_posts

---

## 📁 Files Reference

- `sql/setup-blog-complete.sql` - Complete setup
- `docs/SETUP_BLOG_IMAGES_BUCKET.md` - Detailed guide
- `docs/generate-default-blog-image.html` - Image generator
- `docs/BLOG_IMAGE_UPLOAD.md` - Technical docs

---

## 🎯 Test Commands

```sql
-- Check bucket
SELECT * FROM storage.buckets WHERE name = 'blog-images';

-- Check policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%blog%';

-- Check blog posts
SELECT id, title, "coverImage", status 
FROM blog_posts 
ORDER BY "createdAt" DESC LIMIT 5;

-- Count images
SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'blog-images';
```

---

## 🚨 Emergency Reset

If everything is broken:

```sql
-- 1. Drop policies
DROP POLICY IF EXISTS "Public blog image access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- 2. Delete bucket (in Dashboard)
-- Storage → blog-images → Delete

-- 3. Start over from Step 1
```

---

**Total time: ~5 minutes** ⏱️

**Ready to blog!** 🎉
