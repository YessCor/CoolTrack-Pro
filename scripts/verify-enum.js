// Verifica el estado REAL del enum en una conexión fresca
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const DATABASE_URL = envContent.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = neon(DATABASE_URL);

async function verify() {
  try {
    const result = await sql`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
      ORDER BY enumsortorder;
    `;
    console.log('Valores REALES en DB:', result.map(r => r.enumlabel).join(', '));
  } catch(e) {
    console.error('Error:', e.message);
  }
}
verify();
