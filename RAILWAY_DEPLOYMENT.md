# Deploy Tech Atlas to Railway

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to GitHub

### 2. Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/tech-atlas.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy on Railway

#### Option A: Using Railway Dashboard (Recommended)

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your tech-atlas repository**
5. **Railway will auto-detect the configuration**

#### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your project
railway link

# Deploy
railway up
```

### 4. Configure Environment Variables

In Railway Dashboard, go to your project → Variables tab and add:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:mxO1g6xlrBX5KGlb@db.opjxkfzofuqzijkvinzd.supabase.co:5432/postgres?sslmode=require

# Supabase
SUPABASE_URL=https://opjxkfzofuqzijkvinzd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhrZnpvZnVxemlqa3ZpbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjg5MTIsImV4cCI6MjA4NTc0NDkxMn0.MxKQQ9d4-iqu7jjY0_UiSC6qkKhRpIf9sBQVP4wbxOY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhrZnpvZnVxemlqa3ZpbnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE2ODkxMiwiZXhwIjoyMDg1NzQ0OTEyfQ.V0KPsUQ6TEJgTx4TATilRFlh9coZhBnydrRNU6T9wAo

# Frontend Variables
VITE_SUPABASE_URL=https://opjxkfzofuqzijkvinzd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhrZnpvZnVxemlqa3ZpbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjg5MTIsImV4cCI6MjA4NTc0NDkxMn0.MxKQQ9d4-iqu7jjY0_UiSC6qkKhRpIf9sBQVP4wbxOY

# JWT
JWT_SECRET=a7f8d9e2b4c6f1a3e5d7b9c2f4e6a8d0b3c5e7f9a1d3e5b7c9f1a3e5d7b9c2f4e6a8d0b3c5e7f9a1d3e5b7c9f1a3e5d7

# Email (Resend)
RESEND_API_KEY=re_HJANNjzG_BdKjV9JsTZg4rxAZY4awe7iu

# Analytics (Umami)
UMAMI_WEBSITE_ID=6667cb43-f103-4dfe-ade5-4c38c3126d0b
UMAMI_API_URL=https://cloud.umami.is
VITE_UMAMI_WEBSITE_ID=6667cb43-f103-4dfe-ade5-4c38c3126d0b
VITE_UMAMI_SRC=https://cloud.umami.is/script.js

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyA3P-krmZ77REOCln9EiECMqoiCBA-MxYw

# Node Environment
NODE_ENV=production
```

### 5. Configure Domain (Optional)

1. Go to Settings → Domains
2. Click "Generate Domain" for a free Railway domain
3. Or add your custom domain

### 6. Monitor Deployment

- Check the "Deployments" tab for build logs
- Once deployed, click the generated URL to view your app

## 🔧 Build Configuration

Railway will automatically detect:
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm start`
- **Port**: Auto-detected from your Express server

## 📊 What Gets Deployed

1. **Frontend**: React app built with Vite
2. **Backend**: Express server with tRPC
3. **Database**: Connected to Supabase PostgreSQL
4. **Algolia**: Search and AI chatbot integrated

## ⚙️ Post-Deployment

### Update Algolia Agent URLs
After deployment, update your Algolia agent configuration with the new Railway URL:
- Old: `http://localhost:3002`
- New: `https://your-app.railway.app`

### Test the Deployment
1. Visit your Railway URL
2. Test search bar functionality
3. Test Atlas AI chatbot
4. Check all pages load correctly

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### App Crashes on Start
- Check start logs
- Verify DATABASE_URL is correct
- Ensure all required env vars are set

### Database Connection Issues
- Verify Supabase connection string
- Check if Supabase allows Railway IP addresses
- Test connection locally first

### Environment Variables Not Working
- Make sure to use `VITE_` prefix for frontend variables
- Redeploy after adding new variables
- Check variable names match exactly

## 📝 Important Notes

1. **Free Tier**: Railway offers $5 free credit per month
2. **Sleep Mode**: Free tier apps may sleep after inactivity
3. **Build Time**: First build takes 3-5 minutes
4. **Auto Deploy**: Pushes to main branch trigger automatic deploys

## 🔄 Update Deployment

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys on push
```

## 🎯 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] Build completed successfully
- [ ] App accessible via Railway URL
- [ ] Search functionality working
- [ ] Atlas AI chatbot working
- [ ] Database connected
- [ ] All pages loading

## 🚀 You're Live!

Once deployed, share your Tech Atlas platform:
- **URL**: https://your-app.railway.app
- **Search**: Powered by Algolia
- **AI Chat**: Atlas AI with internet search
- **Database**: Supabase PostgreSQL

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Tech Atlas Issues: GitHub Issues
