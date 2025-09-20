
require('dotenv').config();
const crypto = require('crypto');

const dbUrl = process.env.NEON_DATABASE_URL;

if (!dbUrl) {
  console.error('Error: NEON_DATABASE_URL not found in .env file.');
} else {
  const hash = crypto.createHash('sha256').update(dbUrl).digest('hex');
  console.log('SHA256 Hash of NEON_DATABASE_URL:');
  console.log(hash);
}
