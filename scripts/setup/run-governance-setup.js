import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runGovernanceSetup() {
  try {
    console.log('🚀 Running governance roles setup...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'governance-roles-setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error running governance setup:', error);
      process.exit(1);
    }
    
    console.log('✅ Governance roles setup completed successfully!');
    console.log('📊 Result:', data);
    
    // Verify the setup by checking if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['role_hierarchy', 'role_audit_log', 'moderation_log']);
    
    if (tablesError) {
      console.warn('⚠️  Could not verify table creation:', tablesError);
    } else {
      console.log('📋 Created tables:', tables?.map(t => t.table_name).join(', '));
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function runGovernanceSetupDirect() {
  try {
    console.log('🚀 Running governance roles setup (direct method)...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'governance-roles-setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.includes('SELECT ') && statement.includes('message')) {
        // Skip the final success message
        continue;
      }
      
      console.log('Executing:', statement.substring(0, 50) + '...');
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.warn('⚠️  Warning executing statement:', error.message);
        // Continue with other statements
      }
    }
    
    console.log('✅ Governance roles setup completed!');
    
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

// Run the setup
if (process.argv.includes('--direct')) {
  runGovernanceSetupDirect();
} else {
  runGovernanceSetup();
}