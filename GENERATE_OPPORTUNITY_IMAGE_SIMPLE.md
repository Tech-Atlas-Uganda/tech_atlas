# Generate Opportunity Image - Simple Guide

## 🎯 Quick Steps

### 1. Go to the Generator Page
```
http://localhost:3000/tools/generate-opportunity-image
```

### 2. Generate the Image
- Click **"Generate Image"** button
- You'll see a green gradient image with "TECH ATLAS OPPORTUNITY" and 🏆

### 3. Upload to Supabase
- Click **"Upload to Supabase"** button
- Wait for success message
- Copy the URL that appears

### 4. Update the AI Agent
Open `client/src/components/AIEventsAgent.tsx` and find this line:
```typescript
const defaultOpportunityImage = 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png';
```

Replace it with your new URL:
```typescript
const defaultOpportunityImage = 'YOUR_NEW_URL_HERE';
```

### 5. Test It
- Go to `/events` page
- Click "Opportunities" tab in AI agent
- Search for an opportunity
- Submit it
- Check if it has the green image!

---

## 🖼️ What You'll See

The generated image has:
- **Green to Emerald gradient** background
- **"TECH ATLAS"** text (bold, white)
- **"OPPORTUNITY"** text (white)
- **🏆 trophy emoji**
- **400x300px** size

---

## 🐛 Troubleshooting

### "Upload failed"
- Check if `opportunity-images` bucket exists in Supabase
- Make sure bucket is **public**
- Check your Supabase credentials in `.env`

### "Bucket not found"
1. Go to Supabase Dashboard
2. Storage → Create bucket → `opportunity-images`
3. Make it **public**
4. Try again

### Image not showing after upload
- Check the URL in browser
- Verify bucket is public
- Refresh the events page

---

## ✅ Current Status

Right now, the AI agent uses the **event image** (yellow) for both events and opportunities.

After you upload the green opportunity image and update the code:
- ✅ Events will have **yellow/amber** image
- ✅ Opportunities will have **green/emerald** image

---

## 🚀 Quick Test

1. Start server: `npm run dev`
2. Go to: `http://localhost:3000/tools/generate-opportunity-image`
3. Click "Generate Image"
4. Click "Upload to Supabase"
5. Copy the URL
6. Update `AIEventsAgent.tsx`
7. Test on `/events` page!

---

**That's it!** Simple 5-step process to get the green opportunity image working. 🎉
