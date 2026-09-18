// SPINDLE dashboard API.
// Loads environment from .env, then serves a tiny API. The interesting part for
// a security review is the admin-override header, which is compared against a
// value that lives only in the environment.

require('dotenv').config();
const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

// Public: nothing sensitive here.
app.get('/', (_req, res) => {
  res.json({
    service: 'spindle-dashboard',
    env: config.env,
    status: 'ok',
    note: 'nothing to see here. config is loaded from the environment.',
  });
});

// Public health check.
app.get('/health', (_req, res) => {
  res.json({ ok: true, db: `${config.db.host}:${config.db.port}/${config.db.name}` });
});

// "Protected": normally you'd log in for a JWT. But the legacy override header
// short-circuits auth if it matches the token from the environment.
app.get('/admin', (req, res) => {
  const provided = req.get('x-admin-override');
  if (provided && provided === config.auth.adminOverrideToken) {
    return res.json({
      ok: true,
      role: 'admin',
      message: 'override accepted — full access granted',
    });
  }
  return res.status(401).json({ ok: false, message: 'authentication required' });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`spindle-dashboard listening on :${config.port} (${config.env})`);
  });
}

module.exports = app;
