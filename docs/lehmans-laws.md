# Lehman's Laws of Software Evolution — Tasiki

This document is the evidence log for the coursework. Tasiki is built across **6
versions** (v1.0 → v6.0); each version is a git tag, a Prisma migration, and a
CHANGELOG entry. The tables below are extended once per release.

## The 8 laws and how Tasiki evidences them

| # | Law | How it shows up in Tasiki |
|---|-----|---------------------------|
| 1 | **Continuing Change** | A v1-only app goes stale; every later version exists because the system must keep changing to stay useful. |
| 2 | **Increasing Complexity** | Complexity creeps in v3 (sorting/filtering conditionals) and clearly in v4 (coupled Tasks ↔ Categories modules); it is *deliberately fought* in v5. |
| 3 | **Self-Regulation** | Plot features-per-release — it settles into a steady rhythm rather than growing without bound. |
| 4 | **Conservation of Organizational Stability** | *(solo reframe)* roughly constant effort per release — commits/hours per version stay similar regardless of feature pressure. |
| 5 | **Conservation of Familiarity** | Each release is a bounded, digestible increment — never a 10-feature dump. v1 ships auth + basic tasks only; full CRUD waits for v2. |
| 6 | **Continuing Growth** | LOC, endpoint count, and Prisma model count rise monotonically across v1→v6. |
| 7 | **Declining Quality** | Bugs-per-version creep up, peaking before a refactor version that pays down the debt. |
| 8 | **Feedback System** | Every CHANGELOG entry is framed as driven by a user-feedback / bug-report item. |

## Per-version metrics

> LOC = hand-written TypeScript/TSX source (excludes `node_modules`, `dist`,
> generated Prisma client). Endpoints includes the `/health` probe.

| Version | LOC  | Endpoints | Screens | Prisma models | Migrations | Bugs logged |
|---------|------|-----------|---------|---------------|------------|-------------|
| v1.0    | 1333 | 9         | 3       | 3             | 1          | 0           |
| v2.0    | 1731 | 11        | 4       | 3             | 2          | 1           |

**Deltas v1→v2:** +398 LOC, +2 endpoints (`PATCH /tasks/:id`, `DELETE /tasks/:id`),
+1 screen (edit), +1 migration. First bug logged — the start of the
Declining-Quality trend (Law 7). Growth continues on every axis except model
count, which holds steady this release (Law 6).

## Roadmap (planned)

| Version | Theme | Headline change |
|---------|-------|-----------------|
| v1.0 | MVP + auth | JWT access/refresh auth, user-scoped tasks (create/list/toggle) |
| v2.0 | Full CRUD + validation | edit/delete tasks, `description`/`updatedAt` |
| v3.0 | Due dates & priorities | `dueDate` + `priority`, sorting/filtering |
| v4.0 | Categories | Categories module, Task ↔ Category relation |
| v5.0 | The big refactor (fighting decay) | break up the god `TasksService`, repository layer + offline sync |
| v6.0 | Reminders + search + export | scheduled reminders, search, CSV/JSON export |

### Narrative note — auth moved to v1

The original roadmap deferred authentication to v5 as the "Declining Quality
forced a refactor" centrepiece. For this build, **JWT auth ships in v1** (tasks
are user-scoped from day one). To keep the Law 7 narrative intact, **v5's
Declining-Quality beat becomes an internal refactor** — decomposing the
overgrown `TasksService` that accumulates conditionals across v3–v4, introducing
a repository layer, and adding offline sync — rather than an auth bolt-on.
