/**
 * Task priority. Reserved for v3.0 (due dates & priorities) — declared now so
 * the contract grows additively rather than breaking later.
 */
export enum Priority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

/** A task as returned by the API. */
export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

/** Payload for creating a task. */
export interface CreateTaskInput {
  title: string;
}
