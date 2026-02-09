import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

async function setupGovernance() {
  let client;
  
  try {
    console.log('🚀 Connecting to database...');
    
    // Create postgres client
    client = postgres(databaseUrl);
    
    console.log('📖 Reading governance setup SQL...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'governance-roles-setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('⚡ Executing governance setup...');
    
    // Execute the SQL directly
    const result = await client.unsafe(sqlContent);
    
    console.log('✅ Governance roles setup completed successfully!');
    console.log('📊 Setup result:', result);
    
    // Test the setup by querying the role hierarchy
    console.log('🔍 Verifying setup...');
    
    try {
      const roles = await client`
        SELECT roleName, displayName, level 
        FROM role_hierarchy 
        ORDER BY level ASC
      `;
      
      console.log('📋 Role hierarchy created:');
      roles.forEach(role => {
        console.log(`  ${role.level}. ${role.displayname} (${role.rolename})`);
      });
      
    } catch (verifyError) {
      console.warn('⚠️  Could not verify role hierarchy:', verifyError.message);
    }
    
    // Check if admin user was updated
    try {
      const adminUsers = await client`
        SELECT name, email, role 
        FROM users 
        WHERE role IN ('admin', 'core_admin')
      `;
      
      console.log('👑 Admin users:');
      adminUsers.forEach(user => {
        console.log(`  ${user.name || user.email} - ${user.role}`);
      });
      
    } catch (adminError) {
      console.warn('⚠️  Could not verify admin users:', adminError.message);
    }
    
  } catch (error) {
    console.error('💥 Error setting up governance:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
setupGovernance();