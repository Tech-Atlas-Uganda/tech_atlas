# Local Setup Guide for Tech Atlas

This guide will help you set up and run Tech Atlas on your local machine for development purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install with `npm install -g pnpm`
- **MySQL** (v8 or higher) or **TiDB** - [MySQL Download](https://dev.mysql.com/downloads/) | [TiDB Cloud](https://tidbcloud.com/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Maps API Key** (optional, for map features) - [Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd tech_atlas
```

## Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required packages for both the frontend and backend.

## Step 3: Database Setup

### Option A: Using MySQL Locally

1. **Install MySQL** if you haven't already
2. **Create a database**:
   ```sql
   CREATE DATABASE tech_atlas;
   ```

3. **Create a MySQL user** (optional but recommended):
   ```sql
   CREATE USER 'tech_atlas_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON tech_atlas.* TO 'tech_atlas_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Option B: Using TiDB Cloud (Recommended)

1. Sign up for a free account at [TiDB Cloud](https://tidbcloud.com/)
2. Create a new cluster (Serverless tier is free)
3. Get your connection string from the dashboard

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/tech_atlas

# For TiDB Cloud, use the connection string provided:
# DATABASE_URL=mysql://user:password@gateway01.region.prod.aws.tidbcloud.com:4000/tech_atlas?ssl={"rejectUnauthorized":true}

# Authentication (generate random strings for these)
JWT_SECRET=your-super-secret-jwt-key-here-change-this
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

# Application Configuration
VITE_APP_ID=tech-atlas-local
VITE_APP_TITLE=Tech Atlas
VITE_APP_LOGO=/logo.png
OWNER_OPEN_ID=admin-local
OWNER_NAME=Admin

# Google Maps (Optional - only needed for map features)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

### Generating Secure Secrets

For `JWT_SECRET`, generate a random string:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Step 5: Initialize the Database

Push the database schema to your MySQL/TiDB instance:

```bash
pnpm db:push
```

This command will:
- Read the schema from `drizzle/schema.ts`
- Create all necessary tables
- Set up relationships and indexes

## Step 6: Seed Initial Data (Optional)

To populate the database with sample data for testing:

```bash
# Create a seed script (if not already present)
node scripts/seed.js
```

Or manually insert an admin user through MySQL:

```sql
INSERT INTO users (openId, name, email, role, loginMethod, createdAt, updatedAt)
VALUES ('admin-local', 'Admin User', 'admin@techatlas.ug', 'admin', 'local', NOW(), NOW());
```

## Step 7: Start the Development Server

```bash
pnpm dev
```

This will start:
- **Frontend**: React + Vite dev server
- **Backend**: Express + tRPC API server
- **Both running on**: `http://localhost:3000`

## Step 8: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Tech Atlas homepage with the sidebar navigation.

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Database Migrations

When you modify the schema in `drizzle/schema.ts`:

```bash
# Push changes to database
pnpm db:push

# Generate migration files (for production)
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

### Linting and Formatting

```bash
# Check for linting errors
pnpm lint

# Fix linting errors automatically
pnpm lint:fix

# Format code
pnpm format
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

1. **Find the process**:
   ```bash
   # Linux/Mac
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. **Kill the process** or change the port in `package.json`

### Database Connection Errors

**Error: "Access denied for user"**
- Check your `DATABASE_URL` credentials
- Ensure the MySQL user has proper permissions
- Verify the database exists

**Error: "Unknown database"**
- Create the database: `CREATE DATABASE tech_atlas;`
- Run `pnpm db:push` to create tables

**Error: "Connection timeout"**
- Check if MySQL/TiDB is running
- Verify firewall settings
- For TiDB Cloud, ensure your IP is whitelisted

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear pnpm cache if issues persist
pnpm store prune
pnpm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in your IDE
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check for type errors
pnpm tsc --noEmit
```

### Hot Reload Not Working

1. Check if you're running `pnpm dev`
2. Clear browser cache
3. Restart the dev server

## Project Structure

```
tech_atlas/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── App.tsx        # Main app component with routes
│   └── public/            # Static assets
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # API endpoints
│   ├── db.ts             # Database queries
│   └── _core/            # Core server functionality
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Table definitions
├── shared/               # Shared types and constants
└── storage/              # S3 storage helpers
```

## Key Features to Test

After setup, test these core features:

1. **Homepage** - Animated counters and feature cards
2. **Ecosystem** - View hubs, communities, startups with map
3. **Jobs & Gigs** - Browse and submit job listings
4. **Learning Hub** - Access resources and roadmaps
5. **Events** - View upcoming events
6. **Blog** - Read and create blog posts (requires auth)
7. **Forum** - Create threads and reply to discussions
8. **Talent Directory** - View user profiles
9. **Admin Panel** - Content moderation (admin role only)

## Authentication Notes

The local setup uses a simplified authentication system. In production, this integrates with a custom OAuth implementation.

**For local development:**
- Authentication is handled through the `/api/oauth/callback` endpoint
- You may need to manually insert a user in the database to test authenticated features
- Admin features require `role='admin'` in the users table

## Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- Check [README.md](./README.md) for project overview
- Review the [Code of Conduct](./CODE_OF_CONDUCT.md)

## Getting Help

If you encounter issues not covered in this guide:

1. Check existing [GitHub Issues](your-repo-url/issues)
2. Review the [README.md](./README.md) for additional context
3. Join our community forum at `/forum`
4. Contact the maintainers

## Production Deployment

For production deployment instructions, see the main [README.md](./README.md#deployment) file.

---

**Happy coding! 🚀**

Built with ❤️ by Uganda's tech community.
