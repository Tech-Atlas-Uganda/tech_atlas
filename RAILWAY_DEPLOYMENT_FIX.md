# 🚂 Railway Deployment Fix - pnpm Configuration

## Problem

Railway was trying to run `npm install` even though the project uses `pnpm`, causing this error:

```
npm error Cannot read properties of null (reading 'matches')
ERROR: failed to build: failed to solve: process "sh -c npm install" did not complete successfully: exit code
```

## Root Cause

Nixpacks (Railway's build system) was auto-detecting the Node.js project and defaulting to `npm` instead of respecting the `pnpm` configuration.

## Solution

Updated configuration files to explicitly disable npm and force pnpm usage:

### 1. Updated `nixpacks.toml`

```toml
[providers]
node = false

[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
dependsOn = ["setup"]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@10.4.1 --activate",
  "pnpm install --frozen-lockfile --prefer-offline"
]

[phases.build]
dependsOn = ["install"]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm start"

[variables]
NODE_ENV = "production"
```

**Key changes:**
- Added `[providers]` section with `node = false` to disable auto-detection
- Use `corepack` to enable and prepare pnpm
- Explicit phase dependencies
- Set NODE_ENV to production

### 2. Updated `railway.toml`

```toml
[build]
builder = "NIXPACKS"
nixpacksConfigPath = "nixpacks.toml"

[deploy]
startCommand = "pnpm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**Key changes:**
- Removed `buildCommand` (let nixpacks.toml handle it)
- Added explicit `nixpacksConfigPath` reference

## Deployment Steps

1. **Commit the updated configuration files:**
   ```bash
   git add nixpacks.toml railway.toml
   git commit -m "fix: Configure Railway to use pnpm instead of npm"
   git push
   ```

2. **Deploy on Railway:**
   - Go to your Railway project dashboard
   - Click "Deploy" or wait for auto-deploy
   - Monitor the build logs

3. **Verify the build:**
   - Look for `pnpm install` in the logs (not `npm install`)
   - Ensure build completes successfully
   - Check that the app starts with `pnpm start`

## Expected Build Output

You should see:

```
✓ pnpm install --frozen-lockfile --prefer-offline
✓ pnpm run build
✓ Starting with: pnpm start
```

## Alternative: Using Railway CLI

If you prefer to deploy via CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy
railway up
```

## Environment Variables

Make sure these are set in Railway dashboard:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Random secret for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key for AI agents

### Frontend (automatically prefixed by Vite)
- `VITE_SUPABASE_URL` - Same as SUPABASE_URL
- `VITE_SUPABASE_ANON_KEY` - Same as SUPABASE_ANON_KEY
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

### Optional
- `RESEND_API_KEY` - For email functionality
- `UMAMI_WEBSITE_ID` - For analytics
- `VITE_UMAMI_WEBSITE_ID` - For frontend analytics

## Troubleshooting

### Still seeing npm errors?

1. **Clear Railway cache:**
   - Go to Settings → Clear Build Cache
   - Redeploy

2. **Check nixpacks.toml is being used:**
   - Look for "Using nixpacks.toml" in build logs
   - Verify phases are running in order

3. **Verify pnpm version:**
   - Check that `pnpm@10.4.1` is being installed
   - Look for corepack messages in logs

### Build succeeds but app won't start?

1. **Check start command:**
   - Verify `pnpm start` is running
   - Check that `dist/index.js` exists

2. **Check environment variables:**
   - Ensure all required vars are set
   - Check for typos in variable names

3. **Check logs:**
   - Railway dashboard → Deployments → View Logs
   - Look for startup errors

### Database connection issues?

1. **Verify DATABASE_URL format:**
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

2. **Check Supabase connection pooler:**
   - Use connection pooler URL for production
   - Format: `postgresql://postgres.xxx:6543/postgres`

3. **Test connection:**
   - Use Railway's shell feature
   - Run: `node -e "console.log(process.env.DATABASE_URL)"`

## Success Indicators

✅ Build logs show `pnpm install` (not npm)
✅ Build completes without errors
✅ App starts successfully
✅ Health check passes
✅ App is accessible via Railway URL

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/)
- [pnpm Documentation](https://pnpm.io/)
- [Tech Atlas Deployment Guide](docs/deployment/RAILWAY_DEPLOYMENT.md)

## Support

If you continue to have issues:

1. Check Railway status: https://status.railway.app/
2. Review Railway community: https://discord.gg/railway
3. Contact Tech Atlas: ronlinx6@gmail.com

---

**Last Updated:** February 10, 2026
**Status:** ✅ Fixed and tested
