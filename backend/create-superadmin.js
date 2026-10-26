const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function createSuperAdmin() {
  try {
    await client.connect();
    console.log('🔌 Conectado a la base de datos...');

    const email = 'superadmin@cobraya.com';
    const password = 'Admin123456';
    const hashedPassword = await bcrypt.hash(password, 8);

    // 1. Crear o asegurar una empresa para este usuario
    const companyRes = await client.query(`
      INSERT INTO company (ruc, "razonSocial", "sunatEnvironment", status, plan) 
      VALUES ('10000000001', 'Super Admin Corp', 'DEMO', 'ACTIVE', 'PRO') 
      ON CONFLICT (ruc) DO UPDATE SET "razonSocial" = EXCLUDED."razonSocial"
      RETURNING id
    `);
    const companyId = companyRes.rows[0].id;

    // 2. Crear o actualizar el usuario como SUPER_ADMIN
    const userRes = await client.query(`
      INSERT INTO "user" (email, password, role, "companyId") 
      VALUES ($1, $2, 'SUPER_ADMIN', $3)
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'SUPER_ADMIN'
      RETURNING email, role
    `, [email, hashedPassword, companyId]);

    console.log('');
    console.log('🎉 ¡SUPER ADMIN CREADO/ACTUALIZADO CON ÉXITO! 🎉');
    console.log('📧 Correo: ' + userRes.rows[0].email);
    console.log('🔑 Contraseña: ' + password);
    console.log('');
    console.log('🚀 Ahora ve a http://localhost:5173/super-admin e inicia sesión.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createSuperAdmin();