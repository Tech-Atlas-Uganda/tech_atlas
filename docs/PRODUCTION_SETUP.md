# Production Setup Guide

This guide covers setting up Tech Atlas Uganda for production deployment.

## Prerequisites

- Node.js 18+ 
- MySQL 8+ or compatible database (TiDB, PlanetScale, etc.)
- Domain name (optional)
- SSL certificate (recommended)

## Database Setup

### 1. Create Production Database

**Option A: MySQL**
```sql
CREATE DATABASE tech_atlas_prod;
CREATE USER 'tech_atlas'@'%' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON tech_atlas_prod.* TO 'tech_atlas'@'%';
FLUSH PRIVILEGES;
```

**Option B: Cloud Database (Recommended)**
- [PlanetScale](https://planetscale.com/) - MySQL-compatible, serverless
- [TiDB Cloud](https://tidbcloud.com/) - MySQL-compatible, free tier
- [AWS RDS](https://aws.amazon.com/rds/) - Managed MySQL
- [Google Cloud SQL](https://cloud.google.com/sql) - Managed MySQL

### 2. Configure Environment Variables

Create a `.env` file with production values:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@host:port/database

# Authentication (generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-256-bits-long
OWNER_OPEN_ID=your-admin-user-id
OWNER_NAME=Admin User

# Application Configuration
VITE_APP_ID=tech-atlas-uganda
VITE_APP_TITLE=Tech Atlas Uganda
VITE_APP_LOGO=/logo.png

# Optional: Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Optional: Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 3. Test Database Connection

```bash
# Test database setup
pnpm db:setup

# Create/update database tables
pnpm db:push
```

## Deployment Options

### Option 1: Traditional VPS/Server

1. **Install dependencies**:
   ```bash
   pnpm install --production
   ```

2. **Build the application**:
   ```bash
   pnpm build
   ```

3. **Start the production server**:
   ```bash
   pnpm start
   ```

4. **Set up process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "tech-atlas"
   pm2 startup
   pm2 save
   ```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t tech-atlas .
docker run -p 3000:3000 --env-file .env tech-atlas
```

### Option 3: Platform-as-a-Service

**Vercel** (Recommended for frontend + serverless):
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

**Railway**:
1. Connect repository
2. Add MySQL service
3. Set environment variables
4. Deploy

**Render**:
1. Connect repository  
2. Add PostgreSQL/MySQL service
3. Set environment variables
4. Deploy

## SSL/HTTPS Setup

### Using Nginx (Recommended)

1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx** (`/etc/nginx/sites-available/tech-atlas`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/tech-atlas /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Add SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | ✅ | JWT signing secret (256-bit) | `your-secret-key` |
| `OWNER_OPEN_ID` | ✅ | Admin user identifier | `admin-user-123` |
| `OWNER_NAME` | ✅ | Admin user display name | `Admin User` |
| `VITE_APP_ID` | ✅ | Application identifier | `tech-atlas-uganda` |
| `VITE_APP_TITLE` | ✅ | Application title | `Tech Atlas Uganda` |
| `VITE_APP_LOGO` | ✅ | Logo path | `/logo.png` |
| `VITE_GOOGLE_MAPS_API_KEY` | ❌ | Google Maps API key | `AIza...` |
| `VITE_ANALYTICS_ENDPOINT` | ❌ | Analytics endpoint | `https://analytics.example.com` |
| `VITE_ANALYTICS_WEBSITE_ID` | ❌ | Analytics website ID | `website-123` |

## Security Checklist

- [ ] Use strong, unique passwords for database
- [ ] Enable SSL/HTTPS
- [ ] Set secure JWT secret (256-bit random)
- [ ] Configure firewall (only allow necessary ports)
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)

## Performance Optimization

1. **Database Indexing**:
   - Indexes are defined in `drizzle/schema.ts`
   - Monitor slow queries

2. **Caching**:
   - Consider Redis for session storage
   - CDN for static assets

3. **Monitoring**:
   - Set up application monitoring
   - Database performance monitoring
   - Uptime monitoring

## Backup Strategy

1. **Database Backups**:
   ```bash
   # Daily backup script
   mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
   ```

2. **File Backups**:
   - Application code (Git repository)
   - Environment configuration
   - User uploads (if any)

## Troubleshooting

### Database Connection Issues

1. **Check connection string format**
2. **Verify database server is running**
3. **Check firewall rules**
4. **Verify user permissions**

### Application Won't Start

1. **Check environment variables**
2. **Verify build completed successfully**
3. **Check port availability**
4. **Review application logs**

### Performance Issues

1. **Monitor database queries**
2. **Check server resources (CPU, memory)**
3. **Review application logs for errors**
4. **Consider scaling options**

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple application instances
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add caching layers

## Support

For production deployment support:
- Review [LOCAL_SETUP.md](./LOCAL_SETUP.md) for development setup
- Check [GitHub Issues](https://github.com/your-repo/issues) for known issues
- Contact the development team

---

**Production deployment checklist complete! 🚀**

Your Tech Atlas Uganda platform is ready to serve Uganda's tech community.