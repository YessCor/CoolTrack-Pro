// Fix del enum usando neonConfig para deshabilitar fetch (conexión directa via WebSocket)
// ADD VALUE no puede ir dentro de una transacción - necesitamos neon con { fullResults: false }

const { neon, neonConfig } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
let DATABASE_URL = envContent.match(/DATABASE_URL="([^"]+)"/)[1];

// Convertir URL de pooler a URL directa (sin -pooler en el hostname)
const directURL = DATABASE_URL.replace('-pooler', '');
console.log('Usando URL directa (sin pooler)...');

const sql = neon(directURL);

async function fixEnum() {
  const needed = ['accepted', 'on_the_way', 'on_site'];

  for (const val of needed) {
    try {
      console.log(`Agregando "${val}"...`);
      // Usar sql.unsafe() con transaction: false para evitar transacción implícita
      await sql.unsafe(`ALTER TYPE order_status ADD VALUE IF NOT EXISTS '${val}'`, [], { fullResults: false });
      console.log(`  ✅ "${val}" OK`);
    } catch(e) {
      if (e.message && e.message.includes('already exists')) {
        console.log(`  ✓ "${val}" ya existe`);
      } else {
        console.error(`  ❌ Error con "${val}":`, e.message);
      }
    }
  }

  // Verificar resultado
  const result = await sql`
    SELECT enumlabel FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
    ORDER BY enumsortorder
  `;
  console.log('\nEnum final:', result.map(r => r.enumlabel).join(', '));
}

fixEnum();
