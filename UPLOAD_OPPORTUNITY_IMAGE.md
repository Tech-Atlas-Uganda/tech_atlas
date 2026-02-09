# Upload Default Opportunity Image

## Quick Steps

### 1. Generate the Image
Open `generate-opportunity-image.html` in your browser:
- The image will be generated automatically
- Click "Download PNG" to save it as `default-opportunity-1770670986986.png`

### 2. Upload to Supabase

#### Option A: Via Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/opjxkfzofuqzijkvinzd/storage/buckets/opportunity-images
2. Navigate to the `defaults` folder (create it if it doesn't exist)
3. Click "Upload File"
4. Select `default-opportunity-1770670986986.png`
5. Upload

#### Option B: Via Supabase CLI
```bash
supabase storage upload opportunity-images/defaults/default-opportunity-1770670986986.png ./default-opportunity-1770670986986.png
```

### 3. Verify the URL

The public URL should be:
```
https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770670986986.png
```

Test it by opening in browser - you should see a green gradient image with:
- "TECH ATLAS" text
- "OPPORTUNITY" text
- 🏆 trophy emoji

### 4. Bucket Configuration

Make sure the `opportunity-images` bucket is **public**:
1. Go to Storage settings
2. Find `opportunity-images` bucket
3. Set to "Public bucket"
4. Save

## Image Specifications

- **Size**: 400x300px
- **Format**: PNG
- **Colors**: Green (#34D399) to Emerald (#059669) gradient
- **Text**: "TECH ATLAS" and "OPPORTUNITY"
- **Icon**: 🏆 trophy emoji
- **Pattern**: White circles with 10% opacity for texture

## Already Configured

The AI Events Agent is already configured to use these default images:

**Events**: 
```
https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png
```

**Opportunities**: 
```
https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770670986986.png
```

## Testing

After uploading, test the AI agent:
1. Go to `/events` page
2. Use AI agent to find an opportunity
3. Submit it
4. Check if the opportunity has the green default image

---

**Note**: If the opportunity image doesn't exist yet, you can temporarily use the event image URL, or the system will work without an image until you upload it.
