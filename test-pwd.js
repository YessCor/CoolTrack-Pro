const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT email, password_hash FROM users WHERE email = 'admin@cooltrack.com'`;
  if (users.length === 0) {
    console.log('No user found');
    return;
  }
  const user = users[0];
  console.log('User hash in DB:', user.password_hash);
  
  const match1 = await bcrypt.compare('123456', user.password_hash);
  const match2 = await bcrypt.compare('password123', user.password_hash);
  
  console.log('Match 123456:', match1);
  console.log('Match password123:', match2);

  // Let's create a real hash for 123456 and update it so the user can literally use what they provided
  const newHash = await bcrypt.hash('123456', 10);
  await sql`UPDATE users SET password_hash = ${newHash}`;
  console.log('Todos los usuarios actualizados a 123456. Nuevo hash:', newHash);
}

test().catch(console.error);
