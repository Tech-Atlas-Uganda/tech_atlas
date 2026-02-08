# Blog Submission - Quick Setup Checklist

## ✅ Pre-Flight Checklist

Before testing blog submission, ensure these are complete:

### 1. Supabase Storage Bucket
- [ ] Go to Supabase Dashboard → Storage
- [ ] Check if `blog-images` bucket exists
- [ ] If not, create new bucket:
  - Name: `blog-images`
  - Public: ✅ YES
  - File size limit: 5MB

### 2. Storage Policies
- [ ] Go to Supabase Dashboard → Storage → blog-images → Policies
- [ ] Run SQL from `sql/setup-blog-images-bucket.sql`:

```sql
-- Allow public read access
CREATE POLICY "Public blog image access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'blog-images' );
```

### 3. Database Table
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Verify `blog_posts` table exists
- [ ] Check it has these columns:
  - id, title, slug, excerpt, content
  - coverImage, category, tags
  - authorId, createdBy, status
  - createdAt, updatedAt

### 4. Environment Variables
- [ ] Check `.env` file has:
```env
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### 5. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Start fresh
pnpm dev
```

## 🧪 Test Blog Submission

### Test 1: With Image Upload
1. Log in to app
2. Go to `/submit-blog`
3. Fill in:
   - Title: "Test Blog Post"
   - Excerpt: "This is a test"
   - Content: "Testing blog submission with image"
   - Category: "Tech Trends"
4. Upload an image (PNG/JPG)
5. Click "Submit for Review"
6. ✅ Should see success message
7. ✅ Should redirect to `/blog`

### Test 2: Without Image (Default Generation)
1. Log in to app
2. Go to `/submit-blog`
3. Fill in required fields
4. **Don't upload an image**
5. Click "Submit for Review"
6. ✅ Should see success message
7. ✅ Should redirect to `/blog`
8. ✅ Default blue gradient image should be generated

## 🔍 Verify in Database

### Check Supabase Storage
- Go to Storage → blog-images
- Should see uploaded images:
  - `blog-{timestamp}.{ext}` (user uploads)
  - `default-blog-{timestamp}.png` (generated)

### Check Database Table
- Go to Table Editor → blog_posts
- Should see new rows with:
  - Your blog title
  - coverImage URL populated
  - status = 'pending'
  - authorId = your user ID

## 🐛 Troubleshooting

### Error: "Failed to submit blog post"

**Check browser console:**
```
F12 → Console tab
Look for red errors
```

**Check server logs:**
```
Look for:
❌ SUPABASE CLIENT failed for blog post creation: [error]
```

**Common fixes:**
1. Bucket doesn't exist → Create it
2. Policies missing → Run SQL
3. Not logged in → Log in again
4. Table missing columns → Run schema migration

### Error: "Image upload failed"

**Check:**
- File size < 5MB
- File type is PNG/JPG/GIF
- Bucket is Public
- Storage policies allow authenticated uploads

### Error: "Please login (10001)"

**Fix:**
- Log out completely
- Clear browser cache
- Log in again
- Try submission

## 📊 Expected Console Output

### Success:
```
📝 Creating blog post: Test Blog Post
📊 Trying Supabase client for blog post creation...
✅ Blog post created in SUPABASE CLIENT: Test Blog Post
```

### With Image:
```
Uploading image to blog-images bucket...
Image uploaded successfully: blog-1234567890.png
```

### Without Image:
```
No image provided, generating default...
Default image generated and uploaded: default-blog-1234567890.png
```

## 📝 Quick Test Script

Copy and paste this into browser console after logging in:

```javascript
// Quick test - check if blog submission is ready
const checks = {
  authenticated: !!localStorage.getItem('supabase.auth.token'),
  onSubmitPage: window.location.pathname === '/submit-blog',
  supabaseConfigured: !!import.meta.env.VITE_SUPABASE_URL
};

console.table(checks);

if (Object.values(checks).every(v => v)) {
  console.log('✅ All checks passed! Ready to submit blog.');
} else {
  console.log('❌ Some checks failed. Review above.');
}
```

## 🎯 Success Criteria

You'll know it's working when:
- ✅ Form submits without errors
- ✅ Success toast appears
- ✅ Redirects to `/blog` page
- ✅ Image appears in Supabase Storage
- ✅ Blog post appears in database table
- ✅ coverImage URL is populated

## 📚 Full Documentation

For complete details, see:
- `docs/BLOG_IMAGE_UPLOAD.md` - Full system documentation
- `docs/BLOG_SUBMISSION_FIX.md` - What was fixed
- `sql/setup-blog-images-bucket.sql` - Storage policies

## 🚀 Ready to Test!

If all checkboxes above are checked, you're ready to test blog submission!

1. Restart dev server: `pnpm dev`
2. Log in to the app
3. Navigate to `/submit-blog`
4. Fill in the form
5. Submit!

Good luck! 🎉
