# Panora UI

## Infrastructure source of truth

Panora uses a hosted Neon PostgreSQL database. Its connection is already configured through the repository environment files via `DATABASE_URL`.
Do not introduce, recommend, or assume Docker, Docker Compose, or a local PostgreSQL database for development, testing, migrations, or deployment.
Run migrations directly against the configured Neon database with `bun run migrate`.
Run the application with `bun run dev` and the document-indexing worker separately with `bun run knowledge:worker`.
Never print or commit database credentials from the environment files.

All reusable UI belongs in `src/interface/components`.
Follow `DESIGN.md` for colors and typography, and Tamagui Bento for everything else.
Use semantic tokens, accessible states, responsive composition, and cross-platform Tamagui APIs.
Reuse an existing component before creating a feature-local UI primitive.
Run typecheck, lint, tests, and the UI catalog checks after UI changes.
