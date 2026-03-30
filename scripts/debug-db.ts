const { neon } = require('@neondatabase/serverless');

// Use environment variable or direct URL for the script
const connectionString = 'postgresql://neondb_owner:npg_1CGmhayKD5SO@ep-muddy-mouse-an4tggw4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function debug() {
  console.log('--- [DEBUG-DB] STARTING AUDIT FOR TABLE: quotes ---');
  try {
    // 1. Check Column Defaults
    const cols = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'quotes' AND column_name = 'quote_number';
    `;
    console.log('1. COLUMN DEFAULT:', JSON.stringify(cols, null, 2));

    // 2. Check Triggers
    const triggers = await sql`
      SELECT trigger_name, action_statement, action_timing, event_manipulation 
      FROM information_schema.triggers 
      WHERE event_object_table = 'quotes';
    `;
    console.log('2. TRIGGERS:', JSON.stringify(triggers, null, 2));

    // 3. Search for any formatting triggers
    const triggerFuncs = await sql`
      SELECT p.proname as function_name, p.prosrc as source_code
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.prosrc ILIKE '%COT-%';
    `;
    console.log('3. FUNCTIONS WITH COT-:', JSON.stringify(triggerFuncs, null, 2));

    console.log('--- [DEBUG-DB] AUDIT COMPLETE ---');
  } catch (error) {
    console.error('--- [DEBUG-DB] AUDIT FAILED ---:', error.message);
  }
}

debug();
