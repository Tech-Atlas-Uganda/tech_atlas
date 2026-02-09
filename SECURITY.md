# Security Policy

## 🔒 Reporting Security Issues

If you discover a security vulnerability, please email: security@techatlasug.com

**Please do not** open public issues for security vulnerabilities.

## 🚨 Important Security Notes

### Secrets Management

**NEVER commit these to Git:**
- Database passwords
- API keys (Supabase, Resend, Google Maps, etc.)
- JWT secrets
- Service role keys
- Any credentials from `.env` file

### What to Do If Secrets Are Exposed

If you accidentally commit secrets:

1. **Immediately rotate all exposed credentials**:
   - Supabase: Generate new API keys in dashboard
   - Resend: Create new API key
   - JWT: Generate new secret
   - Database: Change password

2. **Remove from Git history**:
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or create a new repository
   ```

3. **Update all deployments** with new credentials

4. **Notify the team** if it's a shared project

### Supabase Security

Your Supabase credentials were exposed. **Action required**:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to**: Settings → API
3. **Reset** the following:
   - Service Role Key (most critical!)
   - Anon Key
4. **Change database password**:
   - Settings → Database → Reset database password
5. **Update** `.env` file with new credentials
6. **Redeploy** to Railway with new environment variables

### Resend API Key

If exposed:
1. Go to https://resend.com/api-keys
2. Delete the exposed key
3. Create a new API key
4. Update `.env` and Railway

### JWT Secret

If exposed:
1. Generate a new random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Update `.env`
3. Redeploy
4. Note: This will invalidate all existing user sessions

## ✅ Best Practices

### For Development

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Double-check before committing

2. **Use `.env.example` for templates**
   ```env
   DATABASE_URL=your_database_url_here
   SUPABASE_ANON_KEY=your_key_here
   ```

3. **Use environment variables in Railway**
   - Set in Railway dashboard
   - Never in code or docs

### For Documentation

1. **Use placeholders** in examples:
   ```env
   API_KEY=your_api_key_here
   DATABASE_URL=postgresql://user:password@host:5432/db
   ```

2. **Never include real credentials** in:
   - README files
   - Documentation
   - Code comments
   - Commit messages

### For Deployment

1. **Set secrets in Railway dashboard**
   - Variables tab
   - Never in railway.json

2. **Use different credentials** for:
   - Development
   - Staging
   - Production

3. **Rotate credentials regularly**
   - Every 90 days minimum
   - Immediately if exposed

## 🔐 Credential Checklist

Before committing, verify:
- [ ] No passwords in files
- [ ] No API keys in files
- [ ] No JWT secrets in files
- [ ] `.env` not committed
- [ ] Documentation uses placeholders
- [ ] No credentials in comments

## 📞 Contact

For security concerns: security@techatlasug.com

---

**Last Updated**: February 9, 2026  
**Security is everyone's responsibility!** 🔒
