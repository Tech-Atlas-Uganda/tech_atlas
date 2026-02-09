# 🔑 How to Get Your Gemini API Key

## Quick Steps (Takes 1 Minute!)

### 1. Go to Google AI Studio
**URL**: https://aistudio.google.com/apikey

### 2. Sign In
- Use your Google account
- Any Gmail account works

### 3. Create API Key
- Click **"Create API Key"** button
- Choose **"Create API key in new project"** (recommended)
- Or select an existing Google Cloud project

### 4. Copy Your Key
- Your API key will look like: `AIzaSy...` (about 39 characters)
- Click the **copy icon** to copy it

### 5. Add to Your .env File
Open your `.env` file and replace this line:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual key:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 6. Restart Your Server
```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
pnpm dev
```

### 7. Test It!
- Go to http://localhost:3000/dashboard
- Click "Generate AI Infographic"
- Select an infographic type
- It should generate successfully! 🎉

---

## ✅ Free Tier Limits

Gemini 2.0 Flash has a **generous free tier**:
- **15 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**

This is more than enough for development and even production use!

---

## 🔒 Security Notes

1. **Never commit your API key to Git**
   - It's already in `.gitignore`
   - The `.env` file is safe

2. **Keep it secret**
   - Don't share your API key
   - Don't post it in screenshots

3. **Rotate if exposed**
   - If accidentally exposed, delete it in AI Studio
   - Create a new one

---

## 🐛 Troubleshooting

### "API key must be set" Error
- Make sure you replaced `your_gemini_api_key_here` with your actual key
- Check there are no extra spaces
- Restart your server after adding the key

### "Invalid API key" Error
- Double-check you copied the entire key
- Make sure it starts with `AIza`
- Try creating a new API key

### "Quota exceeded" Error
- You've hit the free tier limit
- Wait a few minutes and try again
- Or upgrade to paid tier (not usually needed)

---

## 📖 More Info

- **Google AI Studio**: https://aistudio.google.com
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing

---

## 🎉 That's It!

Once you add your API key and restart the server, the infographic generator will work perfectly!

**Questions?** Check the troubleshooting section above or ask me! 🚀
