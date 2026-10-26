const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('🔌 Conectado a la base de datos...');
  
  console.log('🗑️  Eliminando tablas conflictivas (user, company)...');
  // Usamos CASCADE para eliminar dependencias automáticamente
  await client.query('DROP TABLE IF EXISTS "user" CASCADE;');
  await client.query('DROP TABLE IF EXISTS company CASCADE;');
  
  console.log('✅ ¡Tablas eliminadas! TypeORM ahora puede reconstruirlas sin errores.');
  await client.end();
}

run().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
