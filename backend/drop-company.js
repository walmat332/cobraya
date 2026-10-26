const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('🔌 Conectado a la base de datos...');
  console.log('🗑️  Eliminando tabla company corrupta...');
  await client.query('DROP TABLE IF EXISTS company CASCADE;');
  console.log('✅ ¡Tabla eliminada exitosamente! Ahora TypeORM podrá recrearla.');
  await client.end();
}

run().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
