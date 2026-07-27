# Panora

> **[Takeout Pro](https://tamagui.dev/takeout)** - The full version with more features, templates, and support.

> **⚠️ v2-beta** - This stack is in active development. APIs may change.

Panora is a full-stack, cross-platform application built from Takeout Free. Its
public landing page is an ephemeral AI chat powered by a server-only OpenRouter
proxy; the original auth, Zero, database, Docker, and migration foundations are
retained for future features.

## Prerequisites

Before you begin, ensure you have:

- **Bun** - [Install Bun](https://bun.sh)
- **Docker** - [Install Docker](https://docs.docker.com/get-docker/) (on macOS,
  we recommend [OrbStack](https://orbstack.dev) as a faster alternative)
- **Git** - For version control

For mobile development:

- **iOS**: macOS with Xcode 16+
- **Android**: Android Studio with JDK 17+

## Quick Start

```bash
bun install
bun backend      # start docker services (postgres, zero)
bun dev          # start web dev server at http://localhost:8092
```

## Stack

At a high level, the primary technologies used are:

- [One](https://onestack.dev) - Universal React framework
- [Zero](https://zero.rocicorp.dev) - Real-time sync
- [Tamagui](https://tamagui.dev) - Universal UI
- [Better Auth](https://www.better-auth.com) - Authentication
- [Drizzle ORM](https://orm.drizzle.team) - Database schema

## Project Structure

```
panora/
├── app/                   # File-based routing (One router)
│   ├── auth/              # Login and signup flows
│   ├── index.tsx          # Public Panora chat landing page
│   └── api/               # API routes
├── src/
│   ├── features/          # Feature modules (chat, auth, storage, theme)
│   ├── interface/         # Reusable UI components
│   ├── database/          # Database schema and migrations
│   ├── data/              # Zero schema, models, and queries
│   ├── zero/              # Real-time sync configuration
│   ├── server/            # Server-side code
│   └── tamagui/           # Theme configuration
├── scripts/               # CI/CD and helper scripts
├── docs/                  # Documentation
└── assets/                # Images, fonts, splash screens
```

## Common Commands

```bash
# development
bun dev                      # start web + mobile dev server
bun ios                      # run iOS simulator
bun android                  # run Android emulator
bun backend                  # start docker services

# code quality
bun check                    # typescript type checking
bun lint                     # run oxlint
bun lint:fix                 # auto-fix linting issues

# testing
bun test:unit                # unit tests
bun test:integration         # integration tests

# database
bun migrate                  # build and run migrations

# deployment
bun ci --dry-run             # run full CI pipeline without deploy
bun ci                       # full CI/CD with deployment
```

## Database

### Local Development

PostgreSQL runs in Docker on port 5444:

- Main database: `postgresql://user:password@localhost:5444/postgres`
- Zero sync databases: `zero_cvr` and `zero_cdb`

### Migrations

Update your schema in:

- `src/database/schema-public.ts` - Public tables (exposed to Zero/client)
- `src/database/schema-private.ts` - Private tables

Then run:

```bash
bun migrate
```

## Environment Configuration

### File Structure

- `.env.development` - Development defaults (committed)
- `.env` - Active environment (generated, gitignored)
- `.env.local` - Personal secrets/overrides (gitignored)
- `.env.production` - Production config (gitignored)
- `.env.production.example` - Production template (committed)

### Key Variables

```bash
# authentication
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=<url>

# server
ONE_SERVER_URL=<url>

# zero
ZERO_UPSTREAM_DB=<connection-string>
ZERO_CVR_DB=<connection-string>
ZERO_CHANGE_DB=<connection-string>

# storage (S3/R2)
CLOUDFLARE_R2_ENDPOINT=<endpoint>
CLOUDFLARE_R2_ACCESS_KEY=<key>
CLOUDFLARE_R2_SECRET_KEY=<secret>
```

See `.env.production.example` for complete production configuration.

### Panora Chat

```bash
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

`OPENROUTER_API_KEY` is server-only. The model is optional and defaults to
`openai/gpt-4o-mini`. Public chat requests are limited to 20 messages and 16,000
aggregate characters, 10 requests per client per minute, and two concurrent
requests. Configure an OpenRouter account spending cap as well: process-local
rate limiting cannot fully prevent distributed abuse, and multi-instance
deployments should enforce the same policy at the edge or in a shared store.

## Mobile Apps

### iOS

```bash
bun ios          # run in simulator
```

Requires macOS, Xcode 16+, and iOS 17.0+ deployment target.

### Android

```bash
# One-time: create an Android Studio AVD (Device Manager).
# The app requires JDK 17 and Android SDK Platform 36.
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

# Start everything and keep this command running for Fast Refresh.
bun android
```

`bun android` starts or reuses an emulator, starts or reuses Metro, performs an
incremental native build, installs **Panora (Dev)**, configures ADB port
reversal, and opens the custom client at `localhost:8081`. It does not use Expo
Go or depend on the machine's LAN IP. Use `bun run android:open` only when you
want to reconnect an already-installed client without rebuilding. Press
`Ctrl+C` to stop Metro; the emulator remains available for the next run.

For a shareable APK, use `bun run android:apk`; use `bun run
android:production` for the Play Store AAB.

Requires Android Studio, JDK 17, and Android SDK Platform 36.

## Adding Features

### Data Models

1. Add schema to `src/database/schema-public.ts`
2. Run `bun migrate`
3. Add Zero model to `src/data/models/`
4. Run `bun zero:generate`
5. Use queries in your components

### UI Components

Reusable components live in `src/interface/`. Use components from there rather
than importing directly from Tamagui when possible.

### Icons

This project uses [Phosphor Icons](https://phosphoricons.com/). Icons are in
`src/interface/icons/phosphor/`.

## License

MIT
