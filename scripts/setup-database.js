#!/usr/bin/env node

/**
 * Database Setup Script for Tech Atlas Uganda
 * 
 * This script helps set up the database for production deployment.
 * It checks the database connection and creates tables if needed.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.log("\nPlease set DATABASE_URL in your .env file:");
  console.log("DATABASE_URL=postgresql://postgres:password@host:port/database");
  process.exit(1);
}

async function setupDatabase() {
  console.log("🚀 Setting up Tech Atlas database...\n");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);
    
    // Test connection with a simple query
    await client`SELECT 1 as test`;
    console.log("✅ Database connection successful");
    
    // Check if tables exist by trying to count users
    try {
      const result = await client`SELECT COUNT(*) as count FROM users LIMIT 1`;
      console.log("✅ Database tables already exist");
      console.log(`📊 Current user count: ${result[0].count}`);
    } catch (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log("⚠️  Database tables not found");
        console.log("\n📋 To create tables, run:");
        console.log("   pnpm db:push");
        console.log("\nOr manually run the migration files in the drizzle/ directory");
      } else {
        throw error;
      }
    }
    
    await client.end();
    
    console.log("\n🎉 Database setup check completed!");
    console.log("\n📚 Next steps:");
    console.log("1. Run 'pnpm db:push' to create/update tables");
    console.log("2. Run 'pnpm dev' to start the development server");
    console.log("3. Visit http://localhost:3000 to see your application");
    
  } catch (error) {
    console.error("❌ Database setup failed:");
    
    if (error.code === 'ENOTFOUND') {
      console.error("   Cannot resolve hostname - check your connection string");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("   Connection refused - check host and port");
    } else if (error.message.includes('password authentication failed')) {
      console.error("   Authentication failed - check your password");
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error("   Database does not exist - create it first");
    } else {
      console.error("  ", error.message);
    }
    
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Verify DATABASE_URL format: postgresql://user:pass@host:port/dbname");
    console.log("2. Ensure Supabase project is active and not paused");
    console.log("3. Check your Supabase password is correct");
    console.log("4. Verify network connectivity");
    console.log("\n📖 See SUPABASE_SETUP.md for detailed setup instructions");
    
    process.exit(1);
  }
}

// Run the setup
setupDatabase();