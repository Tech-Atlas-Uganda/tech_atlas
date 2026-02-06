# Database Setup Guide for Tech Atlas

## Current Status
❌ MySQL is not installed on your system
❌ Database connection failed

## Quick Setup Options

### Option 1: Install MySQL Locally (Recommended)

1. **Download MySQL**:
   - Go to https://dev.mysql.com/downloads/mysql/
   - Download MySQL Community Server for Windows
   - Choose the MSI Installer (mysql-installer-web-community-8.x.x.msi)

2. **Install MySQL**:
   - Run the installer
   - Choose "Developer Default" setup type
   - Set root password (remember this!)
   - Complete the installation

3. **Create Database and User**:
   ```sql
   -- Connect as root user
   mysql -u root -p
   
   -- Create database
   CREATE DATABASE techatlas;
   
   -- Create user (replace 'password' with a secure password)
   CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON techatlas.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
   -- Exit MySQL
   EXIT;
   ```

4. **Update .env file**:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/techatlas
   ```

### Option 2: Use XAMPP (Easier for Beginners)

1. **Download XAMPP**:
   - Go to https://www.apachefriends.org/download.html
   - Download XAMPP for Windows

2. **Install and Start**:
   - Install XAMPP
   - Open XAMPP Control Panel
   - Start "Apache" and "MySQL" services

3. **Create Database**:
   - Open http://localhost/phpmyadmin in browser
   - Click "New" to create database
   - Name it "techatlas"
   - Click "Create"

4. **Update .env file**:
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/techatlas
   ```

### Option 3: Use TiDB Cloud (Free, No Installation)

1. **Sign up**: Go to https://tidbcloud.com/
2. **Create Cluster**: Choose "Serverless" (free tier)
3. **Get Connection String**: Copy from dashboard
4. **Update .env file** with the provided connection string

### Option 4: Use SQLite (Simplest for Testing)

If you want to quickly test the platform without MySQL:

1. **Install SQLite support**:
   ```bash
   pnpm add better-sqlite3 @types/better-sqlite3
   ```

2. **Update .env file**:
   ```env
   DATABASE_URL=sqlite:./database.db
   ```

3. **Update drizzle.config.ts**:
   ```typescript
   import { defineConfig } from "drizzle-kit";
   
   export default defineConfig({
     schema: "./drizzle/schema.ts",
     out: "./drizzle",
     dialect: "sqlite", // Change from "mysql" to "sqlite"
     dbCredentials: {
       url: "./database.db",
     },
   });
   ```

## Next Steps After Database Setup

1. **Test Connection**:
   ```bash
   pnpm db:setup
   ```

2. **Create Tables**:
   ```bash
   pnpm db:push
   ```

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

## Recommended: Option 1 (MySQL) or Option 3 (TiDB Cloud)

For production-like development, use MySQL or TiDB Cloud.
For quick testing, XAMPP is the easiest option on Windows.

Choose the option that works best for your setup and let me know which one you'd like to proceed with!