# Get Opportunity Image URL - Quick Guide

## 🎯 Goal
Generate and get the actual URL for the default opportunity image by creating a test opportunity.

## 📋 Steps

### Method 1: Use the AI Agent (Recommended)

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Go to Events page**:
   ```
   http://localhost:3000/events
   ```

3. **Use AI Agent**:
   - Find the purple "AI Events & Opportunities Agent" card
   - Click the **"Opportunities"** tab (green)
   - Enter query: `test opportunity`
   - Click "Find"
   - Wait for AI to find something

4. **Submit the opportunity**:
   - Review the auto-filled data
   - Click "Submit Opportunity"
   - Watch the console logs

5. **Check the console**:
   ```
   📤 Uploading default opportunity image to opportunity-images/defaults/...
   ✅ Default image uploaded: https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-TIMESTAMP.png
   ```

6. **Copy the URL** from the console log

---

### Method 2: Use the Manual Form

1. **Go to Events page**:
   ```
   http://localhost:3000/events
   ```

2. **Click "Add Event/Opportunity"** button

3. **Select "Opportunity"**

4. **Fill the form**:
   - Title: `Test Opportunity`
   - Description: `Test description`
   - Type: `Grant`
   - Category: `Web Development`
   - Provider: `Test Provider`
   - Deadline: (any future date)
   - **Don't upload an image** (let it generate default)

5. **Submit the form**

6. **Check the console**:
   ```
   📤 Uploading default opportunity image to opportunity-images/defaults/...
   ✅ Default image uploaded: https://...
   ```

7. **Copy the URL** from the console log

---

### Method 3: Check Supabase Storage

1. **Go to Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/opjxkfzofuqzijkvinzd/storage/buckets/opportunity-images
   ```

2. **Navigate to `defaults` folder**

3. **Find the most recent file**:
   - Look for: `default-opportunity-TIMESTAMP.png`
   - Click on it

4. **Copy the public URL**:
   ```
   https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-TIMESTAMP.png
   ```

---

## 🖼️ What the Image Looks Like

The generated opportunity image has:
- **Size**: 400x300px
- **Background**: Green to Emerald gradient (#34D399 → #059669)
- **Text**: "TECH ATLAS" (bold, 32px)
- **Text**: "OPPORTUNITY" (18px)
- **Icon**: 🏆 trophy emoji (48px)
- **Pattern**: White circles with 10% opacity

---

## ✅ Verify the Image

Once you have the URL, test it:

1. **Open in browser**:
   - Paste the URL in browser
   - Should see green gradient image with "TECH ATLAS OPPORTUNITY" and 🏆

2. **Check in Events page**:
   - Go to `/events`
   - Find the opportunity you just created
   - Should show the green default image

---

## 📝 Update the Code (Optional)

If you want to use a static URL instead of generating each time:

1. **Get the URL** from one of the methods above

2. **Update `AIEventsAgent.tsx`**:
   ```typescript
   // Replace the fallback URLs with your actual URL
   const fallbackUrl = type === 'event' 
     ? 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png'
     : 'YOUR_ACTUAL_OPPORTUNITY_IMAGE_URL_HERE';
   ```

---

## 🎯 Current Behavior

The AI agent now:
1. ✅ Generates a fresh default image each time
2. ✅ Uploads to Supabase Storage
3. ✅ Uses the uploaded image URL
4. ✅ Falls back to hardcoded URL if upload fails
5. ✅ Shows toast notification during generation

---

## 🐛 Troubleshooting

### "Failed to upload default image"
- Check Supabase credentials in `.env`
- Verify `opportunity-images` bucket exists
- Check bucket is public
- Check you have write permissions

### "Image not showing"
- Check the URL in browser
- Verify bucket is public
- Check CORS settings in Supabase
- Try refreshing the page

### "Upload error"
- Check console logs for details
- Verify Supabase connection
- Check storage quota
- Try manual upload via dashboard

---

## 📊 Expected Console Output

When submitting via AI agent:
```
🤖 AI Agent searching for opportunity: test opportunity
✅ AI Agent found opportunity: Test Opportunity Name
ℹ️ Generating opportunity image...
📤 Uploading default opportunity image to opportunity-images/defaults/default-opportunity-1770671234567.png
✅ Default image uploaded: https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770671234567.png
✅ Opportunity added successfully!
```

---

## 🎉 Success!

Once you have the URL, you can:
- ✅ Use it in documentation
- ✅ Share it with team
- ✅ Update fallback URLs in code
- ✅ Verify all opportunities have images

---

**Quick Test**: Just submit one opportunity via AI agent and check the console! 🚀
