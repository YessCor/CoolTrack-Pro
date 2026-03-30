import pkg from '@neondatabase/serverless';
const { neon } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    // Check current enum values
    const enumValues = await sql`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
      ORDER BY enumsortorder;
    `;
    console.log('--- VALORES ACTUALES DEL ENUM order_status ---');
    console.table(enumValues);

    const labels = enumValues.map(r => r.enumlabel);
    console.log('\nValores:', labels);

    // Add missing values if needed
    const needed = ['accepted', 'on_the_way', 'on_site', 'in_progress'];
    for (const val of needed) {
      if (!labels.includes(val)) {
        console.log(`\n⚠️  Falta el valor: "${val}" - Agregando...`);
        await sql.unsafe(`ALTER TYPE order_status ADD VALUE IF NOT EXISTS '${val}';`);
        console.log(`✅  Valor "${val}" agregado.`);
      } else {
        console.log(`✅  Valor "${val}" ya existe.`);
      }
    }

    // Verify final state
    const finalEnum = await sql`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
      ORDER BY enumsortorder;
    `;
    console.log('\n--- ENUM FINAL ---');
    console.table(finalEnum);

  } catch (e) {
    console.error('Error:', e.message);
  }
}

check();
