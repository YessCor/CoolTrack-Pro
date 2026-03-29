const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function reset() {
  try {
    const hash = '$2a$10$7zB3rR81bXU.C6Tf7Bly7.o7bC7Tz/0eC6Xo3Xy.O9v3.F91XQ1O6'; // password123
    
    await sql`
      UPDATE users 
      SET password_hash = ${hash}
      WHERE email IN ('admin@cooltrack.com', 'tech@cooltrack.com', 'yesidcordero1@gmail.com', 'client@cooltrack.com');
    `;
    
    console.log('--- CONTRASEÑAS REESTABLECIDAS ---');
    console.log('Admin: admin@cooltrack.com / password123');
    console.log('Tech 1: tech@cooltrack.com / password123');
    console.log('Tech 2: yesidcordero1@gmail.com / password123');
    console.log('Client: client@cooltrack.com / password123');
  } catch (e) {
    console.error('Error:', e);
  }
}

reset();
