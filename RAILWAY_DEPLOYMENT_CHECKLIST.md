# Railway Deployment Checklist ✅

## 🎯 Pre-Deployment Checklist

### ✅ Code Ready
- [x] All AI agents implemented (4 agents)
- [x] Build scripts configured in package.json
- [x] Start script configured
- [x] No TypeScript errors
- [x] No linting errors
- [x] All dependencies in package.json

### ✅ Environment Variables Ready
- [x] `.env` file configured locally
- [ ] Need to add to Railway (see below)

### ✅ Database Ready
- [x] Supabase PostgreSQL configured
- [x] Connection string available
- [x] Tables created
- [x] Storage buckets configured

### ✅ External Services Ready
- [x] Supabase (Database + Storage)
- [x] Resend (Email)
- [x] Gemini AI (API Key)
- [x] Google Maps (API Key)
- [x] Algolia (Search - if configured)

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment with 4 AI agents"

# Push to GitHub
git push origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect Node.js

### Step 3: Configure Environment Variables

In Railway Dashboard → Variables, add these:

#### Database (Required)
```env
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require
```

#### Supabase (Required)
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Frontend URLs (Required)
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### Authentication (Required)
```env
JWT_SECRET=your_jwt_secret_here
```

#### Email (Required for notifications)
```env
RESEND_API_KEY=your_resend_api_key
```

#### AI Features (Required for AI agents)
```env
GEMINI_API_KEY=your_gemini_api_key
```

#### Google Maps (Optional)
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

#### Analytics (Optional)
```env
UMAMI_WEBSITE_ID=your_umami_id
UMAMI_API_URL=https://cloud.umami.is
VITE_UMAMI_WEBSITE_ID=your_umami_id
VITE_UMAMI_SRC=https://cloud.umami.is/script.js
```

#### Algolia (Optional - if using search)
```env
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_API_KEY=your_search_key
VITE_ALGOLIA_INDEX_NAME=your_index_name
```

### Step 4: Configure Build Settings

Railway should auto-detect:
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm start`
- **Port**: Auto-detected (3000)

If not, set manually in Settings → Build.

### Step 5: Deploy

1. Click "Deploy" or push to GitHub
2. Wait for build (3-5 minutes)
3. Check deployment logs
4. Once deployed, click the URL

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase CORS

Add your Railway URL to Supabase allowed origins:
1. Go to Supabase Dashboard
2. Settings → API
3. Add Railway URL to CORS allowed origins

### 2. Test All Features

- [ ] Homepage loads
- [ ] Search works
- [ ] Map displays
- [ ] Events page loads
- [ ] Jobs page loads
- [ ] Learning page loads
- [ ] AI Resource Agent works
- [ ] AI Events Agent works
- [ ] AI Opportunities Agent works
- [ ] AI Jobs Agent works
- [ ] User authentication works
- [ ] Image uploads work
- [ ] Forms submit correctly

### 3. Update Frontend URL (if needed)

If you have a custom domain, update:
```env
FRONTEND_URL=https://your-domain.com
VITE_OAUTH_PORTAL_URL=https://your-domain.com
```

---

## 📊 What Gets Deployed

### Frontend
- ✅ React app (Vite build)
- ✅ All pages and components
- ✅ 4 AI agent components
- ✅ Static assets (images, fonts)

### Backend
- ✅ Express server
- ✅ tRPC API routes
- ✅ 4 AI agent API endpoints
- ✅ Authentication
- ✅ Database connections

### AI Agents
- ✅ Learning Resources Agent (`/api/ai-resource-agent`)
- ✅ Events Agent (`/api/ai-events-agent`)
- ✅ Opportunities Agent (`/api/ai-events-agent`)
- ✅ Jobs Agent (`/api/ai-jobs-agent`)

---

## ⚠️ Important Notes

### 1. Environment Variables
- Use `VITE_` prefix for frontend variables
- Redeploy after adding new variables
- Never commit `.env` to GitHub

### 2. Database
- Supabase connection must allow Railway IPs
- Test connection before deploying
- Ensure all tables are created

### 3. Storage
- Supabase storage buckets must be public
- Image URLs must be accessible
- Test image uploads after deployment

### 4. AI Agents
- Gemini API key must be valid
- Check API quota limits
- Test each agent after deployment

### 5. Build Time
- First build: 3-5 minutes
- Subsequent builds: 2-3 minutes
- Check logs if build fails

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- All dependencies in package.json
- No TypeScript errors locally
- Build command is correct
- Node version compatible

**Fix:**
```bash
# Test build locally
pnpm run build

# Check for errors
pnpm run check
```

### App Crashes on Start

**Check:**
- DATABASE_URL is correct
- All required env vars are set
- Start command is correct

**Fix:**
- Check Railway logs
- Verify environment variables
- Test locally with production build

### Database Connection Issues

**Check:**
- Supabase connection string
- Railway IP allowed in Supabase
- SSL mode enabled

**Fix:**
```env
# Ensure sslmode=require
DATABASE_URL=postgresql://...?sslmode=require
```

### AI Agents Not Working

**Check:**
- GEMINI_API_KEY is set
- API key is valid
- Check Railway logs for errors

**Fix:**
- Verify API key in Railway variables
- Test API key locally first
- Check Gemini API quota

### Images Not Loading

**Check:**
- Supabase storage buckets are public
- CORS configured correctly
- Image URLs are accessible

**Fix:**
- Make buckets public in Supabase
- Add Railway URL to CORS
- Test image URLs in browser

---

## ✅ Deployment Success Checklist

### Core Features
- [ ] App accessible via Railway URL
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Search functionality works
- [ ] Forms submit successfully

### AI Agents
- [ ] Learning Resources Agent works
- [ ] Events Agent works
- [ ] Opportunities Agent works
- [ ] Jobs Agent works
- [ ] All agents find and submit content
- [ ] No duplicate submissions

### Database
- [ ] Data loads from Supabase
- [ ] New submissions save correctly
- [ ] User authentication works
- [ ] Profile updates work

### Storage
- [ ] Images load correctly
- [ ] Image uploads work
- [ ] Default images display
- [ ] Opportunity image shows (green)

### External Services
- [ ] Email notifications work (Resend)
- [ ] Google Maps displays
- [ ] Algolia search works (if configured)
- [ ] Analytics tracking (if configured)

---

## 🎉 You're Live!

Once all checks pass:

1. **Share your URL**: `https://your-app.railway.app`
2. **Test all AI agents**
3. **Monitor Railway logs**
4. **Check Supabase usage**
5. **Monitor Gemini API quota**

---

## 📈 Monitoring

### Railway Dashboard
- Check deployment status
- Monitor resource usage
- View logs
- Check metrics

### Supabase Dashboard
- Monitor database usage
- Check storage usage
- View API requests
- Check auth users

### Gemini API
- Monitor API usage
- Check quota limits
- View request logs

---

## 🔄 Updates

To update your deployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys
```

---

## 📞 Support

- **Railway**: https://docs.railway.app
- **Supabase**: https://supabase.com/docs
- **Gemini AI**: https://ai.google.dev/docs

---

**Status**: ✅ Ready for Railway Deployment
**AI Agents**: 4 agents ready
**Date**: February 10, 2026
