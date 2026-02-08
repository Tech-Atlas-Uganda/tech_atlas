# 🚀 START HERE - Blog Setup

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Storage Bucket
1. Open your Supabase Dashboard
2. Click **Storage** in left sidebar
3. Click **"New bucket"** button
4. Fill in:
   - **Name**: `blog-images`
   - **Public**: ✅ **CHECK THIS BOX**
5. Click **"Create bucket"**

### Step 2: Run Setup SQL
1. In Supabase, click **SQL Editor**
2. Click **"New query"**
3. Open file: `sql/setup-blog-complete.sql`
4. Copy ALL the content
5. Paste into SQL Editor
6. Click **"Run"** button
7. Wait for "Setup Complete!" message

### Step 3: Restart Your Server
```bash
# Stop current server (Ctrl+C or Cmd+C)
pnpm dev
```

### Step 4: Test It!
1. Open your app: `http://localhost:3000`
2. Log in
3. Go to: `/submit-blog`
4. You should see a **"Choose Image"** button
5. Fill in the form
6. Click "Choose Image" and select a photo
7. Click **"Submit for Review"**
8. ✅ Success!

---

## 📋 Checklist

Before testing, verify:

- [ ] `blog-images` bucket exists in Supabase Storage
- [ ] Bucket has 🌐 globe icon (means it's public)
- [ ] SQL script ran successfully
- [ ] Dev server restarted
- [ ] You're logged in to the app

---

## 🎨 Bonus: Generate Default Images

1. Open in browser: `docs/generate-default-blog-image.html`
2. Choose a color template
3. Enter your blog title
4. Click "Generate Image"
5. Download the PNG
6. Upload to Supabase Storage → blog-images

---

## 📚 Need More Help?

### Quick Reference:
- `docs/BLOG_SETUP_QUICK_START.md` - 5-minute guide
- `docs/SETUP_BLOG_IMAGES_BUCKET.md` - Detailed step-by-step
- `docs/BLOG_SETUP_COMPLETE.md` - Complete summary

### Tools:
- `sql/setup-blog-complete.sql` - Setup script
- `docs/generate-default-blog-image.html` - Image generator

---

## ✅ How to Know It's Working

You'll see:
1. ✅ "Choose Image" button on submit page
2. ✅ Image preview after selecting file
3. ✅ Success message after submitting
4. ✅ Redirect to /blog page
5. ✅ Images in Supabase Storage → blog-images
6. ✅ Blog posts in Table Editor → blog_posts

---

## 🐛 Quick Fixes

### "Bucket not found"
→ Go back to Step 1, create the bucket

### "Upload failed"
→ Run `sql/setup-blog-complete.sql` again

### "Button doesn't work"
→ Restart server: `pnpm dev`

### Still not working?
→ See `docs/SETUP_BLOG_IMAGES_BUCKET.md` for detailed troubleshooting

---

## 🎯 That's It!

**Total time: ~5 minutes**

Follow the 4 steps above and you're ready to start blogging! 🎉

---

**Questions?** Check the docs folder for detailed guides.
