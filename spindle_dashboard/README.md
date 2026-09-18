# SPINDLE dashboard

Small internal API for the SPINDLE field-unit dashboard.

## Setup

```bash
npm install
cp .env.example .env      # then fill in real values
npm start
```

The service reads all configuration from the environment. Copy `.env.example`
to `.env` and populate it — **never commit `.env`** (it's in `.gitignore`).

## Endpoints

| Method | Path      | Auth                         | Description            |
|--------|-----------|------------------------------|------------------------|
| GET    | `/`       | none                         | service banner         |
| GET    | `/health` | none                         | db target + liveness   |
| GET    | `/admin`  | `X-Admin-Override` header     | legacy operator bypass |

## Notes for reviewers

The `/admin` route still honours the legacy `X-Admin-Override` header, which is
compared against `ADMIN_OVERRIDE_TOKEN` from the environment. This was meant to
be removed before GA. Treat that token as a credential.

---

### For challenge authors (remove before handing out)

This repo is a deliberately vulnerable artifact: the flag is committed in `.env`
under `ADMIN_OVERRIDE_TOKEN`, even though `.gitignore` claims to exclude it. Two
intended solves:

1. **Static:** open `.env` (or `git log -p -- .env` if you ship it as a git
   history) and read the token.
2. **Dynamic:** run the app and replay the token against the live route:
   ```bash
   curl -s localhost:3000/admin -H "X-Admin-Override: <token from .env>"
   ```
   A `role: admin` response confirms the flag is the real credential, not a decoy
   (the other secrets in `.env` — DB password, JWT secret, Stripe key — are
   plausible-looking distractors).

To ship the "committed by accident" story properly, initialise a git repo,
commit `.env` in an early commit, then add the `.gitignore` in a later one, so
`git log` tells the story of the mistake.
