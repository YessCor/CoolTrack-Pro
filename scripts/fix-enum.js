// Script para revisar y corregir el enum order_status en NeonDB
// Ejecutar con: node scripts/fix-enum.js

const { neon } = require('@neondatabase/serverless');

// Leer .env manualmente
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
if (!dbUrlMatch) {
  console.error('No se encontró DATABASE_URL en .env');
  process.exit(1);
}
const DATABASE_URL = dbUrlMatch[1];
const sql = neon(DATABASE_URL);

async function fixEnum() {
  try {
    // Ver valores actuales
    const enumValues = await sql`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
      ORDER BY enumsortorder;
    `;
    console.log('\n--- VALORES ACTUALES del enum order_status ---');
    const labels = enumValues.map(r => r.enumlabel);
    console.log(labels);

    // Valores que el app necesita
    const needed = ['accepted', 'on_the_way', 'on_site', 'in_progress', 'completed', 'cancelled'];
    
    for (const val of needed) {
      if (!labels.includes(val)) {
        console.log(`\n⚠️  Falta "${val}" - Agregando al enum...`);
        // ADD VALUE no puede ir dentro de una transacción, se ejecuta directamente
        await sql.unsafe(`ALTER TYPE order_status ADD VALUE IF NOT EXISTS '${val}';`);
        console.log(`✅  "${val}" agregado exitosamente.`);
      } else {
        console.log(`✓  "${val}" ya existe.`);
      }
    }

    // Estado final
    const finalEnum = await sql`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
      ORDER BY enumsortorder;
    `;
    console.log('\n--- ENUM FINAL (order_status) ---');
    console.log(finalEnum.map(r => r.enumlabel));
    console.log('\n✅ Corrección completada. Ahora el API puede aceptar trabajos.');

  } catch (e) {
    console.error('\n❌ Error:', e.message || e);
  }
}

fixEnum();
