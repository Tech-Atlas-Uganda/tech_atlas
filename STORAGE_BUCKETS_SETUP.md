# Supabase Storage Buckets Setup

This guide explains how to set up the required storage buckets for Tech Atlas image uploads.

## Required Buckets

Tech Atlas uses two separate storage buckets:

1. **event-images** - For event flyers and images
2. **opportunity-images** - For opportunity flyers and images

## Setup Instructions

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your Tech Atlas project
3. Navigate to **Storage** in the left sidebar

### 2. Create Event Images Bucket

1. Click **"New bucket"**
2. Enter bucket name: `event-images`
3. Set **Public bucket**: ✅ Enabled (checked)
4. Click **"Create bucket"**

### 3. Create Opportunity Images Bucket

1. Click **"New bucket"** again
2. Enter bucket name: `opportunity-images`
3. Set **Public bucket**: ✅ Enabled (checked)
4. Click **"Create bucket"**

### 4. Configure Bucket Policies (Optional but Recommended)

For each bucket, you can set up policies to control access:

#### Allow Public Read Access

```sql
-- For event-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );

-- For opportunity-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'opportunity-images' );
```

#### Allow Authenticated Uploads

```sql
-- For event-images bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-images' );

-- For opportunity-images bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'opportunity-images' );
```

#### Allow Anonymous Uploads (Current Setup)

Since Tech Atlas allows anonymous submissions, you may want to allow anyone to upload:

```sql
-- For event-images bucket
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-images' );

-- For opportunity-images bucket
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'opportunity-images' );
```

## Bucket Structure

Each bucket will have the following folder structure:

```
event-images/
├── events/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
└── defaults/
    ├── default-event-1234567890.png
    └── ...

opportunity-images/
├── opportunities/
│   ├── 1234567890-xyz789.jpg
│   ├── 1234567891-uvw012.png
│   └── ...
└── defaults/
    ├── default-opportunity-1234567890.png
    └── ...
```

## File Naming Convention

- **User uploads**: `{timestamp}-{random}.{extension}`
  - Example: `1709123456-abc123.jpg`
  
- **Default images**: `default-{type}-{timestamp}.png`
  - Example: `default-event-1709123456.png`

## Default Images

When users don't upload an image, the system automatically generates a branded "TECH ATLAS" image with:
- Gradient background (yellow/amber for events, green/emerald for opportunities)
- "TECH ATLAS" text
- Type label (EVENT or OPPORTUNITY)
- Emoji icon (📅 for events, 🏆 for opportunities)

These default images are uploaded to the `defaults/` folder in each bucket.

## File Size Limits

- Maximum file size: **5MB**
- Supported formats: **PNG, JPG, JPEG, GIF, WebP**

## Public URL Format

Once uploaded, images are accessible via public URLs:

```
https://{project-ref}.supabase.co/storage/v1/object/public/event-images/events/{filename}
https://{project-ref}.supabase.co/storage/v1/object/public/opportunity-images/opportunities/{filename}
```

## Troubleshooting

### Images not uploading

1. Check that buckets are created and set to **public**
2. Verify bucket names match exactly: `event-images` and `opportunity-images`
3. Check browser console for error messages
4. Verify Supabase URL and keys in `.env` file

### Images not displaying

1. Verify the bucket is set to **public**
2. Check the public URL format is correct
3. Ensure CORS is properly configured in Supabase
4. Check browser network tab for 404 or 403 errors

### Default images not working

1. Check browser console for canvas/blob errors
2. Verify the upload function has proper error handling
3. Ensure the `defaults/` folder path is correct

## Security Considerations

- Public buckets allow anyone to view images (required for public events/opportunities)
- Consider implementing rate limiting for uploads
- Monitor storage usage in Supabase dashboard
- Set up automatic cleanup for old/unused images
- Consider adding virus scanning for uploaded files

## Storage Costs

Supabase Storage pricing (as of 2024):
- Free tier: 1GB storage
- Pro tier: 100GB included, $0.021/GB beyond that
- Bandwidth: $0.09/GB

Monitor your usage in the Supabase dashboard under **Settings > Usage**.
