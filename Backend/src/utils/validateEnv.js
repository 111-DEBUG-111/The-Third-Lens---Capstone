const path = require('path');
const dotenv = require('dotenv');

// Load Backend/.env explicitly
const envPath = path.resolve(__dirname, '..', '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`Failed to load .env from ${envPath}`);
  process.exit(1);
}

const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
try {
  const parsed = new URL(dbUrl);
  const protocol = parsed.protocol.replace(':', '');
  if (!['mysql', 'postgres', 'postgresql', 'mariadb', 'mongodb', 'sqlserver'].includes(protocol)) {
    console.warn(`DATABASE_URL protocol (${protocol}) looks unusual. Expected mysql/postgres/mariadb/mongodb/sqlserver.`);
  }
  // Detect multiple '@' which often means unencoded special chars in username/password
  const atCount = (dbUrl.match(/@/g) || []).length;
  if (atCount > 1) {
    console.warn('DATABASE_URL contains multiple "@" characters. If your DB password contains special characters (e.g. @, : or /), URL-encode them (percent-encoding).');
  }
} catch (err) {
  console.error('DATABASE_URL is not a valid URL:', err.message);
  process.exit(1);
}

console.log('.env validation passed — required variables present and DATABASE_URL looks valid.');
process.exit(0);
