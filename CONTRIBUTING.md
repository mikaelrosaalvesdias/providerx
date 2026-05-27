# Contributing

This is a proprietary internal project for ProviderX/Cariap.

## Development flow

1. Create a branch from `main`.
2. Keep changes scoped to the requested module.
3. Do not commit secrets or generated artifacts.
4. Run validations before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run build
```

5. Document changes when they affect setup, deploy, environment variables or planning rules.

## Code guidelines

- Prefer existing patterns in `src/app`, `src/components` and `src/lib`.
- Keep planning entities configurable in Admin.
- Do not add CRM, proposals, contracts, commissions, knowledge, quizzes or certificates to the MVP scope.
- Keep route protection server-side.
- Keep UI links filtered by permission.
- Register critical actions in audit logs.

## Pull request checklist

- Scope is clear.
- No `.env` or secret is committed.
- Migrations are included when schema changes.
- Seeds are updated when required.
- README/docs are updated when behavior or deploy changes.
- Lint, typecheck and build pass.
