<p align="center">
  <img src="./assets/logo/tasiki-logo.svg" alt="Tasiki" width="320" />
</p>

# Tasiki

A cross-platform task manager — **NestJS** API + **React Native (Expo)** mobile app, sharing a typed contract layer — built incrementally across **6 versions** to demonstrate **Lehman's 8 Laws of Software Evolution** for coursework.

The interesting artifact here is not the app: it is the *history*. Every version is a git tag, a Prisma migration, and a CHANGELOG entry. See [`docs/lehmans-laws.md`](./docs/lehmans-laws.md) for how each law is evidenced.

## Monorepo layout

| Package          | Stack                                   | Role                                  |
| ---------------- | --------------------------------------- | ------------------------------------- |
| `shared`         | TypeScript                              | API contracts shared by server + app  |
| `server`         | NestJS · Prisma · SQLite · Swagger · JWT | REST API                              |
| `mobile`         | Expo · React Native · expo-router · TS  | Mobile client                         |

## v1.0 — what's here

- pnpm workspace tying the three packages together.
- **Auth**: register / login / refresh / logout with JWT **access + refresh** tokens (rotating, DB-stored refresh tokens, bcrypt password hashing).
- **Tasks**: user-scoped create / list / toggle-done.
- **Swagger** API docs at `/api/docs`.
- Mobile: login & register screens, secure token storage, a single Tasks screen.

> Full task editing/deletion arrives in v2.0 — keeping each release a digestible increment is itself part of the exercise (Conservation of Familiarity).

## Getting started

```bash
# from repo root
pnpm install

# --- server ---
cp server/.env.example server/.env      # then edit secrets
pnpm server:migrate                     # creates SQLite db + migration
pnpm server:dev                         # http://localhost:3000  (docs: /api/docs)

# --- mobile ---  (in a second terminal)
# set EXPO_PUBLIC_API_URL to your machine's LAN IP for physical devices
pnpm mobile:start
```

## Requirements

- Node 20+
- pnpm 10+
- Expo Go on your phone (or an emulator) for the mobile app
