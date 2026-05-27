# Security Policy

## Secrets

This repository must not contain production secrets.

Do not commit:

- `.env`
- Database passwords
- Auth secrets
- API keys
- SMTP credentials
- Provider credentials
- Private tokens
- Real customer data

Use `.env.example` and `ENV_VARS.md` to document required variables.

## Authentication

The application uses:

- HTTP-only session cookie.
- `AUTH_SECRET` for token signing.
- bcrypt password hash.
- Server-side permission guards.

Sensitive routes must use `requireUser` or `requireAnyPermission`.

## Reporting

Report security issues privately to the project owner or ProviderX/Cariap technical responsible.

Do not open public issues with exploitable details, credentials, tokens, customer data or infrastructure secrets.
