/**
 * @tasiki/shared — the typed contract between the Tasiki server and mobile app.
 *
 * These are framework-free types only: no runtime code, no dependencies. The
 * server validates against them with class-validator DTOs; the mobile app
 * imports them as `import type` so they are erased at build time.
 */

export * from './auth';
export * from './task';
export * from './user';
