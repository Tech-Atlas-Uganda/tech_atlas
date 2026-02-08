# Setup Blog Images Bucket - Step by Step Guide

## Overview
This guide will help you set up the `blog-images` storage bucket in Supabase for blog post cover images.

---

## Step 1: Create the Storage Bucket

### 1.1 Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project

### 1.2 Navigate to Storage
1. In the left sidebar, click **Storage**
2. You'll see a list of existing buckets (if any)

### 1.3 Create New Bucket
1. Click the **"New bucket"** button (top right)
2. Fill in the form:
   - **Name**: `blog-images` (exactly this, no spaces)
   - **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
   - **File size limit**: `5242880` (5MB in bytes) or leave default
   - **Allowed MIME types**: Leave empty or add: `image/png, image/jpeg, image/gif, image/webp`
3. Click **"Create bucket"**

### 1.4 Verify Bucket Was Created
- You should now see `blog-images` in your list of buckets
- It should have a 🌐 globe icon indicating it's public

---

## Step 2: Set Up Storage Policies

### 2.1 Open SQL Editor
1. In the left sidebar, click **SQL Editor**
2. Click **"New query"**

### 2.2 Run the Setup SQL
1. Copy the entire contents of `sql/setup-blog-complete.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)

### 2.3 Verify Success
You should see output like:
```
✓ Added coverImage column to blog_posts table (or already exists)
✓ 4 storage policies created
✓ Test blog post created and deleted successfully
✓ Setup Complete!
```

---

## Step 3: Verify the Setup

### 3.1 Check Storage Policies
1. Go to **Storage** > **Policies**
2. You should see these policies for `blog-images`:
   - ✅ Public blog image access (SELECT)
   - ✅ Allow authenticated uploads (INSERT)
   - ✅ Allow authenticated updates (UPDATE)
   - ✅ Allow authenticated deletes (DELETE)

### 3.2 Check Database Table
1. Go to **Table Editor**
2. Select `blog_posts` table
3. Verify these columns exist:
   - id
   - title
   - slug
   - excerpt
   - content
   - **coverImage** ← This is important!
   - category
   - tags
   - authorId
   - status
   - createdBy
   - createdAt
   - updatedAt

---

## Step 4: Test Upload (Optional)

### 4.1 Manual Test Upload
1. Go to **Storage** > **blog-images**
2. Click **"Upload file"**
3. Select any image from your computer
4. Click **"Upload"**
5. You should see the image appear in the bucket

### 4.2 Get Public URL
1. Click on the uploaded image
2. Click **"Get public URL"**
3. Copy the URL
4. Open it in a new browser tab
5. ✅ You should see your image (this confirms the bucket is public)

### 4.3 Clean Up Test Image
1. Select the test image
2. Click **"Delete"**
3. Confirm deletion

---

## Step 5: Test from Your App

### 5.1 Restart Dev Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 5.2 Test Blog Submission
1. Open your app: `http://localhost:3000`
2. Log in (if not already logged in)
3. Navigate to `/submit-blog`
4. Fill in the form:
   - **Title**: "My First Blog Post"
   - **Excerpt**: "This is a test blog post"
   - **Content**: "Testing the blog submission system with image upload"
   - **Category**: Select any category
5. Click **"Choose Image"** button
6. Select an image from your computer
7. You should see a preview of the image
8. Click **"Submit for Review"**

### 5.3 Verify Success
✅ You should see:
- Success toast notification
- Redirect to `/blog` page

### 5.4 Check Supabase Storage
1. Go to **Storage** > **blog-images**
2. You should see your uploaded image:
   - Filename: `blog-{timestamp}.{ext}`
   - Example: `blog-1709876543210.jpg`

### 5.5 Check Database
1. Go to **Table Editor** > **blog_posts**
2. You should see your new blog post
3. Check the `coverImage` column - it should have a URL like:
   ```
   https://your-project.supabase.co/storage/v1/object/public/blog-images/blog-1709876543210.jpg
   ```

---

## Step 6: Test Default Image Generation

### 6.1 Submit Without Image
1. Go to `/submit-blog` again
2. Fill in all required fields
3. **Don't upload an image** (skip the image upload)
4. Click **"Submit for Review"**

### 6.2 Verify Default Image
1. Go to **Storage** > **blog-images**
2. You should see a new image:
   - Filename: `default-blog-{timestamp}.png`
   - This is the auto-generated blue gradient image

