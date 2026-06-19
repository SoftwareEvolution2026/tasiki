# Changelog

All notable changes to Tasiki are recorded here. Each version maps to a git tag
and a Prisma migration. Entries are framed by the feedback that drove them
(Lehman's Law 8 — the Feedback System).

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] — 2026-06-19

The baseline release — the system everything else evolves from.

> **Feedback driving this release:** "I need somewhere private to keep my tasks
> on my phone, and they shouldn't be visible to anyone else." → authentication
> and per-user task isolation from day one.

### Added
- **Monorepo** — pnpm workspace tying together `shared`, `server`, and `mobile`.
- **Auth** — register / login / refresh / logout with JWT **access + refresh**
  tokens. Refresh tokens are stored hashed and rotated on every use; passwords
  are hashed with bcrypt. `GET /auth/me` restores a session on app launch.
- **Tasks** — user-scoped create, list, and toggle-done.
- **API docs** — Swagger UI at `/api/docs`.
- **Mobile** — Expo (expo-router) app with login & register screens, secure
  token storage (`expo-secure-store`), an axios refresh interceptor, and a
  single Tasks screen.
- **Database** — Prisma + SQLite with `User`, `Task`, and `RefreshToken` models
  (migration `init`).

### Deliberately deferred
- Full task editing/deletion → **v2.0**. Keeping each release a digestible
  increment is part of the exercise (Conservation of Familiarity).

[1.0.0]: https://example.com/tasiki/releases/tag/v1.0.0
