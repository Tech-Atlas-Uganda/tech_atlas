# Railway Configuration Files

## 📁 Files Created

### 1. `railway.toml` (Recommended)
The main Railway configuration file using TOML format.

```toml
[build]
builder = "NIXPACKS"
buildCommand = "pnpm install && pnpm run build"

[deploy]
startCommand = "pnpm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**What it does**:
- Tells Railway to use NIXPACKS builder
- Specifies build command
- Specifies start command
- Configures restart policy

### 2. `railway.json` (Alternative)
JSON format configuration (older format, but still supported).

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm run build"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. `nixpacks.toml` (Optional)
More detailed Nixpacks configuration.

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]

[phases.install]
cmds = ["pnpm install --frozen-lockfile"]

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm start"
```

**What it does**:
- Specifies Node.js version (18.x)
- Ensures pnpm is available
- Uses frozen lockfile for reproducible builds
- Defines build and start commands

---

## 🎯 Which File to Use?

### Option 1: Auto-Detection (No Config File)
Railway will automatically detect your Node.js project and use:
- Build: `pnpm install && pnpm run build`
- Start: `pnpm start`

**Pros**: Simple, no config needed
**Cons**: Less control

### Option 2: railway.toml (Recommended)
Use `railway.toml` for explicit configuration.

**Pros**: 
- Clear configuration
- Railway's preferred format
- Easy to read and modify

**Cons**: None

### Option 3: railway.json + nixpacks.toml
Use both for maximum control.

**Pros**: 
- Full control over build process
- Specify Node.js version
- Reproducible builds

**Cons**: More files to maintain

---

## 🚀 What Railway Does

### Build Phase
1. Detects Node.js project
2. Installs pnpm
3. Runs `pnpm install`
4. Runs `pnpm run build`
5. Creates production bundle

### Deploy Phase
1. Starts app with `pnpm start`
2. Exposes port (auto-detected)
3. Monitors health
4. Restarts on failure

---

## 📊 Configuration Options

### Build Options
```toml
[build]
builder = "NIXPACKS"           # Use Nixpacks builder
buildCommand = "..."           # Custom build command
watchPatterns = ["src/**"]     # Files to watch for rebuilds
```

### Deploy Options
```toml
[deploy]
startCommand = "..."                    # Command to start app
restartPolicyType = "ON_FAILURE"        # When to restart
restartPolicyMaxRetries = 10            # Max restart attempts
healthcheckPath = "/health"             # Health check endpoint
healthcheckTimeout = 300                # Timeout in seconds
```

### Environment Variables
Set in Railway Dashboard, not in config files:
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- etc.

---

## 🔧 Customization

### Change Node.js Version
Edit `nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["nodejs-20_x", "pnpm"]  # Use Node 20
```

### Add Build Steps
Edit `nixpacks.toml`:
```toml
[phases.build]
cmds = [
  "pnpm run build",
  "pnpm run db:push"  # Run migrations
]
```

### Custom Start Command
Edit `railway.toml`:
```toml
[deploy]
startCommand = "node dist/index.js"  # Direct node command
```

---

## ⚠️ Important Notes

### 1. Don't Commit Secrets
- Never put API keys in config files
- Use Railway environment variables
- Keep `.env` in `.gitignore`

### 2. Build Command
- Must create `dist/` folder
- Must bundle server code
- Must be production-ready

### 3. Start Command
- Must start the server
- Must listen on Railway's PORT
- Must handle graceful shutdown

### 4. Port Configuration
Railway automatically sets `PORT` environment variable.
Your server should use:
```javascript
const port = process.env.PORT || 3000;
```

---

## 🧪 Testing Locally

### Test Build
```bash
pnpm run build
```

### Test Start
```bash
pnpm start
```

### Test Full Flow
```bash
# Clean install
rm -rf node_modules dist
pnpm install --frozen-lockfile

# Build
pnpm run build

# Start
pnpm start
```

---

## 📝 File Priority

Railway checks files in this order:
1. `railway.toml` (highest priority)
2. `railway.json`
3. `nixpacks.toml`
4. Auto-detection (lowest priority)

**Recommendation**: Use `railway.toml` for simplicity.

---

## ✅ Current Configuration

Your Tech Atlas app is configured with:

### Build
- **Command**: `pnpm install && pnpm run build`
- **Output**: `dist/` folder
- **Time**: ~3-5 minutes

### Start
- **Command**: `pnpm start`
- **Entry**: `dist/index.js`
- **Port**: Auto-detected

### Features
- ✅ Auto-restart on failure
- ✅ Max 10 restart attempts
- ✅ Nixpacks builder
- ✅ pnpm package manager

---

## 🎯 Deployment Checklist

- [x] `railway.toml` created
- [x] `railway.json` created (backup)
- [x] `nixpacks.toml` created (optional)
- [x] Build command configured
- [x] Start command configured
- [x] Restart policy set
- [ ] Push to GitHub
- [ ] Deploy on Railway
- [ ] Add environment variables
- [ ] Test deployment

---

## 🚀 Deploy Now

```bash
# Commit config files
git add railway.toml railway.json nixpacks.toml
git commit -m "Add Railway configuration files"
git push origin main

# Railway will auto-deploy
```

---

**Status**: ✅ Configuration files ready
**Recommended**: Use `railway.toml`
**Optional**: Keep `nixpacks.toml` for Node version control
