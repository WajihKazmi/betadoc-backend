import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Read Supabase URL and key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sqlPath = path.join(process.cwd(), 'schema_update.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Split SQL file into individual statements
const statements = sql
  .replace(/--.*\n/g, '') // Remove comments
  .split(';')
  .filter(statement => statement.trim().length > 0);

/**
 * Execute SQL statements
 */
async function runSchemaUpdate() {
  console.log('🚀 Starting database schema update...');
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    console.log(`\n[${i + 1}/${statements.length}] Executing SQL statement:`);
    console.log(statement.substring(0, 80) + (statement.length > 80 ? '...' : ''));
    
    try {
      const { data, error } = await supabase.rpc('pgclient', { query: statement });
      
      if (error) {
        console.error(`❌ Error executing statement: ${error.message}`);
        // Continue anyway to try other statements
      } else {
        console.log('✅ Statement executed successfully');
      }
    } catch (err) {
      console.error(`❌ Exception executing statement: ${err.message}`);
      // Continue anyway to try other statements
    }
  }
  
  console.log('\n🎉 Schema update completed!');
  console.log('Note: Some statements may have failed if they were already executed before.');
}

// Run the schema update
runSchemaUpdate().catch(error => {
  console.error('Error updating schema:', error);
});
