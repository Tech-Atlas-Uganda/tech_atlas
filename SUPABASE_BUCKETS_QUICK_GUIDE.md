# Supabase Storage Buckets - Quick Visual Guide

## 🎯 Goal
Create 2 public storage buckets for image uploads

## 📋 Steps

### Step 1: Access Supabase Storage
```
1. Go to: https://supabase.com/dashboard
2. Select your Tech Atlas project
3. Click "Storage" in the left sidebar
```

### Step 2: Create First Bucket (Events)
```
1. Click the green "New bucket" button
2. Fill in the form:
   
   Bucket name: event-images
   [✓] Public bucket (MUST BE CHECKED!)
   
3. Click "Create bucket"
```

### Step 3: Create Second Bucket (Opportunities)
```
1. Click "New bucket" again
2. Fill in the form:
   
   Bucket name: opportunity-images
   [✓] Public bucket (MUST BE CHECKED!)
   
3. Click "Create bucket"
```

### Step 4: Verify Setup
```
You should now see 2 buckets in your Storage dashboard:

📦 event-images          [Public]
📦 opportunity-images    [Public]
```

## ✅ That's It!

Your image upload system is now ready to use.

## 🧪 Test It

1. Go to http://localhost:3003/events
2. Click "Add Event/Opportunity"
3. Submit an event:
   - WITH an image → Should upload successfully
   - WITHOUT an image → Should generate Tech Atlas branded default

## 🎨 What Default Images Look Like

### Event Default Image
```
┌─────────────────────────┐
│                         │
│   [Yellow/Amber         │
│    Gradient]            │
│                         │
│    TECH ATLAS           │
│      EVENT              │
│                         │
│        📅               │
│                         │
└─────────────────────────┘
```

### Opportunity Default Image
```
┌─────────────────────────┐
│                         │
│   [Green/Emerald        │
│    Gradient]            │
│                         │
│    TECH ATLAS           │
│    OPPORTUNITY          │
│                         │
│        🏆               │
│                         │
└─────────────────────────┘
```

## 🔍 Bucket Structure After Use

```
event-images/
├── events/
│   ├── 1709123456-abc123.jpg    ← User uploads
│   └── 1709123457-def456.png
└── defaults/
    └── default-event-1709123458.png    ← Generated defaults

opportunity-images/
├── opportunities/
│   ├── 1709123459-ghi789.jpg    ← User uploads
│   └── 1709123460-jkl012.png
└── defaults/
    └── default-opportunity-1709123461.png    ← Generated defaults
```

## ⚠️ Common Mistakes

### ❌ Bucket not public
```
Error: "Failed to upload image"
Fix: Edit bucket → Check "Public bucket"
```

### ❌ Wrong bucket name
```
Error: "Bucket not found"
Fix: Bucket names must be EXACTLY:
  - event-images
  - opportunity-images
```

### ❌ Forgot to create both buckets
```
Error: Events work but opportunities don't (or vice versa)
Fix: Create BOTH buckets
```

## 📊 Storage Limits

- **Free tier**: 1GB storage
- **File size limit**: 5MB per image
- **Supported formats**: PNG, JPG, JPEG, GIF, WebP

## 🎉 Success Indicators

When everything is working:
- ✅ Toast notification: "Image uploaded successfully!"
- ✅ Image appears on Events page
- ✅ No errors in browser console
- ✅ Refresh button works

## 🐛 Still Having Issues?

Check browser console (F12) for detailed logs:
- Look for 🚀 📤 ✅ ❌ emojis
- Error messages will show what went wrong
- Network tab shows upload requests

## 📚 More Info

- Full setup guide: `STORAGE_BUCKETS_SETUP.md`
- All fixes: `EVENTS_FIXES_SUMMARY.md`
- Next steps: `NEXT_STEPS.md`
