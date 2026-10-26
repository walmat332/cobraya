const bcrypt = require('bcrypt');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function resetPassword() {
  try {
    await client.connect();
    const nuevaPassword = 'CobraYa2024!';
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    
    const email = 'desing.fotografia.m@gmail.com';
    
    const query = `UPDATE "user" SET password = $1 WHERE email = $2 RETURNING email, role`;
    
    const result = await client.query(query, [hashedPassword, email]);

    if (result.rows.length > 0) {
      console.log('\n✅ ¡CONTRASEÑA RESTABLECIDA CON ÉXITO!');
      console.log('📧 Correo:', result.rows[0].email);
      console.log('🔑 Nueva Contraseña:', nuevaPassword);
      console.log('\n🔄 Ahora ve al frontend e inicia sesión con estos datos.');
    } else {
      console.log('⚠️ No se encontró el usuario con ese correo.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

resetPassword();
