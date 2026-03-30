const { neon } = require('@neondatabase/serverless');

async function main() {
  require('dotenv').config();
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const users = await sql`SELECT id, email, role, is_active FROM users LIMIT 10`;
    console.log('Usuarios en la DB:', users);
  } catch (error) {
    console.error('Error DB:', error);
  }
}

main();
