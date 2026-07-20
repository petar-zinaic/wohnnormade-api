# AGENTS.md

Compact companion to CLAUDE.md — only what an agent would likely miss on its own.

## Pre-existing Misspellings (don't "fix" without request)

- `TennantRepository.ts`, `validateTennantInput*`, `validateParamters.ts` — misspellings of Tenant/Parameters
- Docker container name: `wohnomade_api` (missing an 'n')
- `INTERNAL_CODE.UNHADLED_EXCEPTION` (should be UNHANDLED)

## Route Definition

Two patterns coexist. Prefer `asyncHandler` for new routes:
- **Preferred**: `asyncHandler(this._controller.method)` (TenantRoutes)
- **Legacy**: `.bind(this._controller)` (UserRoutes, CommunicationRoutes)

## Build & Runtime

- **Build is two-step**: `tsc --build` compiles TS→JS to `dist/`, then `cpx` copies `src/public/**` to `dist/public`. Swagger YAML won't appear in dist without a build.
- **Dev**: nodemon runs `ts-node -r tsconfig-paths/register src/server.ts` — path aliases work via tsconfig-paths.
- **Prod**: `module-alias/register` resolves aliases. Update both `tsconfig.json` paths AND `package.json._moduleAliases` for new aliases.
- **postinstall** automatically runs `npx prisma generate`.

## Environment Loading

- `src/config/environment.ts` loads `./environments/${NODE_ENV}` at startup (non-production only). npm scripts pass `-e environments/.env.local` via dotenv-cli, which sets `NODE_ENV=local`.
- **Seed** (`npm run seed`): `ts-node prisma/seed.ts` — no dotenv loading, instantiates own `PrismaClient`. Set `DATABASE_URL` in shell if it fails.

## Other

- `@assemblers` alias is defined but `src/assemblers/` directory does not exist yet.
- No tests. Verify via `npx tsc --noEmit`.
- No ESLint/Prettier — follow existing patterns.
