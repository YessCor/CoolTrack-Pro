import pkg from '@neondatabase/serverless';
const { neon } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const users = await sql`
      SELECT id, email, name, role, is_active 
      FROM users 
      LIMIT 10;
    `;
    console.log('--- USUARIOS EN BASE DE DATOS ---');
    console.table(users);
    
    if (users.length === 0) {
      console.log('No hay usuarios. Creando tecnico de prueba...');
      // Contraseña: password123 (Hash generado con bcrypt)
      const hash = '$2a$10$7zB3rR81bXU.C6Tf7Bly7.o7bC7Tz/0eC6Xo3Xy.O9v3.F91XQ1O6'; 
      await sql`
        INSERT INTO users (email, name, password_hash, role, is_active)
        VALUES ('tecnico@test.com', 'Tecnico de Prueba', ${hash}, 'TECHNICIAN', true)
      `;
      console.log('Usuario creado: tecnico@test.com / password123');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

check();
