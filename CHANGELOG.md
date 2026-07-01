# Changelog

All notable changes to Tasiki are recorded here. Each version maps to a git tag
and a Prisma migration. Entries are framed by the feedback that drove them
(Lehman's Law 8 — the Feedback System).

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).

## [2.0.0] — 2026-07-01

Full CRUD — tasks are no longer write-once.

> **Feedback driving this release:** "I typo'd a task and there was no way to fix
> it — I had to leave it wrong. And I want to jot a note under a task." → task
> editing, a description field, and delete.

### Added
- **Edit a task** — `PATCH /tasks/:id` (partial update of title / description /
  done). Mobile: a dedicated edit screen (tap a task to open it).
- **Delete a task** — `DELETE /tasks/:id`. Mobile: swipe a row left to reveal
  Delete.
- **Description field** on tasks (`Task.description`, nullable) plus an
  `updatedAt` timestamp. Prisma migration `add_task_description_updatedat`.
- Stricter request validation via dedicated `UpdateTaskDto` (class-validator).

### Fixed
- Editing a task and clearing its description now persists as empty rather than
  keeping the old text (send `null` to clear).

[2.0.0]: https://example.com/tasiki/releases/tag/v2.0.0

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