### 6.3 View Default Image
1. Click on the default image
2. Click **"Get public URL"**
3. Open URL in new tab
4. ✅ You should see a blue gradient image with:
   - "TECH ATLAS" text
   - "BLOG" text
   - Your blog post title

---

## Troubleshooting

### Issue: "Failed to upload image"

**Possible causes:**
1. Bucket is not public
2. Storage policies not set up
3. File too large (>5MB)
4. Wrong file type

**Solutions:**
1. Go to Storage > blog-images > Settings
2. Ensure **"Public bucket"** is checked
3. Run `sql/setup-blog-complete.sql` again
4. Try with a smaller image (<2MB)
5. Use PNG or JPG format

---

### Issue: "Bucket not found"

**Solution:**
1. Go to Storage
2. Verify `blog-images` bucket exists
3. Name must be exactly `blog-images` (no spaces, lowercase)
4. If missing, create it following Step 1

---

### Issue: "Access denied" or "Policy violation"

**Solution:**
1. Go to Storage > blog-images > Policies
2. Delete all existing policies
3. Run `sql/setup-blog-complete.sql` again
4. Verify 4 policies were created

---

### Issue: "coverImage column doesn't exist"

**Solution:**
1. Go to SQL Editor
2. Run this command:
```sql
ALTER TABLE blog_posts ADD COLUMN "coverImage" varchar(500);
```
3. Or run the full `sql/setup-blog-complete.sql`

---

### Issue: Image uploads but doesn't show in blog post

**Check:**
1. Browser console for errors (F12)
2. Server logs for errors
3. Verify coverImage URL in database:
```sql
SELECT id, title, "coverImage" FROM blog_posts ORDER BY "createdAt" DESC LIMIT 5;
```
4. Try opening the coverImage URL directly in browser

---

## Quick Verification Checklist

Before testing, verify:

- [ ] `blog-images` bucket exists in Storage
- [ ] Bucket is marked as **Public** (🌐 icon)
- [ ] 4 storage policies exist for blog-images
- [ ] `blog_posts` table has `coverImage` column
- [ ] Environment variables are set in `.env`
- [ ] Dev server is running
- [ ] You are logged in to the app

---

## Expected File Structure

After successful uploads, your Storage should look like:

```
Storage
└── blog-images/
    ├── blog-1709876543210.jpg          (user uploaded)
    ├── blog-1709876789012.png          (user uploaded)
    ├── default-blog-1709877123456.png  (auto-generated)
    └── default-blog-1709877234567.png  (auto-generated)
```

---

## SQL Quick Reference

### Check if bucket exists:
```sql
SELECT * FROM storage.buckets WHERE name = 'blog-images';
```

### Check storage policies:
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%blog%';
```

### Check blog posts with images:
```sql
SELECT 
    id, 
    title, 
    "coverImage", 
    status, 
    "createdAt" 
FROM blog_posts 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Count images in bucket:
```sql
SELECT COUNT(*) as total_images
FROM storage.objects 
WHERE bucket_id = 'blog-images';
```

---

## Success Criteria

✅ You'll know everything is working when:

1. **Bucket exists** - Visible in Storage section
2. **Bucket is public** - Has 🌐 globe icon
3. **Policies active** - 4 policies visible in Policies tab
4. **Column exists** - coverImage column in blog_posts table
5. **Upload works** - Can upload image via app
6. **Preview works** - Image preview shows in form
7. **Default works** - Auto-generates image when none uploaded
8. **Storage shows files** - Images visible in blog-images bucket
9. **Database has URLs** - coverImage column populated with URLs
10. **Images accessible** - Can open image URLs in browser

---

## Next Steps

Once setup is complete:

1. ✅ Test blog submission with image
2. ✅ Test blog submission without image (default generation)
3. ✅ Verify images in Storage
4. ✅ Verify blog posts in database
5. 🚀 Start creating real blog content!

---

## Support Files

- `sql/setup-blog-complete.sql` - Complete setup SQL script
- `docs/BLOG_IMAGE_UPLOAD.md` - Full technical documentation
- `docs/BLOG_QUICK_SETUP.md` - Quick setup checklist
- `docs/BLOG_SUBMISSION_FIX.md` - What was fixed

---

## Need Help?

If you're still having issues:

1. Check browser console (F12) for errors
2. Check server logs for detailed error messages
3. Verify all environment variables are set
4. Try logging out and back in
5. Clear browser cache and try again
6. Restart dev server

---

**Setup complete! You're ready to start blogging! 🎉**
