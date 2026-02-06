# 📸 Image Upload Setup Guide for Events & Opportunities

## ✅ Code Changes Complete

All code changes have been implemented! The application now supports image uploads for events and opportunities.

## 🔧 Supabase Setup Required

You need to complete these steps in your Supabase dashboard to enable image uploads:

### **STEP 1: Add imageUrl Column to Database Tables**

1. Go to https://supabase.com/dashboard
2. Select your project: `opjxkfzofuqzijkvinzd`
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Paste this SQL and click **"Run"**:

```sql
-- Add imageUrl column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500);

-- Add imageUrl column to opportunities table
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500);
```

### **STEP 2: Create Storage Bucket**

1. In your Supabase dashboard, click on **"Storage"** in the left sidebar
2. Click the **"New bucket"** button
3. Enter bucket name: `event-images`
4. Set **"Public bucket"** to **ON** (toggle the switch)
5. Click **"Create bucket"**

### **STEP 3: Set Up Storage Policies**

1. Click on the `event-images` bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New policy"**

**Policy 1: Allow Public Read Access**
- Click **"For full customization"** under SELECT
- Policy name: `Public Access`
- Paste this in the **USING expression**:
```sql
bucket_id = 'event-images'
```
- Click **"Review"** then **"Save policy"**

**Policy 2: Allow Uploads**
- Click **"New policy"** again
- Click **"For full customization"** under INSERT
- Policy name: `Allow uploads`
- Paste this in the **WITH CHECK expression**:
```sql
bucket_id = 'event-images'
```
- Click **"Review"** then **"Save policy"**

### **Alternative: Quick Policy Setup via SQL**

Instead of using the UI, you can run this SQL in the SQL Editor:

```sql
-- Policy for public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );

-- Policy for uploads (authenticated and anonymous)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-images' );
```

## 🎉 How It Works

Once you complete the Supabase setup:

1. **Users upload images** via the event/opportunity submission form
2. **Images are uploaded** to Supabase Storage bucket `event-images`
3. **Public URLs are generated** automatically
4. **URLs are saved** in the database `imageUrl` column
5. **Images display** on the Events page in cards and modals

### **Image Features:**

- ✅ **File validation**: Only images (PNG, JPG, etc.) up to 5MB
- ✅ **Unique filenames**: Prevents conflicts with timestamp + random string
- ✅ **Organized storage**: Events in `events/` folder, opportunities in `opportunities/`
- ✅ **Default images**: Auto-generated if no image uploaded
- ✅ **Public access**: Images accessible via direct URL
- ✅ **Preview before upload**: Users see preview before submitting

## 🧪 Testing

After completing the Supabase setup:

1. Go to `/submit/event?type=event`
2. Fill in the form
3. Upload an image (or skip for default)
4. Submit the form
5. Check the Events page - your event should appear with the image!

## 📝 Notes

- Images are stored permanently in Supabase Storage
- Each image gets a unique URL like: `https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/events/1234567890-abc123.jpg`
- Default generated images are data URLs (base64 encoded)
- You can manage/delete images from the Supabase Storage dashboard

## 🔒 Security

The current setup allows:
- ✅ Anyone can upload images (for anonymous submissions)
- ✅ Anyone can view images (public bucket)
- ❌ No one can delete images via the app (only admins via Supabase dashboard)

If you want to restrict uploads to authenticated users only, modify the INSERT policy to:
```sql
CREATE POLICY "Authenticated uploads only"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);
```

## 🚀 Ready to Go!

Once you complete the 3 Supabase setup steps above, image uploads will work immediately. No code changes or server restarts needed!
