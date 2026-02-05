# Quick Database Setup for Tech Atlas

## 🚀 Fastest Setup: SQLite (Recommended for Testing)

For the quickest setup to test the platform, use SQLite:

### Step 1: Install SQLite Support
```bash
pnpm add better-sqlite3 drizzle-orm
pnpm add -D @types/better-sqlite3
```

### Step 2: Update .env
```env
DATABASE_URL=sqlite:./database.db
```

### Step 3: Update drizzle.config.ts
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./database.db",
  },
});
```

### Step 4: Update server/db.ts
```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      const sqlite = new Database("./database.db");
      _db = drizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
```

### Step 5: Create Tables
```bash
pnpm db:push
```

### Step 6: Start Development
```bash
pnpm dev
```

## 🌟 Alternative: Use Supabase Database

If you want to use Supabase's database:

1. Go to your Supabase dashboard
2. Get your database connection string
3. Update .env: `DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`
4. Update drizzle.config.ts dialect to "postgresql"
5. Run `pnpm db:push`

## 🔧 Alternative: Local MySQL with XAMPP

1. Download XAMPP: https://www.apachefriends.org/
2. Install and start MySQL service
3. Create database "techatlas" in phpMyAdmin
4. Update .env: `DATABASE_URL=mysql://root:@localhost:3306/techatlas`
5. Run `pnpm db:push`

## ✅ What Works After Setup

- ✅ User authentication (via Supabase)
- ✅ All content submission forms
- ✅ Database storage for jobs, events, etc.
- ✅ Admin panel for content moderation
- ✅ Forum discussions
- ✅ User profiles and directory

## 🎯 Recommended Path

**For quick testing**: Use SQLite (Option 1)
**For production-like setup**: Use Supabase database
**For local development**: Use XAMPP MySQL

Choose SQLite for the fastest setup! The database file will be created automatically and you can start testing immediately.