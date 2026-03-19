# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

| Action | Command |
|---|---|
| Start local DB | `docker-compose up -d` |
| Dev server (local) | `npm run development:local` |
| Dev server (dev env) | `npm run development:dev` |
| Build | `npm run build` |
| Start production | `npm start` |
| Migrate (local) | `npm run migrate:local` |
| Migrate (dev) | `npm run migrate:dev` |
| Seed DB | `npm run seed` |
| Type check | `npx tsc --noEmit` |

There are no tests in this project. Verify changes by running `npx tsc --noEmit` to ensure type correctness.

## Architecture

### Four-Layer Pattern (strict)

```
Router → Controller → Service → Repository
```

Every domain follows this exact structure. **Never skip layers** — controllers don't access repositories directly, services don't import Express types, etc.

| Layer | Base Class | Holds | Location |
|---|---|---|---|
| Router | `BaseRoutes<Controller>` | `_controller`, Express `Router` | `src/router/` |
| Controller | `BaseController<Service>` | `_service`, `_responseHandler` | `src/controllers/` |
| Service | `BaseService<Repository>` | `_repository` | `src/services/` |
| Repository | `BaseRepository` | Prisma singleton | `src/repositories/database/` |

### Adding a New Domain

When adding a new domain (e.g. "Property"):

1. `src/repositories/database/PropertyRepository.ts` — extends `BaseRepository`
2. `src/services/PropertyService.ts` — extends `BaseService<PropertyRepository>`
3. `src/controllers/PropertyController.ts` — extends `BaseController<PropertyService>`
4. `src/router/PropertyRoutes.ts` — extends `BaseRoutes<PropertyController>`
5. Register in `src/router/AppRouter.ts` — `this.router.use("/property", new PropertyRoutes().routes)`
6. Add request types in `src/types/request/PropertyTypes.ts` and export from `src/types/request/index.ts`
7. Add response types in `src/types/response/PropertyTypes.ts` and export from `src/types/response/index.ts`
8. Add Joi validation schemas in `src/middlewares/validations/schemas/propertySchemas.ts`
9. Add validation middleware in `src/middlewares/validations/validatePropertyInput.ts`
10. Add Swagger docs in `src/public/documentation/property.yaml`
11. If new Prisma model needed: update `prisma/schema.prisma`, create migration

### Existing Domains & Routes

| Domain | Base Path | Auth Required |
|---|---|---|
| Auth | `/api/auth` | No (except change-password) |
| Users | `/api/users` | No |
| Tenants | `/api/tenant` | Create/Update/Delete only |
| Communications | `/api/communications` | All routes |

## Critical Conventions

### Response Format

ALL responses go through `ResponseHandler.processResponse()`:
```json
{ "result": <data or null>, "status": true, "error": {} }
```

Errors are thrown as `HttpException` subclasses:
```json
{ "result": {}, "status": false, "error": { "status": 4xx, "message": "...", "internal_code": "..." } }
```

### Error Handling

- Throw `HttpException` subclasses from `@exceptions` — never return error responses manually
- Controller methods **must** be wrapped with `asyncHandler` in route definitions
- New error types: create in `src/utility/exceptions/<Category>/`, add to `INTERNAL_CODE` enum, export from index
- Exception categories: `BadRequest/`, `Unauthorized/`, `Conflict/`, `Internal/`

### Route Definition Pattern

```typescript
// In routes file — always follow this exact order:
this._router.post(
  "/endpoint",
  authenticateToken,              // 1. Auth (if needed)
  validateSomething,              // 2. Validation middleware
  asyncHandler(this._controller.method)  // 3. Controller wrapped in asyncHandler
);
```

### Validation

- Joi schemas: `src/middlewares/validations/schemas/`
- Validator middleware: `src/middlewares/validations/`
- Always validate before the controller — never validate inside controllers or services

### Authentication

`authenticateToken` middleware verifies JWT Bearer token and sets `req.userId: number`. Apply it as route middleware before the controller call.

## Path Aliases

TypeScript paths (`tsconfig.json`) and runtime aliases (`package.json` `_moduleAliases`) **must stay in sync**. When adding a new alias, update both files.

| Alias | Path |
|---|---|
| `@database` | `src/utility/database/PrismaSingleton` |
| `@exceptions` | `src/utility/exceptions` |
| `@middlewares` | `src/middlewares` |
| `@requestType` | `src/types/request` |
| `@responseType` | `src/types/response` |
| `@repository` | `src/repositories` |
| `@services` | `src/services` |
| `@controllers` | `src/controllers` |
| `@config` | `src/config` |
| `@utility` | `src/utility` |
| `@enums` | `src/enums` |
| `@public` | `src/public` |
| `@assemblers` | `src/assemblers` |

## Database

- **ORM**: Prisma with PostgreSQL
- **Singleton**: Always use `PrismaSingleton` from `@database` — never instantiate `PrismaClient` directly
- **Models**: User, Tenant, LandlordCommunication (see `prisma/schema.prisma`)
- **Migrations**: After changing schema, run `npm run migrate:local` to create migration
- **Pagination**: Use `BaseRepository.formatPaginatedResponse()` for list endpoints

## Environment Variables

Stored in `environments/` (gitignored). Required:
- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — JWT signing/verification secret
- `RESEND_API_KEY` — Resend email API key
- `PORT` (default: 3000), `NODE_ENV`, `FROM_EMAIL`, `CLIENT_URL`

## API Documentation

Swagger YAML files in `src/public/documentation/`. Merged automatically by `swaggerHelper.ts` and served at:
- `/docs` — Swagger UI
- `/swagger.yaml` — Raw spec

Add one YAML file per domain — it's auto-discovered.

## Deployment

- **Platform**: Railway (see `railway.toml`)
- **Start**: `npx prisma migrate deploy && npm start`
- **Health check**: `GET /api` (300s timeout)
- **No CI/CD pipeline** — deploys on push to main via Railway

## Code Style Notes

- TypeScript strict mode is enabled
- No ESLint/Prettier configured — follow existing patterns
- Enums for HTTP status codes (`src/enums/server.ts`) and internal error codes (`src/enums/exception.ts`)
- Email sending (via Resend) is best-effort — failures don't crash operations
- Winston logger for structured logging (`src/utility/logger/`)
