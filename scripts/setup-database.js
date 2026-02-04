#!/usr/bin/env node

/**
 * Database Setup Script for Tech Atlas Uganda
 * 
 * This script helps set up the database for production deployment.
 * It checks the database connection and creates tables if needed.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.log("\nPlease set DATABASE_URL in your .env file:");
  console.log("DATABASE_URL=mysql://username:password@host:port/database");
  process.exit(1);
}

async function setupDatabase() {
  console.log("🚀 Setting up Tech Atlas database...\n");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    const connection = await mysql.createConnection(DATABASE_URL);
    await connection.ping();
    console.log("✅ Database connection successful");
    
    // Initialize Drizzle
    const db = drizzle(connection);
    
    // Check if tables exist by trying to count users
    try {
      const result = await connection.execute("SELECT COUNT(*) as count FROM users LIMIT 1");
      console.log("✅ Database tables already exist");
      console.log(`📊 Current user count: ${result[0][0].count}`);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log("⚠️  Database tables not found");
        console.log("\n📋 To create tables, run:");
        console.log("   pnpm db:push");
        console.log("\nOr manually run the migration files in the drizzle/ directory");
      } else {
        throw error;
      }
    }
    
    await connection.end();
    
    console.log("\n🎉 Database setup check completed!");
    console.log("\n📚 Next steps:");
    console.log("1. Run 'pnpm db:push' to create/update tables");
    console.log("2. Run 'pnpm dev' to start the development server");
    console.log("3. Visit http://localhost:3000 to see your application");
    
  } catch (error) {
    console.error("❌ Database setup failed:");
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("   Access denied - check your username and password");
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error("   Cannot connect to database server - check host and port");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("   Database does not exist - create it first");
    } else {
      console.error("  ", error.message);
    }
    
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Verify DATABASE_URL format: mysql://user:pass@host:port/dbname");
    console.log("2. Ensure database server is running");
    console.log("3. Check firewall and network settings");
    console.log("4. Verify database and user exist");
    console.log("\n📖 See LOCAL_SETUP.md for detailed setup instructions");
    
    process.exit(1);
  }
}

// Run the setup
setupDatabase();