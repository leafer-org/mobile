# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expo 55 + React Native mobile app with TypeScript, featuring authentication (OTP + profile setup). Uses Expo Router for file-based navigation.

## Commands

- `yarn dev` — Start Expo dev server
- `yarn android` / `yarn ios` / `yarn web` — Platform-specific builds
- `yarn lint` — Run Biome linter/formatter on `src/`
- `yarn api` — Regenerate API types from `http-contracts/main.yaml` using openapi-typescript

No test runner is configured.

## Tech Stack

- **Styling**: NativeWind 5.0 (Tailwind CSS for React Native), dark mode via system theme
- **State**: React Context + custom reducer pattern (`createReducerContext`), RxJS for side effects
- **Data Fetching**: TanStack React Query + openapi-fetch + openapi-react-query
- **Validation**: Zod (env vars, forms)
- **Linting**: Biome 2.4 with strict rules (100 char line width, no console, exhaustive switch cases, 50 cognitive complexity, 70 lines per function)
- **Package Manager**: Yarn 4 (node-modules linker)
- **Auth**: JWT with expo-secure-store, automatic token refresh

## Architecture

### Directory Layout

- `src/app/` — Expo Router file-based routes. `(auth)/` group for login flow, `(app)/` group for authenticated screens.
- `src/features/` — Feature modules with consistent structure: `domain/` (types & pure functions), `model/` (business logic & hooks), `ui/` (components), `compose/` (screen composition), `index.ts` (public API). See [architecture/feature.md](architecture/feature.md) for full details.
- `src/kernel/` — Core infrastructure: API client setup, session/token management, theme, shared UI components (design system), environment config.
- `src/lib/` — Generic reusable utilities: API context factory, error types, React hooks, RxJS helpers.
- `src/support/` — Domain-specific shared features (e.g., user queries).

### API Layer

OpenAPI-first approach. The `http-contracts` git submodule contains YAML specs. Running `yarn api` generates TypeScript types into `src/kernel/api/schema.ts` (do not edit manually).

Two fetch clients exist in `src/kernel/api/`:
- `publicFetchClient` — No auth (used for login/OTP endpoints)
- Authenticated client with `authMiddleware` that injects JWT and handles 401s

`createApiContext<Paths>()` in `src/lib/api/context.tsx` is a factory that creates typed React context + hooks for any OpenAPI spec.

### Session & Token Management

`src/kernel/session/` handles JWT lifecycle:
- Tokens stored in expo-secure-store
- Access token refresh with deduplication (prevents race conditions)
- Pessimistic 60s buffer before expiration triggers refresh
- 401 errors broadcast via RxJS Subject, triggering logout and navigation to phone screen

### State Pattern

`createReducerContext` in `src/lib/` provides type-safe context + useReducer without Redux. Separates state and dispatch into distinct contexts. Used for feature-local state like OTP flow.

## Conventions

- Path alias: `@/` maps to `src/`
- Use `cn()` from `@/kernel/ui/utils/cn` for className merging (clsx + tailwind-merge)
- Feature modules expose public API through barrel `index.ts`
- React Compiler is enabled (configured in app.json)
- Typed routes are enabled for Expo Router
