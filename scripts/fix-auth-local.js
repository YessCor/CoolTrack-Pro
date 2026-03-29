const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log(`Generando hash local para "${password}": ${hash}`);
  
  try {
    const result = await sql`
      UPDATE users 
      SET password_hash = ${hash} 
      WHERE email = 'yesidcordero1@gmail.com'
      RETURNING id, email, role;
    `;
    
    if (result.length > 0) {
      console.log('✅ Base de Datos actualizada con éxito para yesidcordero1@gmail.com');
      console.log(`Email: ${result[0].email}`);
      console.log(`Password: ${password}`);
    } else {
      console.log('❌ No se encontró al usuario yesidcordero1@gmail.com');
    }
  } catch (e) {
    console.error('Error actualizando DB:', e);
  }
}

run();
