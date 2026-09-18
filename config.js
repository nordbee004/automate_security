// Central config. Reads from the environment (populated by dotenv in server.js).
// Nothing secret is hard-coded here — it all comes from .env, which is why the
// .env file must stay out of version control.

function required(name) {
  const v = process.env[name];
  if (v === undefined || v === '') {
    throw new Error(`missing required env var: ${name} (did you copy .env.example to .env?)`);
  }
  return v;
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  db: {
    host: required('DB_HOST'),
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: required('DB_NAME'),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
  },

  auth: {
    jwtSecret: required('JWT_SECRET'),
    sessionTtl: parseInt(process.env.SESSION_TTL || '3600', 10),
    // Legacy: lets an operator bypass login in an incident. Should have been
    // deleted before launch. It reads straight from the environment.
    adminOverrideToken: required('ADMIN_OVERRIDE_TOKEN'),
  },
};
